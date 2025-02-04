import { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

/**
 * 扩展 JWT 类型
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  }
}

/**
 * 扩展 Session 类型
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userId: string;
      name?: string;
      email?: string;
      role?: string;
    }
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  }
}

/**
 * NextAuth 配置选项
 */
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error('用户不存在');
          }

          const isValid = await user.comparePassword(credentials?.password);
          if (!isValid) {
            throw new Error('密码错误');
          }

          const userId = user._id.toString();
          console.log('数据库中的用户 ID:', userId);

          const userData = {
            id: userId,
            userId: userId,
            email: user.email,
            name: user.name,
            role: user.role,
          };
          
          console.log('认证成功，用户数据:', userData);
          return userData;
        } catch (error) {
          console.error('认证错误:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.userId = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}; 