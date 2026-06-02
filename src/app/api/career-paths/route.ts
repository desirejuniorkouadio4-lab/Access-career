import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const paths = await db.careerPath.findMany({
      where: { status: "PUBLISHED" },
      include: {
        courses: {
          orderBy: { sortOrder: "asc" },
          include: {
            course: {
              select: { id: true, title: true, slug: true, category: true, level: true, isFree: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(paths)
  } catch (e) {
    console.error("[CAREER_PATHS]", e)
    return NextResponse.json([])
  }
}
