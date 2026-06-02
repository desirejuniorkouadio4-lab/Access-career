import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const user = await db.user.findUnique({
      where: { id: session.user.id! },
      select: { name: true, email: true, phone: true, bio: true, country: true, city: true, educationLevel: true, professionalGoal: true, image: true },
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
    const { name, phone, bio, country, city, educationLevel, professionalGoal, image } = await req.json()
    const data: Record<string, any> = {}
    if (name !== undefined) data.name = name
    if (phone !== undefined) data.phone = phone
    if (bio !== undefined) data.bio = bio
    if (country !== undefined) data.country = country
    if (city !== undefined) data.city = city
    if (educationLevel !== undefined) data.educationLevel = educationLevel
    if (professionalGoal !== undefined) data.professionalGoal = professionalGoal
    if (image !== undefined) data.image = image

    const user = await db.user.update({ where: { id: session.user.id! }, data })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
