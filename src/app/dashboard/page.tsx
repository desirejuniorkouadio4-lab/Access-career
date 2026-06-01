import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any)?.role

  if (role === "ADMIN")      redirect("/admin")
  if (role === "INSTRUCTOR") redirect("/instructor")
  if (role === "MODERATOR")  redirect("/moderator")
  redirect("/student")
}
