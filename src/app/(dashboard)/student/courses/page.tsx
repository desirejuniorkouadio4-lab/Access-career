"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Play, CheckCircle, Clock, Search, Loader2, ArrowRight } from "lucide-react"

type EnrolledCourse = {
  enrollmentId: string; progress: number; totalLessons: number; completedLessons: number
  completedAt: string | null; enrolledAt: string
  course: { id: string; title: string; slug: string; category: string; level: string; instructor: { name: string | null } }
}

const gradients: Record<string, string> = {
  INFORMATIQUE: "from-violet-600 to-violet-900", IA_DATA: "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900", COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800", MARKETING: "from-cyan-600 to-blue-800",
  DESIGN: "from-purple-600 to-pink-800", LANGUES: "from-orange-500 to-red-700",
}

const categoryLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication", EMPLOYABILITE: "Employabilité", MARKETING: "Marketing",
  DESIGN: "Design", LANGUES: "Langues",
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all"|"inprogress"|"completed">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/student/courses")
      .then(r => r.json())
      .then(data => { setEnrollments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = enrollments.filter(e => {
    const matchSearch = e.course.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || (filter === "completed" && e.completedAt) || (filter === "inprogress" && !e.completedAt)
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Mes formations</h1>
          <p className="text-zinc-500 text-sm mt-1">{enrollments.length} formation{enrollments.length > 1 ? "s" : ""} inscrite{enrollments.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/catalogue" className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          Catalogue <ArrowRight size={14} />
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-zinc-300 rounded-xl px-4 py-2.5 bg-white">
          <Search size={16} className="text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        {(["all", "inprogress", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === f ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {f === "all" ? "Toutes" : f === "inprogress" ? "En cours" : "Terminées"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <BookOpen size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">{enrollments.length === 0 ? "Aucune formation inscrite." : "Aucun résultat pour ce filtre."}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((e) => (
            <Link key={e.enrollmentId} href={`/learn/${e.course.slug}`}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-300 transition-all group">
              <div className={`h-24 bg-gradient-to-br ${gradients[e.course.category] || "from-zinc-700 to-zinc-900"} flex items-end p-4 relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="relative font-serif italic text-white text-sm">{categoryLabels[e.course.category]}</span>
                {e.completedAt && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} /> Terminé
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-ink mb-1 group-hover:text-violet-700 transition">{e.course.title}</h3>
                <p className="text-xs text-zinc-400 mb-3">Par {e.course.instructor.name}</p>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>{e.completedLessons}/{e.totalLessons} leçons</span>
                  <span className="font-semibold text-violet-700">{e.progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${e.completedAt ? "bg-emerald-500" : "bg-violet-600"}`} style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
