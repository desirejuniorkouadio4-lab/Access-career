import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const role = (session.user as any).role
    const where = role === "ADMIN" ? {} : { instructorId: session.user.id! }

    const [
      totalCourses, publishedCourses, pendingCourses, draftCourses,
      totalStudents, recentEnrollments,
      pendingAssignments, topCourse,
    ] = await Promise.all([
      db.course.count({ where }),
      db.course.count({ where: { ...where, status: "PUBLISHED" } }),
      db.course.count({ where: { ...where, status: "PENDING" } }),
      db.course.count({ where: { ...where, status: "DRAFT" } }),

      db.enrollment.count({ where: { course: where } }),

      db.enrollment.findMany({
        where: { course: where },
        include: { user: { select: { name: true } }, course: { select: { title: true } } },
        orderBy: { enrolledAt: "desc" },
        take: 5,
      }),

      db.assignmentSubmission.count({
        where: { status: "PENDING", assignment: { course: where } },
      }),

      db.course.findFirst({
        where: { ...where, status: "PUBLISHED" },
        orderBy: { enrollments: { _count: "desc" } },
        include: { _count: { select: { enrollments: true } } },
      }),
    ])

    return NextResponse.json({
      totalCourses, publishedCourses, pendingCourses, draftCourses,
      totalStudents, recentEnrollments, pendingAssignments, topCourse,
    })
  } catch (e) {
    console.error("[INSTRUCTOR_STATS]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
