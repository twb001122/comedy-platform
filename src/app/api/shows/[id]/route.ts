import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Show } from '@/models/Show';

/**
 * 获取单个演出详情的API路由处理函数
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const show = await Show.findById(params.id)
      .populate('userId', 'name email')
      .lean();

    if (!show) {
      return NextResponse.json(
        { message: '演出信息不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(show);
  } catch (error) {
    console.error('获取演出详情失败:', error);
    return NextResponse.json(
      { message: '获取演出详情失败' },
      { status: 500 }
    );
  }
} 