import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json([])

    const role = (session.user as any).role
    const courses = await db.course.findMany({
      where: role === "ADMIN" ? {} : { instructorId: session.user.id },
      include: {
        _count: { select: { enrollments: true, reviews: true, chapters: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(courses)
  } catch (e) {
    console.error("[INSTRUCTOR_COURSES]", e)
    return NextResponse.json([])
  }
}
