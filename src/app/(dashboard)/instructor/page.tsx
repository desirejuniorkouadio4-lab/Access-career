"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BookOpen, Users, Clock, TrendingUp, PlusCircle, Edit, Loader2, CheckCircle, Star } from "lucide-react"

type Course = { id: string; title: string; category: string; price: number; isFree: boolean; status: string; _count: { enrollments: number; reviews: number } }

const statusColors: Record<string, string> = { PUBLISHED: "bg-emerald-100 text-emerald-700", PENDING: "bg-amber-100 text-amber-700", DRAFT: "bg-zinc-100 text-zinc-600", REJECTED: "bg-red-100 text-red-700" }

export default function InstructorDashboard() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Formateur"
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  useEffect(() => { fetch("/api/instructor/courses").then(r => r.json()).then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false) }) }, [])

  const published = courses.filter(c => c.status === "PUBLISHED")
  const pending = courses.filter(c => c.status === "PENDING")
  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0)
  const filtered = filter === "ALL" ? courses : courses.filter(c => c.status === filter)

  const stats = [
    { label: "Cours publiés", value: published.length, icon: BookOpen, color: "bg-violet-50 text-violet-700", filter: "PUBLISHED" },
    { label: "Apprenants totaux", value: totalStudents, icon: Users, color: "bg-blue-50 text-blue-700", filter: "ALL" },
    { label: "Total cours", value: courses.length, icon: TrendingUp, color: "bg-emerald-50 text-emerald-700", filter: "ALL" },
    { label: "En attente", value: pending.length, icon: Clock, color: "bg-amber-50 text-amber-700", filter: "PENDING" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">Bonjour, {firstName} !</h1><p className="text-zinc-500 mt-1">Gérez vos cours et suivez vos apprenants.</p></div>
        <Link href="/instructor/courses/new" className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"><PlusCircle size={16} /> Créer un cours</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => setFilter(s.filter)} className={`bg-white rounded-2xl border p-5 text-left transition hover:border-violet-300 ${filter === s.filter && s.filter !== "ALL" ? "border-violet-500 ring-2 ring-violet-100" : "border-zinc-200"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
            <div className="text-2xl font-extrabold text-ink">{s.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">{filter === "ALL" ? "Tous mes cours" : `Cours ${filter === "PUBLISHED" ? "publiés" : filter === "PENDING" ? "en attente" : filter.toLowerCase()}`}</h2>
          {filter !== "ALL" && <button onClick={() => setFilter("ALL")} className="text-xs font-semibold text-violet-700 hover:underline">Voir tout</button>}
        </div>
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{c.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${statusColors[c.status] || "bg-zinc-100 text-zinc-500"}`}>{c.status}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {c._count.enrollments}</span>
                    <span>{c.isFree ? "Gratuit" : `${c.price.toLocaleString("fr-FR")} F`}</span>
                  </div>
                </div>
                <Link href={`/instructor/courses/${c.id}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-violet-100 hover:text-violet-700 transition"><Edit size={13} /> Éditer</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
