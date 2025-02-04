import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ComedianProfile } from '@/models/ComedianProfile';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * 获取单个演员详情
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log('当前session:', session);
    
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    console.log('正在查询演员ID:', params.id);
    await connectToDatabase();

    // 先尝试通过 _id 查询
    const comedian = await ComedianProfile.findById(params.id);
    console.log('查询结果:', comedian);

    if (!comedian) {
      return NextResponse.json(
        { message: '未找到该演员', searchId: params.id },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: comedian });
  } catch (error) {
    console.error('获取演员详情失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { message: '获取演员详情失败', error: errorMessage },
      { status: 500 }
    );
  }
} 