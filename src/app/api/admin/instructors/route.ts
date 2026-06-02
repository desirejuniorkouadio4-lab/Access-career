import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const instructors = await db.user.findMany({
      where: { role: { in: ["INSTRUCTOR", "ADMIN"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(instructors)
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
