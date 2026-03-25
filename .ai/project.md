# 项目概览

这是一个基于 **React + Vite** 的前端工程（原本更像“商城模板”），当前正在叠加一套 **AI 视频分镜编辑/预览** 的实验性功能页（`/editor`）。本文件用于“下次直接读取即可接上手”，重点记录：**怎么跑、核心页面、关键数据结构、前后端接口约定、已知风险与下一步**。

## 快速运行

- **启动开发**：`npm run start`（Vite dev server，默认 `http://localhost:3000`）
- **构建**：`npm run build`
- **预览**：`npm run preview`
- **Lint**：`npm run lint` / `npm run lint:fix`

## 技术栈与关键依赖（当前仓库实际情况）

- **框架**：React 18 + TypeScript + Vite 6（`type: module`）
- **路由**：`react-router-dom@7`（懒加载 pages）
- **UI**：`antd-mobile`（工程里有 antd-mobile 相关依赖；Vite 手动分包里写了 `antd`，但依赖里未看到 `antd`）
- **请求**：Axios（见 `src/lib/request/index.ts`）
- **国际化/工具**：i18next、ahooks、lodash-es、dayjs 等
- **构建与约束**：`@vitejs/plugin-legacy`、`vite-plugin-eslint`（开发时会自动 fix）

## 入口与路由

- **入口**：`src/main.tsx`
  - 初始化：`initJJ()` → `initDebugger()` → `setupFavicon()`
  - 额外全局：`window.forceWebGL = true`；`window._AMapSecurityConfig`（高德）
  - 挂载：`<RouterProvider router={router} />`
- **路由配置**：`src/routes/config.tsx`
  - `/`：`App`（layout）
  - `/home`：`Home`
  - `/chat-api`：`ChatApi`（演示/实验页）
  - `/editor`：`Editor`（AI 视频编辑器）
  - `*`：`NotFound`（文件名为 `NotFount`，注意拼写）

## AI 视频编辑器（当前已实现到的程度）

### 页面：`src/pages/Editor/index.tsx`

- **职责**：用一个固定 `videoId`（当前写死为 `1773750942214`）轮询接口拿分镜数据，然后交给 `VideoPlayer` 展示。
- **轮询策略**：如果 `res.code === 200` 就 `setScenes(res.data)`；否则 `setTimeout(fetchData, 2000)` 继续轮询；同时 `setStatus(res.status)`。

### 组件：`src/components/VideoPlayer/index.tsx`

- **输入**：`scenes`（来自 Editor 的接口返回）
- **内部状态**：会把 `initialScenes` 同步到内部 `scenes` state（用于重排）
- **视频源**：当前假设“所有分镜来自同一原视频”，取 `scenes[0]?.file` 作为 `videoSrc`
- **时间轴映射**：
  - `timelineTime -> realVideoTime`：把“拼接后的时间轴”映射回原视频时间
  - `realVideoTime -> timelineTime`：把原视频播放进度映射到“拼接时间轴”
- **重排**：`handleReorder(from, to)` 会重排内部 `scenes`，并把当前 `timelineTime` 重新映射到新顺序下的 `realVideoTime`，然后 `video.currentTime = real; video.play()`

### 组件：`src/components/Timeline/index.tsx`

- **形态**：当前是“可点击/拖动 seek + 原生 HTML5 draggable 重排”的简易时间轴。
- **交互**：
  - 点击时间轴：根据百分比 seek
  - 鼠标拖动（按下后移动）：持续 seek（`isDragging` 来自 VideoPlayer）
  - 分镜块拖拽：`onDragStart` 记录 `dragIndex`，`onDrop` 调用 `onReorder(dragIndex, index)`

> 备注：仓库里也存在拆分文件 `TimelineTrack` / `TimelineItem` / `Playhead`，但目前 `Timeline/index.tsx` 没有实际使用它们（属于未接入或旧实现残留）。

## 接口与请求封装

