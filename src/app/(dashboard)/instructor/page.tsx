"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  BookOpen, Users, Star, TrendingUp, PlusCircle,
  Eye, Edit, Clock, CheckCircle, XCircle, ArrowRight
} from "lucide-react"

const stats = [
  { label: "Cours publiés", value: "4", icon: BookOpen, color: "bg-violet-50 text-violet-700", trend: "+1 ce mois" },
  { label: "Apprenants totaux", value: "312", icon: Users, color: "bg-blue-50 text-blue-700", trend: "+28 cette semaine" },
  { label: "Note moyenne", value: "4.8", icon: Star, color: "bg-amber-50 text-amber-700", trend: "Excellent" },
  { label: "Cours en attente", value: "1", icon: Clock, color: "bg-orange-50 text-orange-700", trend: "En révision" },
]

const myCourses = [
  { title: "ChatGPT & IA générative au travail", category: "IA & Data", students: 124, rating: 4.9, status: "PUBLISHED", price: "12 000 F" },
  { title: "Excel de A à Z", category: "Informatique", students: 98, rating: 4.8, status: "PUBLISHED", price: "15 000 F" },
  { title: "Prise de parole en public", category: "Communication", students: 90, rating: 4.7, status: "PUBLISHED", price: "18 000 F" },
  { title: "Prompt Engineering avancé", category: "IA & Data", students: 0, rating: 0, status: "PENDING", price: "15 000 F" },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PUBLISHED: { label: "Publié", color: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
  PENDING:   { label: "En attente", color: "bg-amber-50 text-amber-700", icon: Clock },
  DRAFT:     { label: "Brouillon", color: "bg-zinc-100 text-zinc-500", icon: Edit },
  ARCHIVED:  { label: "Archivé", color: "bg-red-50 text-red-700", icon: XCircle },
}

export default function InstructorDashboard() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Formateur"

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            Bonjour, {firstName} !
          </h1>
          <p className="text-zinc-500 mt-1">
            Gérez vos cours et suivez vos apprenants.
          </p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"
        >
          <PlusCircle size={16} /> Créer un cours
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <TrendingUp size={14} className="text-zinc-300" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{stat.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{stat.label}</div>
            <div className="text-[11px] text-violet-600 font-semibold mt-2">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Mes cours */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Mes cours</h2>
          <Link href="/instructor/courses" className="text-sm font-semibold text-violet-700 flex items-center gap-1 hover:underline">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_120px_80px_80px_100px_80px] gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>Cours</span>
            <span>Catégorie</span>
            <span>Apprenants</span>
            <span>Note</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>

          {myCourses.map((course, i) => {
            const s = statusConfig[course.status]
            const StatusIcon = s.icon
            return (
              <div
                key={i}
                className="grid md:grid-cols-[1fr_120px_80px_80px_100px_80px] gap-4 px-6 py-4 border-b border-zinc-100 last:border-0 items-center hover:bg-zinc-50/50 transition"
              >
                <div>
                  <p className="text-sm font-bold text-ink leading-snug">{course.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 md:hidden">{course.category}</p>
                  <p className="text-xs font-semibold text-violet-700 mt-1">{course.price} CFA</p>
                </div>
                <span className="hidden md:block text-xs font-medium text-zinc-500">{course.category}</span>
                <span className="hidden md:flex items-center gap-1 text-sm font-semibold text-ink">
                  <Users size={13} className="text-zinc-400" /> {course.students}
                </span>
                <span className="hidden md:flex items-center gap-1 text-sm font-semibold text-amber-500">
                  {course.rating > 0 ? <><Star size={13} fill="currentColor" /> {course.rating}</> : "—"}
                </span>
                <span className={`hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${s.color}`}>
                  <StatusIcon size={12} /> {s.label}
                </span>
                <div className="flex items-center gap-2 md:col-start-6">
                  <button className="p-1.5 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition">
                    <Eye size={15} />
                  </button>
                  <button className="p-1.5 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition">
                    <Edit size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
