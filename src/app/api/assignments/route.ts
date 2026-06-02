import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const role = (session.user as any).role
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    if (role === "INSTRUCTOR" || role === "ADMIN") {
      const assignments = await db.assignment.findMany({
        where: courseId ? { courseId } : { course: { instructorId: session.user.id! } },
        include: {
          course: { select: { title: true } },
          lesson: { select: { title: true } },
          submissions: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(assignments)
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id! },
      select: { courseId: true },
    })
    const courseIds = enrollments.map(e => e.courseId)

    const assignments = await db.assignment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { title: true } },
        lesson: { select: { title: true } },
        submissions: { where: { userId: session.user.id! } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(assignments)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { title, instructions, courseId, lessonId, maxScore, dueDate } = await req.json()

    const assignment = await db.assignment.create({
      data: { title, instructions, courseId, lessonId: lessonId || null, maxScore: maxScore || 100, dueDate: dueDate ? new Date(dueDate) : null },
    })
    return NextResponse.json(assignment, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
