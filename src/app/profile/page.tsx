import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

/**
 * 个人资料页面组件
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">个人资料</h1>
      <ProfileForm user={session.user} />
    </div>
  );
} 