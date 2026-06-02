import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const role   = searchParams.get("role") || ""
    const search = searchParams.get("search") || ""

    const users = await db.user.findMany({
      where: {
        ...(role && { role: role as any }),
        ...(search && {
          OR: [
            { name:  { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, image: true, createdAt: true,
        _count: { select: { enrollments: true, courses: true, certificates: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (e) {
    console.error("[ADMIN_USERS_GET]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { name, email, password, role, phone } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nom, email et mot de passe requis." }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { name, email, password: hashed, role: role || "STUDENT", phone: phone || null },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (e) {
    console.error("[ADMIN_USERS_POST]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { userId, role, name, email, phone, action } = await req.json()

    if (action === "suspend") {
      const user = await db.user.update({ where: { id: userId }, data: { role: "MODERATOR" } })
      return NextResponse.json(user)
    }

    const data: Record<string, any> = {}
    if (role)  data.role  = role
    if (name)  data.name  = name
    if (email) data.email = email
    if (phone !== undefined) data.phone = phone

    const user = await db.user.update({ where: { id: userId }, data })
    return NextResponse.json(user)
  } catch (e) {
    console.error("[ADMIN_USERS_PATCH]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { userId } = await req.json()

    if (userId === session?.user?.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 })
    }

    await db.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[ADMIN_USERS_DELETE]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
