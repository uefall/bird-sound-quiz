import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bird Sound Quiz",
  description: "Bird species and sound challenge MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
