import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { courseId, instructorId, status } = await req.json()

    const data: Record<string, any> = {}
    if (instructorId) data.instructorId = instructorId
    if (status)       data.status       = status

    const course = await db.course.update({
      where: { id: courseId },
      data,
    })

    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
