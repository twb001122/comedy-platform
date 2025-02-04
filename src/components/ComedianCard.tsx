'use client';

import Image from 'next/image';
import { Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/utils/image';

interface ComedianCardProps {
  comedian: {
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
  };
}

/**
 * 演员卡片组件
 */
export default function ComedianCard({ comedian }: ComedianCardProps) {
  const router = useRouter();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/comedians/${comedian._id}`)}
    >
      {/* 头像区域 */}
      <div className="relative w-full pt-[100%]">
        <Image
          src={getImageUrl(comedian.avatar)}
          alt={comedian.stageName}
          fill
          className="object-cover"
        />
      </div>

      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{comedian.stageName}</h3>
        
        <div className="text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span>{comedian.location.province} {comedian.location.city}</span>
          </div>
          <div>表演经验：{comedian.experience}年</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {comedian.hasCommercialExp && (
            <Tag color="blue">商演</Tag>
          )}
          {comedian.hasScriptwritingExp && (
            <Tag color="purple">编剧</Tag>
          )}
          {comedian.hasPersonalShow && (
            <Tag color="green">专场</Tag>
          )}
          {comedian.hasVarietyExp && (
            <Tag color="orange">综艺</Tag>
          )}
        </div>
      </div>
    </div>
  );
} 