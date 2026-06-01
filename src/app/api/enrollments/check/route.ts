import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ enrolled: false })

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    if (!courseId) return NextResponse.json({ enrolled: false })

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id!, courseId },
      },
    })

    return NextResponse.json({ enrolled: !!enrollment })
  } catch {
    return NextResponse.json({ enrolled: false })
  }
}
