const endpoints = [
  "POST /api/session/start",
  "GET /api/quiz/next?sessionId=...",
  "POST /api/quiz/answer",
  "POST /api/session/end",
  "GET /api/review/mistakes?sessionId=...",
];

export default function HomePage() {
  return (
    <main>
      <h1>Bird Sound Quiz MVP</h1>
      <p>核心 API 已就绪，当前版本使用内存会话与 mock 数据。</p>
      <h2>Endpoints</h2>
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint}>
            <code>{endpoint}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}
