'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Divider from 'antd/es/divider';
import Skeleton from 'antd/es/skeleton';

interface Show {
  _id: string;
  title: string;
  location: string;
  type: string;
  isPriceNegotiable: boolean;
  price?: number;
  description: string;
  deadline: string;
  contact: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

/**
 * 演出详情页面组件
 */
export default function ShowDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [show, setShow] = useState<Show | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShowDetail() {
      try {
        const response = await fetch(`/api/shows/${params.id}`);
        if (!response.ok) {
          throw new Error('演出信息获取失败');
        }
        const data = await response.json();
        setShow(data);
      } catch (error) {
        console.error('获取演出详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShowDetail();
  }, [params.id]);

  const getShowType = (type: string) => {
    switch(type) {
      case 'commercial': return '商业演出（拼盘、开放麦等）';
      case 'business': return '商务演出（年会、开业）';
      case 'variety': return '综艺节目';
      case 'film': return '影视表演';
      case 'scriptwriting': return '编剧';
      default: return '其他';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">演出信息不存在</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 安全提醒 */}
          <div className="bg-orange-50 border-b border-orange-100 px-8 py-4">
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

          {/* 标题区域 */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{show.title}</h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span>发布于 {new Date(show.createdAt).toLocaleDateString('zh-CN')}</span>
              <span className="mx-2">·</span>
              <span>由 {show.userId.name} 发布</span>
            </div>
          </div>

          {/* 主要信息 */}
          <div className="px-8 py-6 space-y-6">
            {/* 基本信息卡片 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">演出类型</div>
                <div className="text-gray-900">{getShowType(show.type)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">演出地点</div>
                <div className="text-gray-900">{show.location}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">报酬</div>
                <div className="text-gray-900">{show.isPriceNegotiable ? '面议' : `¥${show.price}`}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">截止日期</div>
                <div className="text-gray-900">
                  {new Date(show.deadline).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* 演出详情 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">演出详情</h2>
              <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-700">
                {show.description}
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">联系方式</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
                {show.contact}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 