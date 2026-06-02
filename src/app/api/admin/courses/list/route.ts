import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status     = searchParams.get("status")     || ""
    const category   = searchParams.get("category")   || ""
    const search     = searchParams.get("search")     || ""
    const instructor = searchParams.get("instructor") || ""

    const courses = await db.course.findMany({
      where: {
        ...(status     && { status: status as any }),
        ...(category   && { category: category as any }),
        ...(instructor && { instructorId: instructor }),
        ...(search     && {
          OR: [
            { title:       { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        _count: {
          select: { enrollments: true, chapters: true, reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(courses)
  } catch (e) {
    console.error("[ADMIN_COURSES_LIST]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
