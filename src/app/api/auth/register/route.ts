import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { z } from 'zod';

// 注册表单验证模式
const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  name: z.string().min(2, '姓名至少2个字符'),
  role: z.enum(['comedian', 'organizer'], {
    required_error: '请选择有效的角色',
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('收到注册请求:', body);
    
    // 验证请求数据
    const validatedData = registerSchema.parse(body);
    console.log('数据验证通过:', validatedData);

    try {
      await connectDB();
      console.log('数据库连接成功');
    } catch (dbError) {
      console.error('数据库连接错误:', dbError);
      return NextResponse.json(
        { message: '数据库连接失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      console.log('邮箱已存在:', validatedData.email);
      return NextResponse.json(
        { message: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建新用户
    try {
      const user = await User.create(validatedData);
      console.log('用户创建成功:', user._id);

      return NextResponse.json(
        {
          message: '注册成功',
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } catch (createError: any) {
      console.error('用户创建失败:', createError);
      return NextResponse.json(
        { message: `用户创建失败: ${createError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('数据验证错误:', error.errors);
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('注册错误:', error);
    return NextResponse.json(
      { message: '注册失败，请重试' },
      { status: 500 }
    );
  }
} 