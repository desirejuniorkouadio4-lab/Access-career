"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, CheckCircle, XCircle, Eye, Loader2, Clock, Archive, RotateCcw, Trash2, Search } from "lucide-react"

type Course = { id: string; title: string; category: string; status: string; rejectReason: string | null; createdAt: string; instructor: { name: string | null }; _count: { enrollments: number; chapters: number } }

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-zinc-100 text-zinc-600" },
  PENDING: { label: "En attente", color: "bg-amber-100 text-amber-700" },
  PUBLISHED: { label: "Publié", color: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Refusé", color: "bg-red-100 text-red-700" },
  ARCHIVED: { label: "Archivé", color: "bg-zinc-200 text-zinc-500" },
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState("")
  const [reason, setReason] = useState("")
  const [processing, setProcessing] = useState(false)

  const fetchCourses = async () => { const r = await fetch("/api/admin/courses/list"); setCourses(await r.json()); setLoading(false) }
  useEffect(() => { fetchCourses() }, [])

  const doAction = async (courseId: string, status: string, rejectReason?: string) => {
    setProcessing(true)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status, ...(rejectReason ? { rejectReason } : {}) }),
    })
    setActionId(null); setActionType(""); setReason(""); setProcessing(false)
    await fetchCourses()
  }

  const filtered = courses.filter(c => {
    const matchFilter = filter === "ALL" || c.status === filter
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts: Record<string, number> = { ALL: courses.length }
  courses.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1 })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Gestion des formations</h1>

      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-4 py-2.5">
        <Search size={16} className="text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une formation ou un formateur..." className="flex-1 text-sm outline-none bg-transparent" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "PUBLISHED", "DRAFT", "REJECTED", "ARCHIVED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {s === "ALL" ? "Toutes" : statusConfig[s]?.label} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
        <div className="space-y-3">
          {filtered.length === 0 && <div className="text-center py-12"><BookOpen size={28} className="text-zinc-400 mx-auto mb-3" /><p className="text-zinc-500 text-sm">Aucune formation trouvée.</p></div>}

          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">Par {c.instructor.name} · {c._count.chapters} chapitres · {c._count.enrollments} inscrits · {new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                  {c.rejectReason && c.status === "REJECTED" && (
                    <p className="text-xs text-red-600 mt-1 bg-red-50 px-3 py-1 rounded-lg inline-block">Motif : {c.rejectReason}</p>
                  )}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${statusConfig[c.status]?.color}`}>{statusConfig[c.status]?.label}</span>
              </div>

              {/* Zone action (formulaire refus) */}
              {actionId === c.id && actionType === "reject" && (
                <div className="mt-3 pt-3 border-t border-zinc-100 space-y-3">
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Expliquez la raison du refus au formateur..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none resize-none focus:border-red-400" />
                  <div className="flex gap-2">
                    <button onClick={() => doAction(c.id, "REJECTED", reason)} disabled={processing || !reason.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50">
                      {processing ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />} Confirmer le refus
                    </button>
                    <button onClick={() => { setActionId(null); setReason("") }} className="px-4 py-2 text-xs text-zinc-600 border border-zinc-300 rounded-lg">Annuler</button>
                  </div>
                </div>
              )}

              {/* Boutons d'actions selon le statut */}
              {actionId !== c.id && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-100">
                  {/* PENDING → Approuver ou Refuser */}
                  {c.status === "PENDING" && <>
                    <button onClick={() => doAction(c.id, "PUBLISHED")} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"><CheckCircle size={12} /> Approuver</button>
                    <button onClick={() => { setActionId(c.id); setActionType("reject") }} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition"><XCircle size={12} /> Refuser</button>
                  </>}

                  {/* PUBLISHED → Archiver ou Dépublier */}
                  {c.status === "PUBLISHED" && <>
                    <button onClick={() => doAction(c.id, "DRAFT")} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition"><Clock size={12} /> Dépublier (brouillon)</button>
                    <button onClick={() => doAction(c.id, "ARCHIVED")} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition"><Archive size={12} /> Archiver</button>
                  </>}

                  {/* DRAFT → Publier directement */}
                  {c.status === "DRAFT" && <>
                    <button onClick={() => doAction(c.id, "PUBLISHED")} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"><CheckCircle size={12} /> Publier</button>
                  </>}

                  {/* REJECTED → Republier */}
                  {c.status === "REJECTED" && <>
                    <button onClick={() => doAction(c.id, "PUBLISHED")} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"><CheckCircle size={12} /> Publier quand même</button>
                    <button onClick={() => doAction(c.id, "DRAFT")} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition"><RotateCcw size={12} /> Repasser en brouillon</button>
                  </>}

                  {/* ARCHIVED → Republier */}
                  {c.status === "ARCHIVED" && <>
                    <button onClick={() => doAction(c.id, "PUBLISHED")} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"><CheckCircle size={12} /> Republier</button>
                    <button onClick={() => doAction(c.id, "DRAFT")} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition"><RotateCcw size={12} /> Repasser en brouillon</button>
                  </>}

                  {/* Voir le cours */}
                  <Link href={`/cours/${c.id}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 text-zinc-600 text-xs font-semibold rounded-lg hover:border-violet-300 transition ml-auto"><Eye size={12} /> Voir</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
