import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé." }, { status: 403 })

    const courses = await db.course.findMany({
      include: { instructor: { select: { name: true } }, _count: { select: { enrollments: true, chapters: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(courses)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
