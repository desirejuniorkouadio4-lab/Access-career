import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function StudentDashboard() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-zinc-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">🎓</span>
        </div>
        <h1 className="text-2xl font-extrabold text-ink mb-2">
          Bonjour, {session.user?.name?.split(" ")[0]} !
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          Bienvenue sur votre espace apprenant Access Career.
        </p>
        <div className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {session.user?.role ?? "Étudiant"}
        </div>
        <p className="text-xs text-zinc-400 mt-8">
          Dashboard complet en cours de construction 🚀
        </p>
      </div>
    </div>
  )
}
