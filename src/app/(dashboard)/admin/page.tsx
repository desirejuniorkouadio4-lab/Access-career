import { auth } from "@/auth"

export default async function AdminDashboard() {
  const session = await auth()
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-extrabold text-ink mb-2">
        Dashboard Administrateur
      </h1>
      <p className="text-zinc-500">
        Connecté en tant que <strong>{session?.user?.name}</strong> · Rôle ADMIN
      </p>
      <div className="mt-8 bg-white rounded-2xl border border-zinc-200 p-8 text-center">
        <p className="text-zinc-400">Dashboard admin complet en cours de construction 🚀</p>
      </div>
    </div>
  )
}
