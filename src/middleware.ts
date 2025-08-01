import { auth } from "@/auth";

export default auth;

export const config = {
    matcher: [        
        '/dashboard/:path*',
        '/settings/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/blog',
        '/sign-in',
        '/sign-up',
        '/verify',
        '/auth/sign-in',
        '/auth/sign-out',
    ],
};