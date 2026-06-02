import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const courses = await db.course.findMany({
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        _count: { select: { enrollments: true, chapters: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(courses)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { courseId, status, instructorId } = await req.json()

    const data: Record<string, any> = {}
    if (status) data.status = status
    if (instructorId) data.instructorId = instructorId

    const course = await db.course.update({
      where: { id: courseId },
      data,
      include: { instructor: { select: { name: true } } },
    })

    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { courseId } = await req.json()

    await db.enrollment.deleteMany({ where: { courseId } })
    await db.review.deleteMany({ where: { courseId } })
    await db.certificate.deleteMany({ where: { courseId } })
    const chapters = await db.chapter.findMany({ where: { courseId }, select: { id: true } })
    for (const ch of chapters) {
      await db.userProgress.deleteMany({ where: { lesson: { chapterId: ch.id } } })
      await db.lesson.deleteMany({ where: { chapterId: ch.id } })
    }
    await db.chapter.deleteMany({ where: { courseId } })
    await db.course.delete({ where: { id: courseId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
