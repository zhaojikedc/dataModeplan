#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
hive_schema_from_json.py

Reads a JSON schema description and generates a Hive CREATE TABLE DDL.

Usage:
  python hive_schema_from_json.py --input schema.json --database db --table tbl \
      --external --location hdfs:///path --if-not-exists --output ddl.sql

JSON schema format (minimal):
{
  "database": "db_name",              # optional; can be overridden by CLI
  "table": "table_name",              # optional; can be overridden by CLI
  "external": true,                    # optional; can be overridden by CLI
  "comment": "table comment",         # optional
  "location": "hdfs:///warehouse/...",# optional; for EXTERNAL tables
  "stored_as": "parquet",             # optional; ORC/Parquet/TextFile/Avro etc
  "row_format": {                      # optional; for delimited text
    "fields_terminated_by": ",",
    "lines_terminated_by": "\n",
    "collection_items_terminated_by": null,
    "map_keys_terminated_by": null,
    "escaped_by": "\\"
  },
  "tblproperties": {                   # optional
    "transactional": "false"
  },
  "columns": [                         # required
    {"name": "id", "type": "bigint", "comment": "primary key"},
    {"name": "info", "type": {      # complex types supported
       "struct": {
         "name": "string",
         "age": "int"
       }
    }}
  ],
  "partitions": [                      # optional
    {"name": "dt", "type": "string", "comment": "partition date"}
  ]
}

Supported JSON type forms:
- Primitive strings: "string", "int", "bigint", "double", "boolean", "float",
  "binary", "timestamp", "date", "decimal(10,2)"
- Arrays: {"array": "string"}
- Maps: {"map": {"key": "string", "value": "int"}}
- Structs: {"struct": {"field1": "string", "field2": {"array": "int"}}}

This script focuses on producing clean DDL; it does not validate data files.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union


EXAMPLE_SCHEMA: Dict[str, Any] = {
    "database": "analytics",
    "table": "user_events",
    "external": True,
    "comment": "User event logs",
    "location": "hdfs:///warehouse/analytics.db/user_events",
    "stored_as": "parquet",
    "columns": [
        {"name": "event_id", "type": "string", "comment": "unique id"},
        {"name": "user_id", "type": "string"},
        {"name": "event_ts", "type": "timestamp"},
        {
            "name": "event_payload",
            "type": {"struct": {"page": "string", "duration": "int"}},
            "comment": "raw payload"
        },
        {"name": "attributes", "type": {"map": {"key": "string", "value": "string"}}}
    ],
    "partitions": [
        {"name": "dt", "type": "string", "comment": "yyyy-mm-dd"}
    ],
    "tblproperties": {"parquet.compression": "SNAPPY"}
}


def load_json_file(path: Union[str, Path]) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_identifier(name: str) -> str:
    if not name or not isinstance(name, str):
        raise ValueError("Identifier must be a non-empty string")
    return name


PrimitiveType = str


def hive_type_from_json(type_spec: Any) -> str:
    """Convert schema JSON type spec into Hive type string."""
    if isinstance(type_spec, str):
        return type_spec.strip()

    if isinstance(type_spec, dict):
        if "array" in type_spec:
            inner = hive_type_from_json(type_spec["array"])
            return f"array<{inner}>"
        if "map" in type_spec:
            mp = type_spec["map"]
            if not isinstance(mp, dict) or "key" not in mp or "value" not in mp:
                raise ValueError("map type must be an object with 'key' and 'value'")
            key_t = hive_type_from_json(mp["key"])  # Hive requires primitive keys
            val_t = hive_type_from_json(mp["value"])\
            
            return f"map<{key_t},{val_t}>"
        if "struct" in type_spec:
            st = type_spec["struct"]
            if not isinstance(st, dict):
                raise ValueError("struct type must map field -> type")
            fields: List[str] = []
            for fname, ftype in st.items():
                fields.append(f"{ensure_identifier(fname)}:{hive_type_from_json(ftype)}")
            inner = ",".join(fields)
            return f"struct<{inner}>"

    raise ValueError(f"Unsupported type spec: {type_spec}")


def quote_comment(comment: Optional[str]) -> Optional[str]:
    if comment is None:
        return None
    return comment.replace("'", "\\'")


def column_ddl(columns: List[Dict[str, Any]]) -> str:
    parts: List[str] = []
    for col in columns:
        name = ensure_identifier(col["name"]) if "name" in col else None
        if not name:
            raise ValueError("Each column must have a 'name'")
        ctype = hive_type_from_json(col.get("type", "string"))
        comment = quote_comment(col.get("comment"))
        if comment:
            parts.append(f"  `{name}` {ctype} COMMENT '{comment}'")
        else:
            parts.append(f"  `{name}` {ctype}")
    return ",\n".join(parts)


