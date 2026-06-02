"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FolderOpen, ArrowRight, Loader2, BookOpen } from "lucide-react"

type Course = { id: string; title: string; status: string; category: string; _count: { enrollments: number } }

const categoryConfig: Record<string, { label: string; color: string }> = {
  INFORMATIQUE: { label: "Informatique générale", color: "bg-violet-100 text-violet-700" },
  IA_DATA: { label: "IA & Data", color: "bg-blue-100 text-blue-700" },
  DEVELOPPEMENT: { label: "Développement", color: "bg-emerald-100 text-emerald-700" },
  COMMUNICATION: { label: "Communication", color: "bg-pink-100 text-pink-700" },
  EMPLOYABILITE: { label: "Employabilité", color: "bg-amber-100 text-amber-700" },
  MARKETING: { label: "Marketing", color: "bg-cyan-100 text-cyan-700" },
  DESIGN: { label: "Design", color: "bg-purple-100 text-purple-700" },
  LANGUES: { label: "Langues", color: "bg-orange-100 text-orange-700" },
}

export default function AdminCategoriesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [openCat, setOpenCat] = useState<string | null>(null)

  useEffect(() => { fetch("/api/admin/courses/list").then(r => r.json()).then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false) }) }, [])

  const grouped: Record<string, Course[]> = {}
  courses.forEach(c => { grouped[c.category] = grouped[c.category] || []; grouped[c.category].push(c) })

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Catégories</h1>
      <p className="text-zinc-500 text-sm">{Object.keys(grouped).length} catégories · {courses.length} formations au total</p>

      <div className="space-y-3">
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const catCourses = grouped[key] || []
          const isOpen = openCat === key
          return (
            <div key={key} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-200 transition">
              <button onClick={() => setOpenCat(isOpen ? null : key)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}><FolderOpen size={18} /></div>
                <div className="flex-1"><h3 className="text-sm font-bold text-ink">{cfg.label}</h3><p className="text-xs text-zinc-400">{catCourses.length} formation{catCourses.length > 1 ? "s" : ""} · {catCourses.reduce((s, c) => s + c._count.enrollments, 0)} inscrits</p></div>
                <ArrowRight size={16} className={`text-zinc-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && catCourses.length > 0 && (
                <div className="border-t border-zinc-100">
                  {catCourses.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                      <BookOpen size={14} className="text-zinc-400" />
                      <span className="text-sm text-ink flex-1">{c.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{c.status}</span>
                      <span className="text-xs text-zinc-400">{c._count.enrollments} inscrits</span>
                    </div>
                  ))}
                </div>
              )}

              {isOpen && catCourses.length === 0 && (
                <div className="border-t border-zinc-100 px-5 py-4 text-sm text-zinc-400">Aucune formation dans cette catégorie.</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
