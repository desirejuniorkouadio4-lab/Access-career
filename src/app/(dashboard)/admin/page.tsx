"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users, BookOpen, Clock, TrendingUp, Award,
  ArrowRight, CheckCircle, XCircle, Eye, Loader2,
  GraduationCap, UserCheck, BarChart3, Shield
} from "lucide-react"

type Stats = {
  totalUsers: number; totalStudents: number; totalInstructors: number
  totalCourses: number; publishedCourses: number; pendingCourses: number; draftCourses: number
  totalEnrollments: number; totalCertificates: number
}

type RecentUser = { id: string; name: string | null; email: string | null; role: string; createdAt: string }
type PendingCourse = { id: string; title: string; category: string; createdAt: string; instructor: { name: string | null } }

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  INSTRUCTOR: "bg-blue-100 text-blue-700",
  STUDENT: "bg-emerald-100 text-emerald-700",
  MODERATOR: "bg-amber-100 text-amber-700",
}
const roleLabels: Record<string, string> = {
  ADMIN: "Admin", INSTRUCTOR: "Formateur", STUDENT: "Étudiant", MODERATOR: "Modérateur",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [pending, setPending] = useState<PendingCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => {
        setStats(data.stats)
        setRecentUsers(data.recentUsers || [])
        setPending(data.pendingCoursesList || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleCourseAction = async (courseId: string, status: string) => {
    setApproving(courseId)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status }),
    })
    setPending(prev => prev.filter(c => c.id !== courseId))
    if (stats) {
      setStats({
        ...stats,
        pendingCourses: stats.pendingCourses - 1,
        publishedCourses: status === "PUBLISHED" ? stats.publishedCourses + 1 : stats.publishedCourses,
      })
    }
    setApproving(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )

  const statCards = stats ? [
    { label: "Utilisateurs",     value: stats.totalUsers,        icon: Users,         color: "bg-violet-50 text-violet-700" },
    { label: "Apprenants",       value: stats.totalStudents,      icon: UserCheck,     color: "bg-blue-50 text-blue-700" },
    { label: "Formateurs",       value: stats.totalInstructors,   icon: GraduationCap, color: "bg-emerald-50 text-emerald-700" },
    { label: "Cours publiés",    value: stats.publishedCourses,   icon: BookOpen,      color: "bg-cyan-50 text-cyan-700" },
    { label: "En attente",       value: stats.pendingCourses,     icon: Clock,         color: "bg-amber-50 text-amber-700" },
    { label: "Inscriptions",     value: stats.totalEnrollments,   icon: TrendingUp,    color: "bg-pink-50 text-pink-700" },
    { label: "Certificats",      value: stats.totalCertificates,  icon: Award,         color: "bg-orange-50 text-orange-700" },
    { label: "Brouillons",       value: stats.draftCourses,       icon: BarChart3,     color: "bg-zinc-100 text-zinc-600" },
  ] : []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Dashboard Administrateur
        </h1>
        <p className="text-zinc-500 mt-1">Vue d&apos;ensemble de la plateforme Access Career.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-extrabold text-ink">{s.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cours en attente */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Clock size={16} className="text-amber-500" /> Cours à valider ({pending.length})
            </h2>
            <Link href="/admin/courses" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Tout voir <ArrowRight size={12} />
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-400 text-sm">
              Aucun cours en attente de validation.
            </div>
          ) : (
            pending.map((course) => (
              <div key={course.id} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{course.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Par {course.instructor.name} · {new Date(course.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {approving === course.id ? (
                    <Loader2 size={16} className="animate-spin text-violet-600" />
                  ) : (
                    <>
                      <button onClick={() => handleCourseAction(course.id, "PUBLISHED")}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approuver">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleCourseAction(course.id, "DRAFT")}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Rejeter">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Derniers inscrits */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Users size={16} className="text-violet-600" /> Derniers inscrits
            </h2>
            <Link href="/admin/users" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Gérer <ArrowRight size={12} />
            </Link>
          </div>
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-50 last:border-0">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/admin/courses" className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition group">
          <BookOpen size={22} className="text-violet-600 mb-3" />
          <h3 className="font-bold text-ink group-hover:text-violet-700 transition">Gérer les cours</h3>
          <p className="text-xs text-zinc-500 mt-1">Valider, assigner et organiser les formations.</p>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition group">
          <Users size={22} className="text-violet-600 mb-3" />
          <h3 className="font-bold text-ink group-hover:text-violet-700 transition">Gérer les utilisateurs</h3>
          <p className="text-xs text-zinc-500 mt-1">Changer les rôles et gérer les comptes.</p>
        </Link>
        <Link href="/admin/courses" className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition group">
          <Shield size={22} className="text-violet-600 mb-3" />
          <h3 className="font-bold text-ink group-hover:text-violet-700 transition">Catalogue complet</h3>
          <p className="text-xs text-zinc-500 mt-1">{stats?.totalCourses} cours au total sur la plateforme.</p>
        </Link>
      </div>
    </div>
  )
}
