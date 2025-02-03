'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  Button,
  Alert,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface ShowFormData {
  title: string;
  type: string;
  location: string;
  isPriceNegotiable: boolean;
  price?: number;
  description: string;
  deadline: Date;
  contact: string;
}

/**
 * 演出发布页面组件
 */
export default function PublishShowPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 表单提交处理
   */
  const handleSubmit = async (values: ShowFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '发布演出失败');
      }

      // 显示成功提示
      alert('发布成功！');
      
      // 提交成功后跳转到首页
      router.push('/');
    } catch (error) {
      console.error('发布演出失败:', error);
      alert(error instanceof Error ? error.message : '发布演出失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">发布演出</h1>
            <button
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
              <span>返回</span>
            </button>
          </div>
          
          <Alert
            message="请确保演出信息正确，责任自负。"
            type="info"
            showIcon
            className="mb-6"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isPriceNegotiable: true
            }}
          >
            {/* 演出名称 */}
            <Form.Item
              name="title"
              label="演出名称"
              rules={[{ required: true, message: '请输入演出名称' }]}
            >
              <Input placeholder="请输入演出名称" />
            </Form.Item>

            {/* 演出性质 */}
            <Form.Item
              name="type"
              label="演出性质"
              rules={[{ required: true, message: '请选择演出性质' }]}
            >
              <Select placeholder="请选择演出性质">
                <Option value="commercial">商业演出（拼盘、开放麦等）</Option>
                <Option value="business">商务演出（年会、开业）</Option>
                <Option value="variety">综艺节目</Option>
                <Option value="film">影视表演</Option>
                <Option value="scriptwriting">编剧</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>

            {/* 演出地点 */}
            <Form.Item
              name="location"
              label="演出地点"
              rules={[{ required: true, message: '请输入演出地点' }]}
            >
              <Input placeholder="请输入演出地点" />
            </Form.Item>

            {/* 劳务报酬 */}
            <Form.Item
              label="劳务报酬"
              required
            >
              <div className="flex items-center gap-4">
                <Form.Item
                  name="isPriceNegotiable"
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="面议"
                    unCheckedChildren="固定"
                    onChange={setIsPriceNegotiable}
                  />
                </Form.Item>
                {!isPriceNegotiable && (
                  <Form.Item
                    name="price"
                    rules={[{ required: true, message: '请输入报酬金额' }]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="请输入金额"
                      min={0}
                      addonAfter="元"
                      style={{ width: '200px' }}
                    />
                  </Form.Item>
                )}
              </div>
            </Form.Item>

            {/* 演出详情 */}
            <Form.Item
              name="description"
              label="演出详情"
              rules={[{ required: true, message: '请输入演出详情' }]}
            >
              <TextArea
                placeholder="请输入演出详情"
                rows={6}
              />
            </Form.Item>

            {/* 截止日期 */}
            <Form.Item
              name="deadline"
              label="截止日期"
              rules={[{ required: true, message: '请选择截止日期' }]}
            >
              <DatePicker
                className="w-full"
                placeholder="请选择截止日期"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf('day');
                }}
              />
            </Form.Item>

            {/* 联系方式 */}
            <Form.Item
              name="contact"
              label="联系方式"
              rules={[{ required: true, message: '请输入联系方式' }]}
            >
              <Input placeholder="请输入联系方式" />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="w-full"
              >
                发布演出
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
} 