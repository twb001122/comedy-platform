import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Show } from '@/models/Show';
import { User } from '@/models/User';

/**
 * 发布演出
 */
export async function POST(request: Request) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    console.log('当前会话信息:', JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 通过邮箱查找用户
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取请求数据
    const data = await request.json();
    console.log('提交的数据:', JSON.stringify(data, null, 2));

    // 创建演出信息
    const show = await Show.create({
      ...data,
      userId: user._id // 使用从数据库查询到的用户 ID
    });

    return NextResponse.json({ data: show });
  } catch (error) {
    console.error('发布演出失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '发布演出失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取演出列表
 */
export async function GET() {
  try {
    await connectToDatabase();

    // 获取所有演出信息，按创建时间倒序排列
    const shows = await Show.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    return NextResponse.json({ data: shows });
  } catch (error) {
    console.error('获取演出列表失败:', error);
    return NextResponse.json(
      { message: '获取演出列表失败' },
      { status: 500 }
    );
  }
} 