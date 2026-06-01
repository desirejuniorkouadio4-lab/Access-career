import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        instructor: { select: { name: true, image: true, bio: true } },
        chapters: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
        _count: { select: { enrollments: true, reviews: true } },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
