"use client"

import { useEffect, useState } from "react"
import { BookOpen, CheckCircle, XCircle, Eye, Loader2, Clock, Archive } from "lucide-react"

type Course = { id: string; title: string; category: string; status: string; createdAt: string; instructor: { name: string | null }; _count: { enrollments: number; chapters: number } }

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
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchCourses = async () => {
    const r = await fetch("/api/admin/courses/list"); setCourses(await r.json()); setLoading(false)
  }
  useEffect(() => { fetchCourses() }, [])

  const updateStatus = async (courseId: string, status: string, reason?: string) => {
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status, ...(reason ? { rejectReason: reason } : {}) }),
    })
    setRejectId(null); setRejectReason(""); await fetchCourses()
  }

  const filtered = filter === "ALL" ? courses : courses.filter(c => c.status === filter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Gestion des formations</h1>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "PUBLISHED", "DRAFT", "REJECTED", "ARCHIVED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600"}`}>
            {s === "ALL" ? `Toutes (${courses.length})` : `${statusConfig[s]?.label} (${courses.filter(c => c.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">Par {c.instructor.name} · {c._count.chapters} chapitres · {c._count.enrollments} inscrits</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusConfig[c.status]?.color}`}>{statusConfig[c.status]?.label}</span>
              </div>

              {rejectId === c.id && (
                <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2">
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={2} placeholder="Raison du refus..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(c.id, "REJECTED", rejectReason)} className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg">Confirmer le refus</button>
                    <button onClick={() => setRejectId(null)} className="px-4 py-2 text-xs text-zinc-600 border border-zinc-300 rounded-lg">Annuler</button>
                  </div>
                </div>
              )}

              {rejectId !== c.id && (
                <div className="flex gap-2 mt-3">
                  {c.status === "PENDING" && <button onClick={() => updateStatus(c.id, "PUBLISHED")} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"><CheckCircle size={12} /> Approuver</button>}
                  {c.status === "PENDING" && <button onClick={() => setRejectId(c.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-1"><XCircle size={12} /> Refuser</button>}
                  {c.status === "PUBLISHED" && <button onClick={() => updateStatus(c.id, "ARCHIVED")} className="px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg flex items-center gap-1"><Archive size={12} /> Archiver</button>}
                  {c.status === "REJECTED" && <button onClick={() => updateStatus(c.id, "PUBLISHED")} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1"><CheckCircle size={12} /> Publier</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
