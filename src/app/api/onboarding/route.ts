import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ onboarded: true })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    return NextResponse.json({ onboarded: (user as any)?.onboarded ?? false })
  } catch {
    return NextResponse.json({ onboarded: true })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })

    const body = await req.json()

    await db.$executeRaw`UPDATE "User" SET "onboarded" = true, "goals" = ${body.goals || ""} WHERE "id" = ${session.user.id}`

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[ONBOARDING]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
