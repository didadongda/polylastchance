import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PolyLastChance - 把握最后机会',
  description: '实时追踪 Polymarket 即将到期的市场，智能提醒+实时价格+新闻追踪，专为尾盘交易打造',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
