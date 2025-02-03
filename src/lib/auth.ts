import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/models/User';
import { connectToDatabase } from './db';
import bcrypt from 'bcryptjs';

/**
 * 扩展 JWT 类型
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

/**
 * 扩展 Session 类型
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

/**
 * NextAuth 配置选项
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('用户不存在');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('密码错误');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}; 