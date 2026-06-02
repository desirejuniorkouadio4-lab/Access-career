import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const { currentPassword, newPassword } = await req.json()

    const user = await db.user.findUnique({ where: { id: session.user.id! } })
    if (!user?.password) return NextResponse.json({ error: "Impossible de modifier le mot de passe." }, { status: 400 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 })

    const hashed = await bcrypt.hash(newPassword, 12)
    await db.user.update({ where: { id: session.user.id! }, data: { password: hashed } })

    return NextResponse.json({ message: "Mot de passe modifié." })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
