import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const projects = await db.portfolioProject.findMany({
      where: { userId: session.user.id! },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { title, description, externalLink, courseId } = await req.json()
    const project = await db.portfolioProject.create({
      data: { title, description, externalLink, courseId: courseId || null, userId: session.user.id!, status: "PUBLISHED" },
    })
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    const { projectId } = await req.json()
    await db.portfolioProject.delete({ where: { id: projectId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
