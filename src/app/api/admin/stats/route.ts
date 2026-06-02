import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé." }, { status: 403 })

    const [totalUsers, totalCourses, totalEnrollments, totalCertificates, students, instructors, pendingCourses] = await Promise.all([
      db.user.count(),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.enrollment.count(),
      db.certificate.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "INSTRUCTOR" } }),
      db.course.count({ where: { status: "PENDING" } }),
    ])

    return NextResponse.json({ totalUsers, totalCourses, totalEnrollments, totalCertificates, students, instructors, pendingCourses })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
