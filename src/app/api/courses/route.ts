import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    + "-" + Date.now()
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

    const course = await db.course.create({
      data: {
        title,
        slug: slugify(title),
        description,
        category,
        level,
        price: isFree ? 0 : price || 0,
        isFree,
        status: "DRAFT",
        instructorId: session.user.id!,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("[COURSES_POST]", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
