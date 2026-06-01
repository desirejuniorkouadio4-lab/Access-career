import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ completedLessonIds: [] })

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    if (!courseId) return NextResponse.json({ completedLessonIds: [] })

    // Récupérer toutes les leçons du cours
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: { include: { lessons: { select: { id: true } } } },
      },
    })

    if (!course) return NextResponse.json({ completedLessonIds: [] })

    const allLessonIds = course.chapters.flatMap(c => c.lessons.map(l => l.id))

    const progress = await db.userProgress.findMany({
      where: {
        userId: session.user.id!,
        lessonId: { in: allLessonIds },
        isCompleted: true,
      },
      select: { lessonId: true },
    })

    return NextResponse.json({
      completedLessonIds: progress.map(p => p.lessonId),
    })
  } catch {
    return NextResponse.json({ completedLessonIds: [] })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const { lessonId } = await req.json()
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId requis." }, { status: 400 })
    }

    const progress = await db.userProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id!, lessonId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId: session.user.id!, lessonId, isCompleted: true, completedAt: new Date() },
    })

    // Vérifier si tout le cours est terminé
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            course: {
              include: { chapters: { include: { lessons: { select: { id: true } } } } },
            },
          },
        },
      },
    })

    if (lesson) {
      const allLessonIds = lesson.chapter.course.chapters.flatMap(c => c.lessons.map(l => l.id))
      const completedCount = await db.userProgress.count({
        where: {
          userId: session.user.id!,
          lessonId: { in: allLessonIds },
          isCompleted: true,
        },
      })

      if (completedCount === allLessonIds.length) {
        await db.enrollment.updateMany({
          where: { userId: session.user.id!, courseId: lesson.chapter.courseId },
          data: { completedAt: new Date(), progress: 100 },
        })
        await db.certificate.upsert({
          where: {
            userId_courseId: { userId: session.user.id!, courseId: lesson.chapter.courseId },
          },
          update: {},
          create: { userId: session.user.id!, courseId: lesson.chapter.courseId },
        })
      }
    }

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("[PROGRESS_POST]", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
