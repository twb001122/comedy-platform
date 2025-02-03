import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { processAvatar, processPhoto } from '@/lib/image';
export const runtime = 'nodejs';

/**
 * 文件上传处理
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { message: '请选择文件' },
        { status: 400 }
      );
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: '文件大小不能超过5MB' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: '只能上传图片文件' },
        { status: 400 }
      );
    }

    // 将文件转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 根据类型处理图片
    let url: string;
    if (type === 'avatar') {
      url = await processAvatar(buffer);
    } else if (type === 'photo') {
      url = await processPhoto(buffer);
    } else {
      return NextResponse.json(
        { message: '无效的上传类型' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { message: '文件上传失败' },
      { status: 500 }
    );
  }
} 