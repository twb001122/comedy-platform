import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { AuthOptions } from "next-auth";

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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userId = user.id;
        token.role = user.role;
        console.log('JWT 回调 - token 数据:', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userId = token.id as string;
        session.user.role = token.role as 'comedian' | 'organizer';
        console.log('Session 回调 - session 数据:', session.user);
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 