import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params
    const topic = await db.forumTopic.findUnique({
      where: { id: topicId },
      include: {
        user: { select: { name: true, role: true } },
        replies: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: "asc" } },
        course: { select: { title: true } },
      },
    })
    return NextResponse.json(topic)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { topicId } = await params
    const { content } = await req.json()
    const role = (session.user as any).role
    const reply = await db.forumReply.create({
      data: { content, topicId, userId: session.user.id!, isOfficialAnswer: role === "INSTRUCTOR" || role === "ADMIN" },
    })
    return NextResponse.json(reply, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