def partition_ddl(partitions: Optional[List[Dict[str, Any]]]) -> Optional[str]:
    if not partitions:
        return None
    parts: List[str] = []
    for p in partitions:
        name = ensure_identifier(p["name"]) if "name" in p else None
        if not name:
            raise ValueError("Each partition must have a 'name'")
        ptype = hive_type_from_json(p.get("type", "string"))
        comment = quote_comment(p.get("comment"))
        if comment:
            parts.append(f"  `{name}` {ptype} COMMENT '{comment}'")
        else:
            parts.append(f"  `{name}` {ptype}")
    return ",\n".join(parts)


def row_format_ddl(row_format: Optional[Dict[str, Any]]) -> Optional[str]:
    if not row_format:
        return None
    segs: List[str] = []
    f = row_format
    if f.get("fields_terminated_by") is not None:
        segs.append(f"FIELDS TERMINATED BY '{f['fields_terminated_by']}'")
    if f.get("collection_items_terminated_by") is not None:
        segs.append(
            f"COLLECTION ITEMS TERMINATED BY '{f['collection_items_terminated_by']}'"
        )
    if f.get("map_keys_terminated_by") is not None:
        segs.append(f"MAP KEYS TERMINATED BY '{f['map_keys_terminated_by']}'")
    if f.get("lines_terminated_by") is not None:
        segs.append(f"LINES TERMINATED BY '{f['lines_terminated_by']}'")
    if f.get("escaped_by") is not None:
        segs.append(f"ESCAPED BY '{f['escaped_by']}'")
    if not segs:
        return None
    return "ROW FORMAT DELIMITED \n  " + " \n  ".join(segs)


def tblproperties_ddl(props: Optional[Dict[str, Any]]) -> Optional[str]:
    if not props:
        return None
    items = ", ".join([f"'{k}'='{v}'" for k, v in props.items()])
    return f"TBLPROPERTIES ({items})"


def build_create_table(schema: Dict[str, Any], override_db: Optional[str], override_table: Optional[str], external_flag: Optional[bool]) -> str:
    database = ensure_identifier(override_db or schema.get("database", "default"))
    table = ensure_identifier(override_table or schema.get("table"))
    if not table:
        raise ValueError("Table name is required (in schema or via --table)")

    is_external = external_flag if external_flag is not None else bool(schema.get("external", False))

    comment = quote_comment(schema.get("comment"))
    columns = schema.get("columns", [])
    partitions = schema.get("partitions", [])
    stored_as = schema.get("stored_as")
    location = schema.get("location")
    row_format = schema.get("row_format")
    tblproperties = schema.get("tblproperties")

    lines: List[str] = []
    table_kw = "EXTERNAL TABLE" if is_external else "TABLE"
    lines.append(f"CREATE {table_kw} `{database}`.`{table}`")
    if comment:
        lines.append(f"COMMENT '{comment}'")
    lines.append("(")
    lines.append(column_ddl(columns))
    lines.append(")")

    part = partition_ddl(partitions)
    if part:
        lines.append("PARTITIONED BY (")
        lines.append(part)
        lines.append(")")

    rf = row_format_ddl(row_format)
    if rf:
        lines.append(rf)

    if stored_as:
        lines.append(f"STORED AS {stored_as}")

    if is_external and location:
        lines.append(f"LOCATION '{location}'")

    tp = tblproperties_ddl(tblproperties)
    if tp:
        lines.append(tp)

    return "\n".join(lines) + ";\n"


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate Hive CREATE TABLE DDL from JSON schema")
    p.add_argument("--input", "-i", help="Path to JSON schema file")
    p.add_argument("--database", "-d", help="Override database name")
    p.add_argument("--table", "-t", help="Override table name")
    p.add_argument("--external", action="store_true", help="Create EXTERNAL table")
    p.add_argument("--managed", action="store_true", help="Force managed table (overrides schema)")
    p.add_argument("--output", "-o", help="Write DDL to file path")
    p.add_argument("--print-example", action="store_true", help="Print example JSON schema and exit")
    return p.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)

    if args.print_example:
        print(json.dumps(EXAMPLE_SCHEMA, indent=2, ensure_ascii=False))
        return 0

    if not args.input:
        print("Error: --input schema.json is required (or --print-example)", file=sys.stderr)
        return 2

    try:
        schema = load_json_file(args.input)
        if args.managed and args.external:
            print("Warning: both --managed and --external provided; using managed", file=sys.stderr)
        external_flag: Optional[bool] = None
        if args.managed:
            external_flag = False
        elif args.external:
            external_flag = True

        ddl = build_create_table(schema, args.database, args.table, external_flag)
        if args.output:
            Path(args.output).write_text(ddl, encoding="utf-8")
        else:
            print(ddl)
        return 0
    except Exception as exc:
        print(f"Failed to generate DDL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())

