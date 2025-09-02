type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2ea3ff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#g)" />
      <path d="M20 36c4-10 20-10 24 0" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="white" />
      <circle cx="40" cy="24" r="3" fill="white" />
    </svg>
  )
}

