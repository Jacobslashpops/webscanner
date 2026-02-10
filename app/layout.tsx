import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ElementIdProvider } from "@/lib/element-id";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebScanner - 网站安全扫描平台",
  description: "全方位的网站安全扫描解决方案，帮助您及时发现并修复安全问题",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-element-id="html-root">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-element-id="body-root"
      >
        <ElementIdProvider>
          <div data-element-id="app-wrapper">{children}</div>
        </ElementIdProvider>
      </body>
    </html>
  );
}
