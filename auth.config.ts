import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isOnAdmin) {
        if (isLoginPage) {
          if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }

        if (!isLoggedIn) {
          return false; // Will redirect to pages.signIn ("/admin/login")
        }

        return true;
      }

      return true;
    },
  },
  providers: [], // Configured with credentials in auth.ts
} satisfies NextAuthConfig;
