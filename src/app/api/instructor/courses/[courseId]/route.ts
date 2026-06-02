import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createNotification } from "@/lib/notifications"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const { courseId } = await params
    const role = (session.user as any).role

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
        enrollments: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { enrolledAt: "desc" },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 })
    }

    if (role !== "ADMIN" && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    return NextResponse.json(course)
  } catch (e) {
    console.error("[INSTRUCTOR_COURSE_GET]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const { courseId } = await params
    const body = await req.json()

    const course = await db.course.update({
      where: { id: courseId },
      data: body,
    })

    if (body.status === "PENDING") {
      const admins = await db.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      })
      for (const admin of admins) {
        await createNotification({
          userId: admin.id,
          type: "COURSE_SUBMITTED",
          message: `Le formateur a soumis "${course.title}" à validation.`,
          link: "/admin/courses",
        })
      }
    }

    return NextResponse.json(course)
  } catch (e) {
    console.error("[INSTRUCTOR_COURSE_PATCH]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
