'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tag, Divider } from 'antd';

interface ComedianDetail {
  _id: string;
  avatar: string;
  photos: string[];
  stageName: string;
  experience: number;
  location: {
    province: string;
    city: string;
  };
  bio: string;
  contact: string;
  hasClub: boolean;
  clubName?: string;
  hasCommercialExp: boolean;
  hasScriptwritingExp: boolean;
  hasPersonalShow: boolean;
  personalShows?: string[];
  hasVarietyExp: boolean;
  varietyShows?: string[];
  isPriceNegotiable: boolean;
  commercialFee?: number;
  jointShowFee?: number;
  personalShowFee?: number;
  scriptwritingFee?: number;
}

/**
 * 演员详情页面
 */
export default function ComedianDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [comedian, setComedian] = useState<ComedianDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComedianDetail() {
      try {
        const response = await fetch(`/api/comedians/${params.id}`);
        if (!response.ok) {
          throw new Error('获取演员详情失败');
        }
        const { data } = await response.json();
        setComedian(data);
      } catch (error) {
        console.error('获取演员详情失败:', error);
        alert('获取演员详情失败，请重试');
      } finally {
        setIsLoading(false);
      }
    }

    fetchComedianDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">加载中...</div>
        </div>
      </div>
    );
  }

  if (!comedian) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">未找到该演员</div>
        </div>
      </div>
    );
  }

  // 生成标签列表
  const tags = [
    { condition: comedian.hasCommercialExp, label: '商演', color: 'blue' },
    { condition: comedian.hasScriptwritingExp, label: '编剧', color: 'purple' },
    { condition: comedian.hasPersonalShow, label: '专场', color: 'green' },
    { condition: comedian.hasVarietyExp, label: '综艺', color: 'orange' },
  ].filter(tag => tag.condition);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          返回
        </button>

        {/* 基本信息卡片 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* 头部信息 */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {comedian.avatar ? (
                  <div className="relative w-24 h-24">
                    <Image
                      src={comedian.avatar}
                      alt={comedian.stageName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {comedian.stageName}
                </h1>
                <p className="text-gray-600 mt-1">
                  {comedian.location.province} · {comedian.location.city}
                </p>
                <div className="mt-2 space-x-2">
                  {tags.map((tag, index) => (
                    <Tag key={index} color={tag.color}>
                      {tag.label}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="p-6 space-y-6">
            {/* 个人简介 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">个人简介</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{comedian.bio}</p>
            </div>

            <Divider />

            {/* 基本信息 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">表演经验</p>
                  <p className="text-gray-900">{comedian.experience}年</p>
                </div>
                {comedian.hasClub && comedian.clubName && (
                  <div>
                    <p className="text-gray-500">所属俱乐部</p>
                    <p className="text-gray-900">{comedian.clubName}</p>
                  </div>
                )}
                {comedian.contact && (
                  <div>
                    <p className="text-gray-500">联系方式</p>
                    <p className="text-gray-900">{comedian.contact}</p>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* 演出经历 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">演出经历</h2>
              <div className="space-y-4">
                {comedian.hasPersonalShow && comedian.personalShows && comedian.personalShows.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-2">个人专场</p>
                    <div className="flex flex-wrap gap-2">
                      {comedian.personalShows.map((show, index) => (
                        <Tag key={index}>{show}</Tag>
                      ))}
                    </div>
                  </div>
                )}
                {comedian.hasVarietyExp && comedian.varietyShows && comedian.varietyShows.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-2">综艺节目</p>
                    <div className="flex flex-wrap gap-2">
                      {comedian.varietyShows.map((show, index) => (
                        <Tag key={index}>{show}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* 演出报价 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">演出报价</h2>
              {comedian.isPriceNegotiable ? (
                <p className="text-gray-600">价格面议</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {comedian.commercialFee !== undefined && (
                    <div>
                      <p className="text-gray-500">商务演出</p>
                      <p className="text-gray-900">¥{comedian.commercialFee}/场</p>
                    </div>
                  )}
                  {comedian.jointShowFee !== undefined && (
                    <div>
                      <p className="text-gray-500">拼盘演出</p>
                      <p className="text-gray-900">¥{comedian.jointShowFee}/场</p>
                    </div>
                  )}
                  {comedian.personalShowFee !== undefined && (
                    <div>
                      <p className="text-gray-500">专场演出</p>
                      <p className="text-gray-900">¥{comedian.personalShowFee}/场</p>
                    </div>
                  )}
                  {comedian.scriptwritingFee !== undefined && (
                    <div>
                      <p className="text-gray-500">编剧服务</p>
                      <p className="text-gray-900">¥{comedian.scriptwritingFee}/场</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 照片墙 */}
            {comedian.photos && comedian.photos.length > 0 && (
              <>
                <Divider />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">照片墙</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {comedian.photos.map((photo, index) => (
                      <div key={index} className="relative pt-[100%]">
                        <Image
                          src={photo}
                          alt={`${comedian.stageName}的照片 ${index + 1}`}
                          fill
                          className="absolute inset-0 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 