'use client';

import { useSession } from 'next-auth/react';
import ProfileForm from '@/components/ProfileForm';

interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  } | null;
}

/**
 * 个人资料页面组件
 */
export default function ProfilePage() {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">个人资料</h1>
      <ProfileForm user={session.user} />
    </div>
  );
} 