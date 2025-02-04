import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userId: string;
    role?: 'comedian' | 'organizer';
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userId: string;
      name?: string | null;
      email?: string | null;
      role?: 'comedian' | 'organizer';
    };
  }

  interface User {
    id: string;
    userId: string;
    name?: string | null;
    email?: string | null;
    role?: 'comedian' | 'organizer';
  }
} 