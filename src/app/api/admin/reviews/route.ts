import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const reviews = await db.review.findMany({
      include: {
        user:   { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (e) {
    console.error("[ADMIN_REVIEWS]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { reviewId, status } = await req.json()

    const review = await db.review.update({
      where: { id: reviewId },
      data:  { status },
    })

    return NextResponse.json(review)
  } catch (e) {
    console.error("[ADMIN_REVIEWS_PATCH]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { reviewId } = await req.json()
    await db.review.delete({ where: { id: reviewId } })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[ADMIN_REVIEWS_DELETE]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
