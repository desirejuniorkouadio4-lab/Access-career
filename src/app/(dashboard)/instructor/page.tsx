"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  BookOpen, Users, Clock, TrendingUp, PlusCircle,
  Edit, Loader2, FileText, CheckCircle, AlertTriangle,
  ArrowRight, Star, Eye
} from "lucide-react"

type Stats = {
  totalCourses: number; publishedCourses: number; pendingCourses: number; draftCourses: number
  totalStudents: number; pendingAssignments: number
  recentEnrollments: { id: string; enrolledAt: string; user: { name: string | null }; course: { title: string } }[]
  topCourse: { id: string; title: string; _count: { enrollments: number } } | null
}

export default function InstructorDashboard() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Formateur"
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/instructor/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )

  if (!stats) return null

  const cards = [
    { label: "Cours publiés",   value: stats.publishedCourses, icon: CheckCircle, color: "bg-emerald-50 text-emerald-700", href: "/instructor/courses?filter=PUBLISHED" },
    { label: "Apprenants total", value: stats.totalStudents,   icon: Users,       color: "bg-blue-50 text-blue-700",    href: "/instructor/students" },
    { label: "Brouillons",       value: stats.draftCourses,    icon: Edit,         color: "bg-zinc-100 text-zinc-600",   href: "/instructor/courses?filter=DRAFT" },
    { label: "En attente admin", value: stats.pendingCourses,  icon: Clock,        color: "bg-amber-50 text-amber-700",  href: "/instructor/courses?filter=PENDING" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            Bonjour, {firstName} !
          </h1>
          <p className="text-zinc-500 mt-1">Gérez vos cours et accompagnez vos apprenants.</p>
        </div>
        <Link href="/instructor/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          <PlusCircle size={16} /> Créer un cours
        </Link>
      </div>

      {/* Alerte devoirs en attente */}
      {stats.pendingAssignments > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">
                {stats.pendingAssignments} devoir{stats.pendingAssignments > 1 ? "s" : ""} en attente de correction
              </p>
              <p className="text-xs text-amber-600">Des apprenants attendent votre retour.</p>
            </div>
          </div>
          <Link href="/instructor/corrections"
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-700 transition">
            Corriger <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link key={c.label} href={c.href}
            className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon size={18} />
              </div>
              <ArrowRight size={14} className="text-zinc-300 group-hover:text-violet-500 transition" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{c.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meilleur cours */}
        {stats.topCourse && (
          <div className="bg-ink rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-700/30 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Votre formation phare</span>
              </div>
              <h3 className="text-lg font-extrabold mb-2 leading-snug">{stats.topCourse.title}</h3>
              <p className="text-3xl font-extrabold text-violet-400 mb-4">{stats.topCourse._count.enrollments}</p>
              <p className="text-sm text-zinc-400 mb-4">apprenants inscrits</p>
              <Link href={`/instructor/courses/${stats.topCourse.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-600 transition w-fit">
                <Edit size={14} /> Modifier ce cours
              </Link>
            </div>
          </div>
        )}

        {/* Inscriptions récentes */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Users size={16} className="text-violet-600" /> Inscriptions récentes
            </h2>
            <Link href="/instructor/students"
              className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {stats.recentEnrollments.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Users size={24} className="text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Aucune inscription pour le moment.</p>
            </div>
          ) : stats.recentEnrollments.map(e => (
            <div key={e.id} className="flex items-center gap-3 px-6 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
                {e.user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{e.user.name}</p>
                <p className="text-xs text-zinc-400 truncate">{e.course.title}</p>
              </div>
              <span className="text-xs text-zinc-400 flex-shrink-0">
                {new Date(e.enrolledAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Accès rapides */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Actions rapides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Mes cours",       desc: `${stats.totalCourses} cours`,     href: "/instructor/courses",      icon: BookOpen,  color: "text-violet-600" },
            { label: "Mes apprenants",  desc: `${stats.totalStudents} inscrits`,  href: "/instructor/students",     icon: Users,     color: "text-blue-600" },
            { label: "Corrections",     desc: `${stats.pendingAssignments} à faire`, href: "/instructor/corrections", icon: FileText,  color: "text-amber-600" },
            { label: "Créer un quiz",   desc: "Depuis un cours",                   href: "/instructor/courses",      icon: TrendingUp, color: "text-emerald-600" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition group">
              <a.icon size={20} className={`${a.color} mb-3`} />
              <p className="text-sm font-bold text-ink">{a.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
