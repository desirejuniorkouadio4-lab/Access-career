import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { courseId } = await params

    const quizzes = await db.quiz.findMany({
      where: { courseId },
      include: { questions: { orderBy: { order: "asc" } }, lesson: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(quizzes)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { courseId } = await params
    const { title, description, lessonId, passingScore, maxAttempts, durationMinutes, showCorrection, questions } = await req.json()

    const quiz = await db.quiz.create({
      data: {
        title, description, courseId,
        lessonId: lessonId || null,
        passingScore: passingScore || 70,
        maxAttempts: maxAttempts || 3,
        durationMinutes: durationMinutes || null,
        showCorrection: showCorrection ?? true,
        questions: {
          create: (questions || []).map((q: any, i: number) => ({
            type: q.type || "SINGLE_CHOICE",
            question: q.question,
            options: q.options || [],
            correctAnswers: q.correctAnswers || [],
            points: q.points || 1,
            explanation: q.explanation || null,
            order: i + 1,
          })),
        },
      },
      include: { questions: true },
    })
    return NextResponse.json(quiz, { status: 201 })
  } catch (e) {
    console.error("[QUIZ_POST]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { quizId } = await req.json()
    await db.quiz.delete({ where: { id: quizId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
