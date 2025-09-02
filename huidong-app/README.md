# 慧动 App（原型）

因材施教，慧动未来。该原型实现了产品文案中的核心流程：

- 登陆/营销页（文案展示）
- 性格评估（交互问卷，推断四型）
- 个性化计划（学习+运动+目标管理）
- 进度跟踪与家长反馈（动态优化计划）

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS
- React Router

## 开发与运行

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`。

## 目录结构

```
src/
  main.tsx                 # 路由与应用入口
  index.css                # Tailwind 样式
  modules/
    layout/RootLayout.tsx  # 顶部导航与布局
    landing/LandingPage.tsx# 营销/功能介绍
    assessment/            # 评估模型与页面
    plan/                  # 计划生成、调整与页面
```

## 数据与持久化

- 评估结果保存在 `sessionStorage` 键 `huidong.personality`
- 进度/反馈保存在 `sessionStorage` 键 `huidong.progress`

## 下一步

- 接入后端与更科学的量表与算法
- 日历与提醒、PWA 支持
- 更完善的家长端数据面板