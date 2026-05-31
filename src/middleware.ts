import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const path = req.nextUrl.pathname

  const isProtected =
    path.startsWith("/admin") ||
    path.startsWith("/instructor") ||
    path.startsWith("/student") ||
    path.startsWith("/moderator")

  const isAuthPage =
    path.startsWith("/login") || path.startsWith("/register")

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthPage && isLoggedIn) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url))
    if (role === "INSTRUCTOR") return NextResponse.redirect(new URL("/instructor", req.url))
    if (role === "MODERATOR") return NextResponse.redirect(new URL("/moderator", req.url))
    return NextResponse.redirect(new URL("/student", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
