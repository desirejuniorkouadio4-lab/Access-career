import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const applications = await db.instructorApplication.findMany({
      include: {
        user: { select: { name: true, email: true, image: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (e) {
    console.error("[APPLICATIONS_GET]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Connexion requise." }, { status: 401 })
    }

    const { expertise, experience, courseIdea, linkedin } = await req.json()

    if (!expertise || !experience || !courseIdea) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    const existing = await db.instructorApplication.findFirst({
      where: { userId: session.user.id!, status: "PENDING" },
    })
    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà une candidature en cours." }, { status: 400 })
    }

    const application = await db.instructorApplication.create({
      data: { userId: session.user.id!, expertise, experience, courseIdea, linkedin: linkedin || null },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (e) {
    console.error("[APPLICATIONS_POST]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { applicationId, action, adminNote } = await req.json()

    const application = await db.instructorApplication.findUnique({
      where: { id: applicationId },
    })
    if (!application) {
      return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 })
    }

    if (action === "approve") {
      await db.$transaction([
        db.instructorApplication.update({
          where: { id: applicationId },
          data: {
            status: "APPROVED",
            adminNote: adminNote || null,
            reviewedAt: new Date(),
            reviewedById: session?.user?.id ?? null,
          },
        }),
        db.user.update({
          where: { id: application.userId },
          data: { role: "INSTRUCTOR" },
        }),
      ])
    } else {
      await db.instructorApplication.update({
        where: { id: applicationId },
        data: {
          status: "REJECTED",
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedById: session?.user?.id ?? null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[APPLICATIONS_PATCH]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
