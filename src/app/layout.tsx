import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KinhWeb",
  description: "百度网盘文件管理工具",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
