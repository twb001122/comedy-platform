import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ComedianProfile } from '@/models/ComedianProfile';
import { connectToDatabase } from '@/lib/db';

/**
 * 获取个人资料
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: '未登录' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const profile = await ComedianProfile.findOne({ userId: session.user.id });

    return NextResponse.json(profile || {});
  } catch (error) {
    console.error('获取个人资料失败:', error);
    return NextResponse.json(
      { message: '获取个人资料失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新个人资料
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: '未登录' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('接收到的数据:', data);

    await connectToDatabase();

    try {
      const profile = await ComedianProfile.findOneAndUpdate(
        { userId: session.user.id },
        {
          userId: session.user.id,
          ...data,
          updatedAt: new Date()
        },
        { 
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      console.log('更新后的数据:', profile);
      return NextResponse.json(profile);
    } catch (dbError: any) {
      console.error('数据库操作失败:', dbError);
      
      // 处理验证错误
      if (dbError.name === 'ValidationError') {
        const errors = Object.values(dbError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { message: errors.join(', ') },
          { status: 400 }
        );
      }

      // 处理其他数据库错误
      return NextResponse.json(
        { message: dbError.message || '数据库操作失败' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('更新个人资料失败:', error);
    return NextResponse.json(
      { message: error.message || '更新个人资料失败' },
      { status: 500 }
    );
  }
} 