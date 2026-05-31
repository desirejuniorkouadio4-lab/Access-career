import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const path = nextUrl.pathname

      const isProtected = ["/admin", "/instructor", "/student", "/moderator"].some(
        (p) => path.startsWith(p)
      )
      const isAuthPage = ["/login", "/register"].some((p) => path.startsWith(p))

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl))
      }

      if (isAuthPage && isLoggedIn) {
        if (role === "ADMIN") return Response.redirect(new URL("/admin", nextUrl))
        if (role === "INSTRUCTOR") return Response.redirect(new URL("/instructor", nextUrl))
        if (role === "MODERATOR") return Response.redirect(new URL("/moderator", nextUrl))
        return Response.redirect(new URL("/student", nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
