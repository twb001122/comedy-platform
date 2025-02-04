/**
 * 获取完整的图片 URL
 * @param path 图片路径
 * @returns 完整的图片 URL
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}${path}`;
} 