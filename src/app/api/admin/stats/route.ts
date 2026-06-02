import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalUsers, students, instructors, moderators,
      totalCourses, pendingCourses, publishedCourses,
      totalEnrollments, monthEnrollments,
      totalCertificates, monthCertificates,
      newUsersThisMonth, recentUsers,
      topCourses,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "INSTRUCTOR" } }),
      db.user.count({ where: { role: "MODERATOR" } }),
      db.course.count(),
      db.course.count({ where: { status: "PENDING" } }),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.enrollment.count(),
      db.enrollment.count({ where: { enrolledAt: { gte: startOfMonth } } }),
      db.certificate.count(),
      db.certificate.count({ where: { issuedAt: { gte: startOfMonth } } }),
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      db.course.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { enrollments: { _count: "desc" } },
        take: 5,
        include: {
          instructor: { select: { name: true } },
          _count: { select: { enrollments: true } },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers, students, instructors, moderators,
      totalCourses, pendingCourses, publishedCourses,
      totalEnrollments, monthEnrollments,
      totalCertificates, monthCertificates,
      newUsersThisMonth, recentUsers, topCourses,
    })
  } catch (e) {
    console.error("[ADMIN_STATS]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
