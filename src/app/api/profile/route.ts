import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const user = await db.user.findUnique({
      where: { id: session.user.id! },
      select: {
        name: true, email: true, phone: true, bio: true,
        country: true, city: true, educationLevel: true,
        professionalGoal: true, image: true,
      },
    })

    return NextResponse.json(user || {})
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const { name, phone, bio, country, city, educationLevel, professionalGoal } = await req.json()

    const user = await db.user.update({
      where: { id: session.user.id! },
      data: { name, phone, bio, country, city, educationLevel, professionalGoal },
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
