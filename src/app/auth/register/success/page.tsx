'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ExtendedSession {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  } | null;
}

/**
 * 注册成功页面
 */
export default function RegisterSuccessPage() {
  const router = useRouter();
  const { data: session } = useSession() as { data: ExtendedSession | null };

  useEffect(() => {
    // 3秒后自动跳转到首页
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            注册成功，{session?.user?.name}！
          </h2>
          <p className="text-gray-600 mb-4">
            {session?.user?.role === 'comedian' ? '欢迎加入我们的脱口秀演员社区！' : '欢迎加入我们的活动主办方社区！'}
          </p>
          <p className="text-sm text-gray-500">
            页面将在3秒后自动跳转到首页...
          </p>
        </div>
      </div>
    </div>
  );
} 