'use client';

import { useRouter } from 'next/navigation';

/**
 * 发布演出入口按钮组件
 */
export default function PublishShowButton() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => router.push('/shows/publish')}
        className="h-12 px-6 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="font-medium">发布演出</span>
      </button>
    </div>
  );
} 