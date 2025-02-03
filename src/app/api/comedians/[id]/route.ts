import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ComedianProfile } from '@/models/ComedianProfile';

/**
 * 获取单个演员详情
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const comedian = await ComedianProfile.findById(params.id);

    if (!comedian) {
      return NextResponse.json(
        { message: '未找到该演员' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: comedian });
  } catch (error) {
    console.error('获取演员详情失败:', error);
    return NextResponse.json(
      { message: '获取演员详情失败' },
      { status: 500 }
    );
  }
} 