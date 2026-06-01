"use client"

import { useEffect, useState } from "react"
import { Users, Search, RefreshCw, CheckCircle, Loader2, Shield, GraduationCap, BookOpen, Wrench } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: string
}

const roles = ["STUDENT", "INSTRUCTOR", "MODERATOR", "ADMIN"]

const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ADMIN:      { label: "Admin",      color: "bg-violet-100 text-violet-700", icon: Shield },
  INSTRUCTOR: { label: "Formateur",  color: "bg-blue-100 text-blue-700",    icon: GraduationCap },
  STUDENT:    { label: "Étudiant",   color: "bg-emerald-100 text-emerald-700", icon: BookOpen },
  MODERATOR:  { label: "Modérateur", color: "bg-amber-100 text-amber-700",  icon: Wrench },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState("ALL")

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/users")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const updateRole = async (userId: string, newRole: string) => {
    setUpdating(userId)
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    })
    await fetchUsers()
    setUpdating(null)
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === "ALL" || u.role === filterRole
    return matchSearch && matchRole
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Gestion des utilisateurs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {users.length} utilisateurs inscrits sur la plateforme.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition"
        >
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-zinc-300 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...roles].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                filterRole === r
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {r === "ALL" ? "Tous" : roleConfig[r]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Rôle actuel</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Inscrit le</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Changer rôle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const rc = roleConfig[user.role]
                  const RoleIcon = rc?.icon || Users
                  return (
                    <tr key={user.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-semibold text-ink">{user.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-zinc-500">{user.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${rc?.color}`}>
                          <RoleIcon size={11} /> {rc?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-zinc-400">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {updating === user.id ? (
                          <Loader2 size={16} className="animate-spin text-violet-600" />
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user.id, e.target.value)}
                            className="text-xs border border-zinc-300 rounded-lg px-2 py-1.5 outline-none focus:border-violet-600 bg-white font-semibold"
                          >
                            {roles.map((r) => (
                              <option key={r} value={r}>{roleConfig[r].label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-sm">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
