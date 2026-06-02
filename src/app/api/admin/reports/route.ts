import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const reports = await db.report.findMany({
      include: {
        reporter: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reports)
  } catch (e) {
    console.error("[ADMIN_REPORTS]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
    }

    const { reportId, status } = await req.json()

    const report = await db.report.update({
      where: { id: reportId },
      data: {
        status,
        handledById: session?.user?.id ?? null,
        resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? new Date() : null,
      },
    })

    return NextResponse.json(report)
  } catch (e) {
    console.error("[ADMIN_REPORTS_PATCH]", e)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
