"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Edit, Eye, Loader2, PlusCircle, Users, Star, Search } from "lucide-react"

type Course = { id: string; title: string; category: string; price: number; isFree: boolean; status: string; thumbnail: string | null; _count: { enrollments: number; reviews: number } }

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700", PENDING: "bg-amber-100 text-amber-700",
  DRAFT: "bg-zinc-100 text-zinc-600", REJECTED: "bg-red-100 text-red-700", ARCHIVED: "bg-zinc-200 text-zinc-500",
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  useEffect(() => { fetch("/api/instructor/courses").then(r => r.json()).then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false) }) }, [])

  const filtered = filter === "ALL" ? courses : courses.filter(c => c.status === filter)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-ink">Mes formations</h1>
        <Link href="/instructor/courses/new" className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          <PlusCircle size={16} /> Créer un cours
        </Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PUBLISHED", "DRAFT", "PENDING"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600"}`}>
            {s === "ALL" ? "Toutes" : s === "PUBLISHED" ? "Publiées" : s === "DRAFT" ? "Brouillons" : "En attente"}
          </button>
        ))}
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center gap-4 hover:border-violet-300 transition">
              <div className="w-16 h-16 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen size={22} className="text-violet-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink truncate">{c.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {c._count.enrollments}</span>
                  <span>{c.isFree ? "Gratuit" : `${c.price.toLocaleString("fr-FR")} F`}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/instructor/courses/${c.id}/edit`} className="p-2 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition"><Edit size={16} /></Link>
                <Link href={`/instructor/courses/${c.id}/quiz`} className="p-2 text-zinc-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition" title="Quiz"><Eye size={16} /></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
