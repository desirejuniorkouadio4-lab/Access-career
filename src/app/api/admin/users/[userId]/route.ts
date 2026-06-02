import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { userId } = await params

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, image: true, bio: true, country: true,
        city: true, createdAt: true,
        enrollments: {
          include: {
            course: { select: { title: true, category: true } },
          },
          orderBy: { enrolledAt: "desc" },
        },
        certificates: {
          include: {
            course: { select: { title: true } },
          },
          orderBy: { issuedAt: "desc" },
        },
        courses: {
          select: {
            id: true, title: true, status: true,
            _count: { select: { enrollments: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 })

    return NextResponse.json(user)
  } catch (e) {
    console.error("[ADMIN_USER_DETAIL]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
