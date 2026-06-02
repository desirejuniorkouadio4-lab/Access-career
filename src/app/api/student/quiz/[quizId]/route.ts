import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { quizId } = await params

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: { orderBy: { order: "asc" } },
        course: { select: { title: true } },
        lesson: { select: { title: true } },
      },
    })
    if (!quiz) return NextResponse.json({ error: "Quiz introuvable." }, { status: 404 })

    const attempts = await db.quizAttempt.count({
      where: { quizId, userId: session.user.id! },
    })

    const questions = quiz.questions.map((q) => ({
      id: q.id, type: q.type, question: q.question,
      options: q.options, points: q.points, order: q.order,
    }))

    return NextResponse.json({
      ...quiz,
      questions,
      attemptsUsed: attempts,
      canAttempt: attempts < quiz.maxAttempts,
    })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { quizId } = await params
    const { answers } = await req.json()

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { orderBy: { order: "asc" } } },
    })
    if (!quiz) return NextResponse.json({ error: "Quiz introuvable." }, { status: 404 })

    const attemptCount = await db.quizAttempt.count({
      where: { quizId, userId: session.user.id! },
    })
    if (attemptCount >= quiz.maxAttempts) {
      return NextResponse.json({ error: "Nombre maximum de tentatives atteint." }, { status: 400 })
    }

    let score = 0
    let maxScore = 0
    const results = quiz.questions.map((q) => {
      maxScore += q.points
      const userAnswer = answers[q.id]
      const correct = q.correctAnswers as any
      let isCorrect = false

      if (q.type === "SINGLE_CHOICE" || q.type === "TRUE_FALSE") {
        isCorrect = String(userAnswer) === String(Array.isArray(correct) ? correct[0] : correct)
      } else if (q.type === "MULTIPLE_CHOICE") {
        const ua = Array.isArray(userAnswer) ? userAnswer.sort() : []
        const ca = Array.isArray(correct) ? correct.sort() : []
        isCorrect = JSON.stringify(ua) === JSON.stringify(ca)
      }

      if (isCorrect) score += q.points
      return {
        questionId: q.id, userAnswer, isCorrect, points: isCorrect ? q.points : 0,
        ...(quiz.showCorrection ? { correctAnswer: correct, explanation: q.explanation } : {}),
      }
    })

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const passed = percentage >= quiz.passingScore

    const attempt = await db.quizAttempt.create({
      data: {
        quizId, userId: session.user.id!,
        score: percentage, maxScore: 100,
        passed, attemptNumber: attemptCount + 1,
        answers: results, submittedAt: new Date(),
      },
    })

    return NextResponse.json({ attempt, score: percentage, passed, results, maxAttempts: quiz.maxAttempts, attemptsUsed: attemptCount + 1 })
  } catch (e) {
    console.error("[QUIZ_SUBMIT]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
