import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from '@/lib/db';
import { ComedianProfile } from '@/models/ComedianProfile';
import { authOptions } from '@/lib/auth';
/**
 * 获取当前登录用户的演员资料
 * @route GET /api/comedians/profile
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    await connectToDatabase();

    // 使用 session.user.id (对应 User 表的 _id) 来查找演员资料卡
    const comedian = await ComedianProfile.findOne({ 
      userId: session.user.id
    });

    if (!comedian) {
      return NextResponse.json(
        { message: '未找到演员资料' },
      );
    }

    return NextResponse.json({ data: comedian });
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: '获取演员资料失败', 
        error: error?.message || '未知错误'
      },
      { status: 500 }
    );
  }
} 