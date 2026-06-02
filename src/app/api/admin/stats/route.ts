import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const [
      totalUsers, totalStudents, totalInstructors,
      totalCourses, publishedCourses, pendingCourses, draftCourses,
      totalEnrollments, totalCertificates,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "INSTRUCTOR" } }),
      db.course.count(),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.course.count({ where: { status: "PENDING" } }),
      db.course.count({ where: { status: "DRAFT" } }),
      db.enrollment.count(),
      db.certificate.count(),
    ])

    const recentUsers = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const pendingCoursesList = await db.course.findMany({
      where: { status: "PENDING" },
      include: { instructor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      stats: {
        totalUsers, totalStudents, totalInstructors,
        totalCourses, publishedCourses, pendingCourses, draftCourses,
        totalEnrollments, totalCertificates,
      },
      recentUsers,
      pendingCoursesList,
    })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
