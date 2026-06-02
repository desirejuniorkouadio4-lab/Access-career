import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json([])

    const attempts = await db.quizAttempt.findMany({
      where: { userId: session.user.id! },
      include: {
        quiz: {
          include: { course: { select: { title: true } } },
        },
      },
      orderBy: { startedAt: "desc" },
    })

    return NextResponse.json(attempts)
  } catch {
    return NextResponse.json([])
  }
}
