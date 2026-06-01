import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const certificates = await db.certificate.findMany({
      where: { userId: session.user.id! },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    })

    return NextResponse.json(certificates)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
