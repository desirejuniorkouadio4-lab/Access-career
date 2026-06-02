import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { courseId } = await params

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { name: true, email: true } },
        chapters: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
        _count: {
          select: { enrollments: true, reviews: true, chapters: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (e) {
    console.error("[ADMIN_COURSE_DETAIL]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
