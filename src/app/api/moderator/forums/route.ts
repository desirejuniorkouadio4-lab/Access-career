import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    if (role !== "MODERATOR" && role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const topics = await db.forumTopic.findMany({
      include: {
        user:   { select: { name: true } },
        course: { select: { title: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(topics)
  } catch {
    return NextResponse.json([])
  }
}
