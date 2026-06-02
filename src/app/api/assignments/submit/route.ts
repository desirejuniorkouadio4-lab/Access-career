import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { assignmentId, textAnswer, externalLink } = await req.json()

    const submission = await db.assignmentSubmission.create({
      data: { assignmentId, userId: session.user.id!, textAnswer, externalLink, status: "PENDING" },
    })
    return NextResponse.json(submission, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { submissionId, score, feedback, status } = await req.json()

    const submission = await db.assignmentSubmission.update({
      where: { id: submissionId },
      data: { score, feedback, status: status || "GRADED", reviewedById: session.user.id!, reviewedAt: new Date() },
    })
    return NextResponse.json(submission)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
