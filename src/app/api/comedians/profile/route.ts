import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ComedianProfile } from '@/models/ComedianProfile';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * 获取当前登录用户的演员资料
 * @route GET /api/comedians/profile
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('API Session:', session);

    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    if (!session.user) {
      return NextResponse.json({ error: "无用户信息" }, { status: 401 });
    }

    if (!session.user.id) {
      return NextResponse.json({ error: "无用户ID" }, { status: 401 });
    }

    await connectToDatabase();

    // 使用 session.user.id (对应 User 表的 _id) 来查找演员资料卡
    const comedian = await ComedianProfile.findOne({ 
      userId: session.user.id
    });

    console.log('查询条件:', { userId: session.user.id });
    console.log('查询结果:', comedian);

    if (!comedian) {
      return NextResponse.json(
        { message: '未找到演员资料' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: comedian });
  } catch (error: any) {
    console.error('获取演员资料失败:', error);
    return NextResponse.json(
      { 
        message: '获取演员资料失败', 
        error: error?.message || '未知错误'
      },
      { status: 500 }
    );
  }
} 