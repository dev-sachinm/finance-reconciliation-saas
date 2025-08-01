// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import connect from '@/dbConfig/db-config';
import User from '@/models/userModel';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
              await connect().catch(error => {
                throw new Error('Database connection failed');
              });
              const user = await User.findOne({
                  $or:[
                      {email: credentials.username},
                      {username: credentials.username}
                  ]
              })
              if(!user){
                  throw new Error("No user found for given username or email:"+credentials.username)
              }
              if(!user.isVerified){
                  throw new Error("User is not verified")
              }
              const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
              if(isPasswordCorrect){
                  return user
              } else {
                  throw new Error("Incorrect Password")
              }
          } catch(err: any) {
              throw err
          }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth?.user;

      const protectedRoutes = ['/blog'];
      const publicAuthRoutes = ['/sign-in', '/sign-up'];
      
      const isProtectedPath = protectedRoutes.some(path =>
          pathname.startsWith(path)
      );
      const isPublicAuthPath = publicAuthRoutes.includes(pathname);

      if (isPublicAuthPath || pathname.startsWith('/api/auth')) {
        if (isAuthenticated && isPublicAuthPath) {
          return NextResponse.redirect(new URL('/', request.nextUrl));
        }
        return true;
      }

      if (isProtectedPath && !isAuthenticated) {
        const signInPage = authConfig.pages.signIn;
        const signInUrl = new URL(
          `${signInPage}?callbackUrl=${encodeURIComponent(pathname + request.nextUrl.search)}`,
          request.nextUrl.origin
        );
        return NextResponse.redirect(signInUrl);
      }
      
      return isAuthenticated;
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);