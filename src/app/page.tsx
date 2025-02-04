'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import ComedianCard from '@/components/ComedianCard';
import PublishShowButton from '@/components/PublishShowButton';
import { useRouter } from 'next/navigation';

interface ExtendedSession {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  } | null;
}

interface Comedian {
  _id: string;
  avatar: string;
  stageName: string;
  experience: number;
  location: {
    province: string;
    city: string;
  };
  hasCommercialExp: boolean;
  hasScriptwritingExp: boolean;
  hasPersonalShow: boolean;
  hasVarietyExp: boolean;
}

interface Show {
  _id: string;
  title: string;
  location: string;
  type: string;
  isPriceNegotiable: boolean;
  price?: number;
  deadline: string;
  createdAt: string;
  userId: {
    name: string;
  };
}

/**
 * 首页组件
 * @returns {JSX.Element} 首页视图
 */
export default function Home() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [activeTab, setActiveTab] = useState('shows');
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 获取演员列表
  useEffect(() => {
    async function fetchComedians() {
      try {
        const response = await fetch('/api/comedians');
        const { data } = await response.json();
        setComedians(data);
      } catch (error) {
        console.error('获取演员列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (activeTab === 'comedians') {
      fetchComedians();
    }
  }, [activeTab]);

  // 获取演出列表
  useEffect(() => {
    async function fetchShows() {
      try {
        const response = await fetch('/api/shows');
        const { data } = await response.json();
        setShows(data);
      } catch (error) {
        console.error('获取演出列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (activeTab === 'shows') {
      fetchShows();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">笑了么</span>
                <span className="text-sm text-gray-600 ml-2">· 脱口秀演出及演员匹配平台</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                      <span>{session.user.name}</span>
                      <span className="text-xs text-gray-500">
                        ({session.user.role === 'comedian' ? '演员' : '主办方'})
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        演员资料卡
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 标签页切换 */}
      <div className="pt-14">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 ${
                  activeTab === 'shows'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab('shows')}
              >
                找演出
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'comedians'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab('comedians')}
              >
                找演员
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'shows' ? (
          <div className="space-y-4">
            {/* 安全提醒 */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    演出信息可能有错误甚至诈骗，请一定要注意识别，责任自负。
                  </p>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">加载中...</div>
            ) : shows.length > 0 ? (
              shows.map((show) => (
                <div
                  key={show._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                  onClick={() => router.push(`/shows/${show._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{show.title}</h3>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {show.location}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                          </svg>
                          {(() => {
                            switch(show.type) {
                              case 'commercial': return '商业演出（拼盘、开放麦等）';
                              case 'business': return '商务演出（年会、开业）';
                              case 'variety': return '综艺节目';
                              case 'film': return '影视表演';
                              case 'scriptwriting': return '编剧';
                              default: return '其他';
                            }
                          })()}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 9h8a1 1 0 100-2H6a1 1 0 100 2zm0-4h8a1 1 0 100-2H6a1 1 0 100 2z" clipRule="evenodd" />
                          </svg>
                          报酬：{show.isPriceNegotiable ? '面议' : `¥${show.price}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">发布者：{show.userId.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        截止日期：{new Date(show.deadline).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">暂无演出数据</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">加载中...</div>
            ) : comedians.length > 0 ? (
              comedians.map((comedian) => (
                <ComedianCard key={comedian._id} comedian={comedian} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">暂无演员数据</div>
            )}
          </div>
        )}
      </div>

      {/* 悬浮发布按钮 */}
      {activeTab === 'shows' && <PublishShowButton />}
    </div>
  );
}
