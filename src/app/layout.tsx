import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Goal日历 - AI智能目标管理",
  description: "使用AI技术将您的长期目标智能分解为可执行的日常计划，通过可视化日历管理您的学习进度。",
  keywords: "目标管理, AI规划, 学习计划, 时间管理, 智能日历",
  authors: [{ name: "Goal日历团队" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
