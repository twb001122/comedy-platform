import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/db';

/**
 * 更新用户角色
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: '未登录' },
        { status: 401 }
      );
    }

    const { role } = await request.json();
    
    if (!role || !['comedian', 'organizer'].includes(role)) {
      return NextResponse.json(
        { message: '无效的角色' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { role },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error('更新用户角色失败:', error);
    return NextResponse.json(
      { message: '更新用户角色失败' },
      { status: 500 }
    );
  }
} 