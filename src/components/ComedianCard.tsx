'use client';

import Image from 'next/image';
import Tag from 'antd/es/tag';
import { useRouter } from 'next/navigation';

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

  // 生成标签列表
  const tags = [
    { condition: comedian.hasCommercialExp, label: '商演', color: 'blue' },
    { condition: comedian.hasScriptwritingExp, label: '编剧', color: 'purple' },
    { condition: comedian.hasPersonalShow, label: '专场', color: 'green' },
    { condition: comedian.hasVarietyExp, label: '综艺', color: 'orange' },
  ].filter(tag => tag.condition).slice(0, 4);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/comedians/${comedian._id}`)}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {comedian.avatar ? (
              <div className="relative w-16 h-16">
                <Image
                  src={comedian.avatar}
                  alt={comedian.stageName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {comedian.stageName}
            </h3>
            <p className="text-sm text-gray-600">
              {comedian.location.province} · {comedian.location.city}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {comedian.experience}年经验
            </p>
          </div>
        </div>
        <div className="mt-3 space-x-2">
          {tags.map((tag, index) => (
            <Tag key={index} color={tag.color}>
              {tag.label}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
} 