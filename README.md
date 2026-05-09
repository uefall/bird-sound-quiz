# bird-sound-quiz

鸟类种类 + 声音识别闯关小游戏的 Web MVP。

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 已实现内容

- Next.js App Router 项目骨架
- 题库 mock 数据（鸟种、音频、图片）
- 会话生命周期 API：
  - `POST /api/session/start`
  - `GET /api/quiz/next?sessionId=...`
  - `POST /api/quiz/answer`
  - `POST /api/session/end`
  - `GET /api/review/mistakes?sessionId=...`
- 出题逻辑（四选一、干扰项、两种模式）
- 计分逻辑（基础分 + 连击 + 速度奖励）

## 请求示例

### 1) 开始会话

```bash
curl -X POST http://localhost:3000/api/session/start \
  -H "Content-Type: application/json" \
  -d '{
    "mode":"audio_to_name",
    "level":1,
    "region":"CN",
    "questionCount":10,
    "lives":3
  }'
```

### 2) 获取下一题

```bash
curl "http://localhost:3000/api/quiz/next?sessionId=sess_xxx"
```

### 3) 提交答案

```bash
curl -X POST http://localhost:3000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"sess_xxx",
    "questionId":"q_sess_xxx_1",
    "selectedOptionId":"A",
    "responseTimeMs":4200
  }'
```

### 4) 结束会话

```bash
curl -X POST http://localhost:3000/api/session/end \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"sess_xxx",
    "reason":"completed"
  }'
```

## 说明

- 当前会话存储在内存中，重启服务后会丢失。
- 当前数据来自 mock 池，后续可替换为 eBird / xeno-canto 实时拉取与缓存。

## Cloud 环境配置

仓库已包含 Cursor Cloud Agent 环境配置：

- `.cursor/Dockerfile`：预装 Node.js 与 npm
- `.cursor/environment.json`：
  - 使用上述 Dockerfile 构建环境
  - 启动流程执行 `npm install`
  - 预置 `npm run dev` 终端

因此后续云端 agent 可直接运行：

```bash
npm run build
npm run dev
```
