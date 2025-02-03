'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ExtendedSession {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  } | null;
}

/**
 * 演员资料卡编辑页面
 */
export default function ComedianCardPage() {
  const router = useRouter();
  const { data: session } = useSession() as { data: ExtendedSession | null };

  // 如果未登录或不是演员身份，重定向到个人中心
  if (!session?.user || session.user.role !== 'comedian') {
    router.push('/profile');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">编辑演员资料卡</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500">演员资料卡编辑功能即将上线...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 