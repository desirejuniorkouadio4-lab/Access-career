import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    const topics = await db.forumTopic.findMany({
      where: { courseId },
      include: { user: { select: { name: true, image: true } }, _count: { select: { replies: true } } },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(topics)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { courseId } = await params
    const { title, content } = await req.json()
    const topic = await db.forumTopic.create({
      data: { title, content, courseId, userId: session.user.id! },
    })
    return NextResponse.json(topic, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
