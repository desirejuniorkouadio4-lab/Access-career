import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ valid: false })
    }

    const certificate = await db.certificate.findUnique({
      where: { certCode: code },
      include: {
        user:   { select: { name: true } },
        course: {
          include: {
            instructor: { select: { name: true } },
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({
      valid:          true,
      studentName:    certificate.user.name,
      courseTitle:    certificate.course.title,
      category:       certificate.course.category,
      instructorName: certificate.course.instructor.name,
      issuedAt:       certificate.issuedAt,
    })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
