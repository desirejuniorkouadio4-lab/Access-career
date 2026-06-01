import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }
    const { userId, role } = await req.json()
    const updated = await db.user.update({ where: { id: userId }, data: { role } })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
