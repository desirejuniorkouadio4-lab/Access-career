"use client"

import { useEffect, useState } from "react"
import { Users, Loader2, Search } from "lucide-react"

type Enrollment = { id: string; progress: number; enrolledAt: string; completedAt: string | null; user: { name: string | null; email: string | null }; course: { title: string } }

export default function InstructorStudentsPage() {
  const [data, setData] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => { fetch("/api/instructor/students").then(r => r.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false) }) }, [])

  const filtered = data.filter(e => e.user.name?.toLowerCase().includes(search.toLowerCase()) || e.course.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Mes apprenants</h1>
      <p className="text-zinc-500 text-sm">{data.length} inscription{data.length > 1 ? "s" : ""} au total.</p>

      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-4 py-2.5">
        <Search size={16} className="text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un apprenant ou un cours..." className="flex-1 text-sm outline-none bg-transparent" />
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Apprenant</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden md:table-cell">Formation</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Progression</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden sm:table-cell">Inscrit le</th>
            </tr></thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 text-xs font-bold">{e.user.name?.charAt(0) || "?"}</div><div><p className="text-sm font-semibold text-ink">{e.user.name}</p><p className="text-xs text-zinc-400">{e.user.email}</p></div></div></td>
                  <td className="px-5 py-3 hidden md:table-cell"><span className="text-sm text-zinc-600">{e.course.title}</span></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${e.completedAt ? "bg-emerald-500" : "bg-violet-600"}`} style={{ width: `${e.progress}%` }} /></div><span className="text-xs font-semibold text-ink">{Math.round(e.progress)}%</span></div></td>
                  <td className="px-5 py-3 hidden sm:table-cell"><span className="text-xs text-zinc-400">{new Date(e.enrolledAt).toLocaleDateString("fr-FR")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
