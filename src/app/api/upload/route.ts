import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';
import crypto from 'crypto';
import sharp from 'sharp';

/**
 * 处理图片并上传到 R2
 * @param buffer 图片buffer
 * @param type 图片类型
 * @returns 图片相对路径
 */
async function processAndUploadImage(buffer: Buffer, type: 'avatar' | 'photo'): Promise<string> {
  // 生成唯一文件名
  const hash = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const filename = `${type}/${timestamp}-${hash}.webp`;

  // 处理图片
  let processedImage: Buffer;
  if (type === 'avatar') {
    processedImage = await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
  } else {
    processedImage = await sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  // 上传到 R2
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
    Body: processedImage,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000',
  }));

  // 返回相对路径
  return `/${filename}`;
}

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
    const type = formData.get('type') as 'avatar' | 'photo';

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

    // 处理并上传图片
    const path = await processAndUploadImage(buffer, type);

    return NextResponse.json({ url: path });
  } catch (error: any) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { message: '文件上传失败', error: error?.message || '未知错误' },
      { status: 500 }
    );
  }
} 