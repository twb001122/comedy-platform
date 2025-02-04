'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/utils/image';
import { Session } from 'next-auth';

type Props = {
  user: Session['user'];
};

interface User {
  id: string;
  userId: string;
  name?: string | null;
  email?: string | null;
  role?: 'comedian' | 'organizer';
}

/**
 * 个人资料表单组件
 */
export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    stageName: '',
    experience: '',
    clubName: '',
    hasClub: false,
    bio: '',
    contact: '',
    location: {
      province: '',
      city: ''
    },
    hasCommercialExp: false,
    hasScriptwritingExp: false,
    hasPersonalShow: false,
    personalShows: [] as string[],
    hasVarietyExp: false,
    varietyShows: [] as string[],
    isPriceNegotiable: false,
    commercialFee: '',
    jointShowFee: '',
    personalShowFee: '',
    scriptwritingFee: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  // 加载现有数据
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('加载失败');
        }
        const data = await response.json();
        
        if (data) {
          setFormData({
            stageName: data.stageName || '',
            experience: data.experience || '',
            clubName: data.clubName || '',
            hasClub: data.hasClub || false,
            bio: data.bio || '',
            contact: data.contact || '',
            location: {
              province: data.location?.province || '',
              city: data.location?.city || ''
            },
            hasCommercialExp: data.hasCommercialExp || false,
            hasScriptwritingExp: data.hasScriptwritingExp || false,
            hasPersonalShow: data.hasPersonalShow || false,
            personalShows: data.personalShows || [],
            hasVarietyExp: data.hasVarietyExp || false,
            varietyShows: data.varietyShows || [],
            isPriceNegotiable: data.isPriceNegotiable || false,
            commercialFee: data.commercialFee || '',
            jointShowFee: data.jointShowFee || '',
            personalShowFee: data.personalShowFee || '',
            scriptwritingFee: data.scriptwritingFee || ''
          });
          setAvatar(data.avatar || '');
          setPhotos(data.photos || []);
        }
      } catch (error) {
        console.error('加载个人资料失败:', error);
        alert('加载个人资料失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('头像上传失败');
      }

      const { url: path } = await response.json();
      setAvatar(path);
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
    }
  };

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // 计算还可以上传的照片数量
    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      alert('相册最多只能包含5张照片');
      return;
    }
    
    const files = Array.from(e.target.files).slice(0, remainingSlots);
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'photo');
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('照片上传失败');
        }

        const { url: path } = await response.json();
        setPhotos(prev => [...prev, path]);
      } catch (error) {
        console.error('照片上传失败:', error);
        alert('照片上传失败，请重试');
        break;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 数据验证
      if (!formData.stageName.trim()) {
        throw new Error('请输入艺名');
      }

      // 处理数据，确保数字字段为数字类型
      const processedData = {
        ...formData,
        // 确保经验值为数字
        experience: formData.experience ? Number(formData.experience) : 0,
        // 处理价格字段
        commercialFee: formData.commercialFee ? Number(formData.commercialFee) : undefined,
        jointShowFee: formData.jointShowFee ? Number(formData.jointShowFee) : undefined,
        personalShowFee: formData.personalShowFee ? Number(formData.personalShowFee) : undefined,
        scriptwritingFee: formData.scriptwritingFee ? Number(formData.scriptwritingFee) : undefined,
        // 确保照片数组存在且有效
        photos: photos.length > 0 ? photos : undefined,
        // 确保专场和综艺节目数组存在且有效
        personalShows: formData.hasPersonalShow ? formData.personalShows.filter(Boolean) : [],
        varietyShows: formData.hasVarietyExp ? formData.varietyShows.filter(Boolean) : [],
        // 添加头像字段
        avatar: avatar || undefined,
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(processedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '保存失败');
      }

      alert('保存成功');
      router.refresh();
    } catch (error) {
      console.error('保存失败:', error);
      alert(error instanceof Error ? error.message : '保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async () => {
    try {
      setIsChangingRole(true);
      const newRole = user.role === 'comedian' ? 'organizer' : 'comedian';
      
      const response = await fetch('/api/user/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('角色切换失败');
      }

      router.refresh();
    } catch (error) {
      console.error('角色切换失败:', error);
      alert('角色切换失败，请重试');
    } finally {
      setIsChangingRole(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-6 flex items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">基本信息</h2>
          
          {/* 头像上传 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              头像
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                {avatar ? (
                  <Image
                    src={getImageUrl(avatar)}
                    alt="头像"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                更换头像
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 相册上传 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相册 (最多5张)
            </label>
            <div className="grid grid-cols-5 gap-4 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-full pt-[100%]">
                  <Image
                    src={getImageUrl(photo)}
                    alt={`照片 ${index + 1}`}
                    fill
                    className="absolute top-0 left-0 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => photosInputRef.current?.click()}
                  className="w-full pt-[100%] relative bg-gray-100 rounded hover:bg-gray-200"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-2xl text-gray-400">
                    +
                  </span>
                </button>
              )}
            </div>
            <input
              ref={photosInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
              className="hidden"
            />
          </div>

          {/* 基本信息表单 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                艺名
              </label>
              <input
                type="text"
                name="stageName"
                value={formData.stageName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                表演经验（年）
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在省份
              </label>
              <input
                type="text"
                name="province"
                value={formData.location.province}
                onChange={handleLocationChange}
                placeholder="例如：北京市"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在城市
              </label>
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                placeholder="例如：北京市"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="hasClub"
                checked={formData.hasClub}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">是否有固定俱乐部</span>
            </label>
            {formData.hasClub && (
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleInputChange}
                placeholder="俱乐部名称"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              个人简介
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系方式
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="建议输入小红书等非私人联系方式"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 工作经验 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">工作经验</h2>
          <div className="space-y-6">
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="hasCommercialExp"
                  checked={formData.hasCommercialExp}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">是否有商业演出经验</span>
              </label>
            </div>
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="hasScriptwritingExp"
                  checked={formData.hasScriptwritingExp}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">是否有编剧经验</span>
              </label>
            </div>
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="hasPersonalShow"
                  checked={formData.hasPersonalShow}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">是否有个人专场</span>
              </label>
              {formData.hasPersonalShow && (
                <div>
                  <input
                    type="text"
                    name="personalShows"
                    value={formData.personalShows.join(',')}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        personalShows: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }));
                    }}
                    placeholder='输入专场名称，用英文逗号","分割'
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="hasVarietyExp"
                  checked={formData.hasVarietyExp}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">是否有综艺节目经验</span>
              </label>
              {formData.hasVarietyExp && (
                <div>
                  <input
                    type="text"
                    name="varietyShows"
                    value={formData.varietyShows.join(',')}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        varietyShows: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }));
                    }}
                    placeholder='输入综艺名称，用英文逗号","分割'
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 演出价格 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">演出报价</h2>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPriceNegotiable"
                checked={formData.isPriceNegotiable}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">价格面议</span>
            </label>
          </div>
          <div className={`space-y-4 ${formData.isPriceNegotiable ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商务演出费（元/场）
              </label>
              <input
                type="number"
                name="commercialFee"
                value={formData.commercialFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.isPriceNegotiable}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                拼盘演出费（元/场）
              </label>
              <input
                type="number"
                name="jointShowFee"
                value={formData.jointShowFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.isPriceNegotiable}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                专场演出费（元/场）
              </label>
              <input
                type="number"
                name="personalShowFee"
                value={formData.personalShowFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.isPriceNegotiable}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                编剧服务费（元/场）
              </label>
              <input
                type="number"
                name="scriptwritingFee"
                value={formData.scriptwritingFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.isPriceNegotiable}
              />
            </div>
          </div>
        </div>

        {/* 身份切换 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">身份切换</h2>
          <button
            type="button"
            onClick={handleRoleChange}
            disabled={isChangingRole}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            {isChangingRole ? '切换中...' : `切换为${user.role === 'comedian' ? '主办方' : '演员'}`}
          </button>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
} 