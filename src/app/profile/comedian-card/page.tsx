'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  } | null;
}

interface ComedianDetail {
  _id: string;
  stageName: string;
  avatar?: string;
  bio?: string;
  // ... 其他字段
}

/**
 * 演员资料卡页面
 */
export default function ComedianCardPage() {
  const router = useRouter();
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [comedianData, setComedianData] = useState<ComedianDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user || session.user.role !== 'comedian') {
      router.push('/profile');
      return;
    }

    const fetchComedianData = async () => {
      if (!session.user?.id) return;
      
      try {
        const profileResponse = await fetch('/api/comedians/profile');
        const profileData = await profileResponse.json();
        
        if (profileResponse.ok && profileData.data) {
          const response = await fetch(`/api/comedians/${profileData.data._id}`);
          if (response.ok) {
            const { data } = await response.json();
            setComedianData(data);
          }
        }
      } catch (error) {
        console.error('获取演员资料失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComedianData();
  }, [session, router]);

  if (!session?.user || session.user.role !== 'comedian') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!comedianData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              开始您的脱口秀之旅
            </h2>
            <p className="text-gray-500 mb-8">
              创建您的演员资料卡，让更多人了解您
            </p>
            <button
              onClick={() => router.push('/profile/comedian-card/create')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              创建我的演员资料卡
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">我的演员资料卡</h2>
            <button
              onClick={() => router.push('/profile/comedian-card/edit')}
              className="text-blue-500 hover:text-blue-600"
            >
              编辑资料
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">艺名</h3>
                <p className="text-gray-600">{comedianData.stageName}</p>
              </div>
              {comedianData.bio && (
                <div>
                  <h3 className="font-medium text-gray-900">个人简介</h3>
                  <p className="text-gray-600">{comedianData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 