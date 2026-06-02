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

    const [
      pendingReports, totalTopics, totalReplies,
      recentReports, recentTopics,
    ] = await Promise.all([
      db.report.count({ where: { status: "PENDING" } }),
      db.forumTopic.count(),
      db.forumReply.count(),

      db.report.findMany({
        where: { status: "PENDING" },
        include: { reporter: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      db.forumTopic.findMany({
        include: {
          user:   { select: { name: true } },
          course: { select: { title: true } },
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    return NextResponse.json({
      pendingReports, totalTopics, totalReplies,
      recentReports, recentTopics,
    })
  } catch (e) {
    console.error("[MODERATOR_STATS]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