- **请求封装**：`src/lib/request/index.ts`
  - Axios instance 默认 `baseURL: ''`，但每次请求都会在 `finalConfig` 里写死 `baseURL: 'http://127.0.0.1:3000'`
  - 响应拦截：默认直接 `return response.data`；如果配置了 `handleResultCode` 且 `code !== 200` 则返回原样数据（用于调用方自己处理 code）
  - 有一条 `console.log(444, response)`（调试残留）
- **API**：`src/services/api/index.ts`
  - `getScenes(id: string)` → `GET /video/{id}/scenes`（通过 `request`）

## 数据结构与约定（建议以接口返回为准）

当前代码里出现了两套字段命名，请以“接口返回”为主并统一：

- **VideoPlayer 期望**（`src/components/VideoPlayer/index.tsx`）：

```ts
type Scene = {
  id: string;
  start: number; // 秒
  end: number; // 秒
  file: string; // 原视频地址（或可播放 url）
  thumbnail?: string;
};
```

- **旧/文档字段**：之前写过 `url` 字段，但当前实现实际使用的是 `file`。

## 已知风险 / 重要提醒（下次接手优先看这里）

- **安全风险（必须处理）**：`src/pages/ChatApi/index.tsx` 里硬编码了第三方 `API_KEY`（并且走 `fetch` 直连）。这不应提交到仓库，也不应放在前端代码里。
- **UI 依赖不一致**：Vite 手动分包写了 `antd: ['antd']`，但依赖里是 `antd-mobile`。如出现构建分包/预构建问题，需要同步修正。
- **Timeline 组件重复**：`Timeline/index.tsx` 与 `TimelineTrack/Item/Playhead` 并存，当前未统一，后续容易产生“改了一个不生效”的困惑。
- **请求 baseURL 写死**：`request` 强制指向 `http://127.0.0.1:3000`，与 Vite dev server 端口同为 3000 容易混淆（也不利于切环境）。

## 当前任务记录（来自 `.ai/task.md`）

- 目标：实现/完善 **SceneEditor 的拖拽排序**（目前在 `Timeline` 里用原生 draggable 简易实现）
- 要求：拖拽流畅、顺序正确更新、预览顺序同步、性能无明显问题

## 下一步建议（可选）

- 把“分镜列表编辑”从 `VideoPlayer` 内部 state 抬到 `Editor`（或引入单一数据源），让“拖拽排序”能同时影响列表与播放逻辑。
- 统一 `Scene` 字段（`file/url`、`thumbnail`、时间单位），并把类型抽到 `src/types` 或 `services` 侧以减少 any。

## 更新日志（开发记录）

### 2026-03-18

- **Timeline 拖拽排序**：`src/components/Timeline/index.tsx`
  - 使用 `@dnd-kit/*` 实现分镜块水平拖拽排序（替换原生 draggable）
  - 拖拽排序期间禁用时间轴 seek，避免拖拽与时间轴事件冲突导致“跳动”
  - 进度条拖动区域调整为 `.progressBar_top`，并改用 `pointer` 事件 + `setPointerCapture` 提升稳定性
  - 进度计算基于整个时间轴容器（避免手柄宽度过小导致时间计算失真、红线“消失”）
  - 拖动进度条过程中 **pause + seek**（不自动播放）；点击时间轴仍会播放
- **进度条样式/事件层级**：`src/components/Timeline/index.module.less`
  - `.progressBar` 默认不拦截事件，仅 `.progressBar_top` 接收拖动
  - 手柄宽度改为固定值，提升可操作性
- **缩略图（前端自动截帧）**：
  - 新增 `src/hooks/useVideoPlayer.ts`：用隐藏 video + canvas 在 `scene.start` 自动截帧生成 `thumbnail`
  - `src/components/VideoPlayer/index.tsx` 接入并将生成的 `thumbnail` 合并回本地 `scenes`（不覆盖接口已给的缩略图）
- **新增依赖**：`package.json`
  - `@dnd-kit/core` / `@dnd-kit/sortable` / `@dnd-kit/utilities`
