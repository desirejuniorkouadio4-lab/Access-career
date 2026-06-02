"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare, Loader2, Search, X, Pin, ExternalLink } from "lucide-react"

export default function ModeratorForumsPage() {
  const [topics, setTopics]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")

  useEffect(() => {
    fetch("/api/moderator/forums")
      .then(r => r.json())
      .then(d => { setTopics(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = topics.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.course?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Forums — Modération</h1>
        <p className="text-zinc-500 text-sm mt-1">{topics.length} sujet{topics.length > 1 ? "s" : ""} au total</p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-4 py-2.5">
        <Search size={16} className="text-zinc-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un sujet, un auteur, un cours..."
          className="flex-1 text-sm outline-none bg-transparent" />
        {search && <button onClick={() => setSearch("")}><X size={14} className="text-zinc-400" /></button>}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <MessageSquare size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun sujet trouvé.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-start gap-3 hover:border-violet-200 transition">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.pinned ? "bg-violet-100 text-violet-600" : "bg-zinc-100 text-zinc-500"}`}>
                {t.pinned ? <Pin size={15} /> : <MessageSquare size={15} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{t.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Par <span className="font-semibold">{t.user?.name}</span> ·
                  {" "}{t.course?.title} · {t._count?.replies || 0} réponses
                </p>
                <p className="text-xs text-zinc-400">
                  {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "OPEN" ? "bg-emerald-100 text-emerald-700" : t.status === "PINNED" ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-500"}`}>
                  {t.status}
                </span>
                <Link href={`/forum/${t.courseId}/${t.id}`} target="_blank"
                  className="p-1.5 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition">
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
