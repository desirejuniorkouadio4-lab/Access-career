"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen, Edit, Loader2, PlusCircle, Users,
  HelpCircle, FileText, Eye
} from "lucide-react"

type Course = {
  id: string; title: string; slug: string; category: string; status: string
  price: number; isFree: boolean; thumbnail: string | null
  _count: { enrollments: number; reviews: number; chapters: number }
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: "Publié",     color: "bg-emerald-100 text-emerald-700" },
  PENDING:   { label: "En attente", color: "bg-amber-100 text-amber-700" },
  DRAFT:     { label: "Brouillon",  color: "bg-zinc-100 text-zinc-600" },
  REJECTED:  { label: "Refusé",     color: "bg-red-100 text-red-700" },
  ARCHIVED:  { label: "Archivé",    color: "bg-zinc-200 text-zinc-500" },
}

const catLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data",
  DEVELOPPEMENT: "Développement", COMMUNICATION: "Communication",
  EMPLOYABILITE: "Employabilité", MARKETING: "Marketing",
  DESIGN: "Design", LANGUES: "Langues",
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("ALL")

  useEffect(() => {
    setLoading(true)
    fetch("/api/instructor/courses")
      .then(r => r.json())
      .then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === "ALL" ? courses : courses.filter(c => c.status === filter)

  const counts: Record<string, number> = { ALL: courses.length }
  courses.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1 })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Mes formations</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {courses.length} formation{courses.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/instructor/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          <PlusCircle size={16} /> Créer un cours
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PUBLISHED", "DRAFT", "PENDING", "REJECTED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {s === "ALL" ? "Toutes" : statusConfig[s]?.label} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-violet-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <BookOpen size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm mb-4">Aucune formation dans cette catégorie.</p>
          <Link href="/instructor/courses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
            <PlusCircle size={15} /> Créer ma première formation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {c.thumbnail
                    ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <BookOpen size={20} className="text-violet-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[c.status]?.color}`}>
                      {statusConfig[c.status]?.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="font-medium text-violet-700">{catLabels[c.category]}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {c._count.enrollments} inscrits</span>
                    <span>{c._count.chapters} chapitres</span>
                    <span>{c.isFree ? "Gratuit" : `${c.price.toLocaleString("fr-FR")} F`}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/instructor/courses/${c.id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg hover:bg-violet-200 transition">
                      <Edit size={12} /> Éditer
                    </Link>
                    <Link href={`/instructor/courses/${c.id}/quiz`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition">
                      <HelpCircle size={12} /> Quiz
                    </Link>
                    <Link href={`/instructor/courses/${c.id}/assignments`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition">
                      <FileText size={12} /> Devoirs
                    </Link>
                    <Link href={`/instructor/courses/${c.id}/students`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-200 transition">
                      <Users size={12} /> Apprenants
                    </Link>
                    <Link href={`/cours/${c.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:border-zinc-400 transition">
                      <Eye size={12} /> Aperçu public
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
