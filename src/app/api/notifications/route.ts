import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json([])

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id! },
      orderBy: { createdAt: "desc" },
      take: 30,
    })

    return NextResponse.json(notifications)
  } catch {
    return NextResponse.json([])
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const { notificationId, markAllRead } = await req.json()

    if (markAllRead) {
      await db.notification.updateMany({
        where: { userId: session.user.id!, read: false },
        data:  { read: true },
      })
    } else if (notificationId) {
      await db.notification.update({
        where: { id: notificationId },
        data:  { read: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
