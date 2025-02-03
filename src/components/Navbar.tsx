'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

/**
 * 导航栏组件
 */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧 Logo 和主导航 */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                脱口秀平台
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                首页
              </Link>
              <Link
                href="/events"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/events'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                演出活动
              </Link>
              <Link
                href="/comedians"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/comedians'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                演员列表
              </Link>
            </div>
          </div>

          {/* 右侧用户菜单 */}
          <div className="flex items-center">
            {session?.user ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs text-sm focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    <span className="mr-2 text-gray-700">
                      {session.user.name}
                      <span className="ml-1 text-gray-500">
                        ({session.user.role === 'comedian' ? '演员' : '主办方'})
                      </span>
                    </span>
                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        个人中心
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/'
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            首页
          </Link>
          <Link
            href="/events"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/events'
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            演出活动
          </Link>
          <Link
            href="/comedians"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/comedians'
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            演员列表
          </Link>
        </div>
      </div>
    </nav>
  );
} 