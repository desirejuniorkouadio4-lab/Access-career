import { NextRequest, NextResponse } from "next/server"

const protectedPaths = ["/admin", "/instructor", "/student", "/moderator"]
const authPaths = ["/login", "/register"]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth.js stocke la session dans ce cookie (http en dev, https en prod)
  const session =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!session
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/student", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
