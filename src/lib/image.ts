import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

/**
 * 图片处理选项接口
 */
interface ImageProcessOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'center' | 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top';
  quality?: number;
}

/**
 * 处理并保存图片
 */
export async function processAndSaveImage(
  buffer: Buffer,
  options: ImageProcessOptions = {}
): Promise<string> {
  try {
    // 创建 Sharp 实例
    let image = sharp(buffer);

    // 调整图片大小
    if (options.width || options.height) {
      image = image.resize(options.width, options.height, {
        fit: options.fit || 'cover',
        position: options.position || 'center'
      });
    }

    // 转换为 JPEG 格式并压缩
    const processedBuffer = await image
      .jpeg({
        quality: options.quality || 80,
        mozjpeg: true
      })
      .toBuffer();

    // 生成唯一文件名
    const hash = crypto.createHash('md5')
      .update(processedBuffer)
      .digest('hex');
    const filename = `${hash}.jpg`;

    // 保存文件
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, processedBuffer);

    // 返回文件URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('图片处理失败:', error);
    throw new Error('图片处理失败');
  }
}

/**
 * 处理头像图片
 */
export async function processAvatar(buffer: Buffer): Promise<string> {
  return processAndSaveImage(buffer, {
    width: 400,
    height: 400,
    fit: 'cover',
    position: 'center',
    quality: 80
  });
}

/**
 * 处理相册图片
 */
export async function processPhoto(buffer: Buffer): Promise<string> {
  return processAndSaveImage(buffer, {
    width: 1200,
    fit: 'inside',
    quality: 80
  });
} 