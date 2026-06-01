import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id! },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            chapters: { include: { lessons: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    })

    const data = await Promise.all(
      enrollments.map(async (enrollment) => {
        const allLessonIds = enrollment.course.chapters.flatMap(c => c.lessons.map(l => l.id))
        const totalLessons = allLessonIds.length

        const completedLessons = totalLessons > 0
          ? await db.userProgress.count({
              where: {
                userId: session.user.id!,
                lessonId: { in: allLessonIds },
                isCompleted: true,
              },
            })
          : 0

        const progress = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0

        return {
          enrollmentId:    enrollment.id,
          enrolledAt:      enrollment.enrolledAt,
          completedAt:     enrollment.completedAt,
          progress,
          totalLessons,
          completedLessons,
          course: {
            id:         enrollment.course.id,
            title:      enrollment.course.title,
            slug:       enrollment.course.slug,
            category:   enrollment.course.category,
            level:      enrollment.course.level,
            isFree:     enrollment.course.isFree,
            instructor: enrollment.course.instructor,
          },
        }
      })
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error("[STUDENT_COURSES]", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
