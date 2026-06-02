import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json([], { status: 401 })
    const role = (session.user as any).role

    const where = role === "ADMIN" ? {} : { course: { instructorId: session.user.id! } }
    const enrollments = await db.enrollment.findMany({
      where,
      include: { user: { select: { name: true, email: true, image: true } }, course: { select: { title: true } } },
      orderBy: { enrolledAt: "desc" },
    })
    return NextResponse.json(enrollments)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
