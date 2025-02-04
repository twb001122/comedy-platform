'use client';

import { useSession } from 'next-auth/react';
import ProfileForm from '@/components/ProfileForm';
import { useState, useEffect } from 'react';
import { Session } from 'next-auth';

type SessionUser = Session['user'];

/**
 * 个人资料页面组件
 */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null); // null 表示正在加载
  const [showForm, setShowForm] = useState(false);

  // 检查用户是否已有资料卡
  useEffect(() => {
    async function checkProfile() {
      try {
        console.log('Session status:', status);
        console.log('Session data:', session);
        console.log('Session user:', session?.user);
        console.log('Session user ID:', session?.user?.userId);
        
        if (!session?.user?.userId) {
          console.log('No user ID in session');
          return;
        }

        const response = await fetch('/api/comedians/profile', {
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile data:', data);
          setHasProfile(
            !!data?.data && 
            typeof data.data === 'object' && 
            Object.keys(data.data).length > 0
          );
        } else if (response.status === 404) {
          setHasProfile(false);
        } else {
          console.log('Profile request failed:', response.status);
          setHasProfile(false);
        }
      } catch (error) {
        console.error('Profile check error:', error);
        setHasProfile(false);
      }
    }

    if (session?.user) {
      checkProfile();
    }
  }, [session, status]);

  // 如果用户未登录，显示登录提示
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-gray-500">请先登录</div>
        </div>
      </div>
    );
  }

  // 加载中状态
  if (hasProfile === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">演员资料卡</h1>
      
      {hasProfile === true || showForm ? (
        <ProfileForm user={session?.user as SessionUser} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow p-8">
          <p className="text-lg text-gray-600 mb-6">
            您还没有创建演员资料卡
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            创建我的演员资料卡
          </button>
        </div>
      )}
    </div>
  );
} 