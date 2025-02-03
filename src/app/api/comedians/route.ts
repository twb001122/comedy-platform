import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ComedianProfile } from '@/models/ComedianProfile';
import { User } from '@/models/User';

export const runtime = 'nodejs';

/**
 * 获取演员列表
 */
export async function GET() {
  try {
    await connectToDatabase();

    // 获取所有演员资料
    const comedians = await ComedianProfile.find({})
      .select('avatar stageName experience location hasCommercialExp hasScriptwritingExp hasPersonalShow hasVarietyExp')
      .lean();

    return NextResponse.json({
      code: 0,
      data: comedians
    });
  } catch (error) {
    console.error('获取演员列表失败:', error);
    return NextResponse.json(
      { message: '获取演员列表失败' },
      { status: 500 }
    );
  }
} 