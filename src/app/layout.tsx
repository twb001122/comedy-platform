import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import StyledComponentsRegistry from '@/components/AntdRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '脱口秀平台',
  description: '连接脱口秀演员与活动主办方的平台',
};

/**
 * 全局布局组件
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
