import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Connexion requise." }, { status: 401 })
    }

    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 400 })
    }

    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 })
    }
    if (!course.isFree) {
      return NextResponse.json({ error: "Ce cours est payant. Paiement requis." }, { status: 402 })
    }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id!, courseId } },
    })
    if (existing) {
      return NextResponse.json({ message: "Déjà inscrit.", enrolled: true })
    }

    await db.enrollment.create({
      data: { userId: session.user.id!, courseId },
    })

    return NextResponse.json({ message: "Inscription réussie.", enrolled: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
