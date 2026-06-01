import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const level    = searchParams.get("level") || ""
    const free     = searchParams.get("free") || ""

    const courses = await db.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(search   && { title: { contains: search, mode: "insensitive" } }),
        ...(category && { category: category as any }),
        ...(level    && { level: level as any }),
        ...(free === "true" && { isFree: true }),
      },
      include: {
        instructor: { select: { name: true, image: true } },
        _count: { select: { enrollments: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(courses)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const role = (session.user as any).role
    if (role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.json({ error: "Réservé aux formateurs." }, { status: 403 })
    }
    const { title, description, category, level, price, isFree } = await req.json()
    if (!title || !category || !description) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
    }
    const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") + "-" + Date.now()
    const course = await db.course.create({
      data: {
        title, slug, description, category, level,
        price: isFree ? 0 : price || 0,
        isFree, status: "DRAFT",
        instructorId: session.user.id!,
      },
    })
    return NextResponse.json(course, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
