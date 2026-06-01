import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any)?.role

  if (role === "ADMIN") return <>{children}</>
  if (role !== "INSTRUCTOR") redirect("/dashboard")

  return <>{children}</>
}
