import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const path = await db.careerPath.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { sortOrder: "asc" },
          include: {
            course: {
              include: {
                instructor: { select: { name: true } },
                _count: { select: { enrollments: true, chapters: true } },
              },
            },
          },
        },
      },
    })
    if (!path) return NextResponse.json({ error: "Parcours introuvable." }, { status: 404 })
    return NextResponse.json(path)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
