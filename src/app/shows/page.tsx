'use client';

import PublishShowButton from '@/components/PublishShowButton';

/**
 * 演出列表页面
 */
export default function ShowsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab 导航 */}
      <div className="sticky top-16 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/shows"
              className="border-b-2 border-blue-500 px-1 py-4 text-sm font-medium text-blue-600"
            >
              找演出
            </a>
            <a
              href="/comedians"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              找演员
            </a>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 演出列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: 添加演出卡片列表 */}
        </div>
      </div>

      {/* 悬浮发布按钮 */}
      <PublishShowButton />
    </div>
  );
} 