'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  useEffect(() => {
    // 在客户端检查用户身份并重定向
    if (!session?.user || session.user.role !== 'comedian') {
      router.push('/profile');
    }
  }, [session, router]);

  // 在加载状态或未授权状态下显示空内容
  if (!session?.user || session.user.role !== 'comedian') {
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
            <p className="text-gray-500">演员资料编辑功能即将上线...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 组件用于显示喜剧演员卡片
 * @param {Object} props - 组件属性
 * @param {string} props.avatar - 演员头像
 * @param {string[]} props.photos - 演员相册
 */
const ComedianCard = ({ avatar, photos }: { avatar: string; photos: string[] }) => {
    const baseUrl = "https://xiaoleme.com"; // 基础 URL

    return (
        <div>
            <img src={`${baseUrl}${avatar}`} alt="演员头像" />
            <div>
                {photos.map(photo => (
                    <img key={photo} src={`${baseUrl}${photo}`} alt="演员照片" />
                ))}
            </div>
        </div>
    );
}; 