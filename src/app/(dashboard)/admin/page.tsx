"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users, BookOpen, Award, TrendingUp, Clock, ArrowRight,
  Loader2, UserCheck, BarChart3, AlertTriangle, CheckCircle,
  GraduationCap, Star, Shield
} from "lucide-react"

type Stats = {
  totalUsers: number; students: number; instructors: number; moderators: number
  totalCourses: number; pendingCourses: number; publishedCourses: number
  totalEnrollments: number; monthEnrollments: number
  totalCertificates: number; monthCertificates: number
  newUsersThisMonth: number
  recentUsers: { id: string; name: string | null; email: string | null; role: string; createdAt: string }[]
  topCourses: { id: string; title: string; instructor: { name: string | null }; _count: { enrollments: number } }[]
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  INSTRUCTOR: "bg-blue-100 text-blue-700",
  STUDENT: "bg-emerald-100 text-emerald-700",
  MODERATOR: "bg-amber-100 text-amber-700",
}

const roleLabels: Record<string, string> = {
  ADMIN: "Admin", INSTRUCTOR: "Formateur", STUDENT: "Étudiant", MODERATOR: "Modérateur"
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )

  if (!stats) return (
    <div className="text-center py-20"><p className="text-zinc-500">Erreur de chargement.</p></div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Dashboard Administrateur
        </h1>
        <p className="text-zinc-500 mt-1">Vue d&apos;ensemble de la plateforme Access Career.</p>
      </div>

      {/* ── Alertes urgentes ── */}
      {stats.pendingCourses > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">
                {stats.pendingCourses} formation{stats.pendingCourses > 1 ? "s" : ""} en attente de validation
              </p>
              <p className="text-xs text-amber-600">Des formateurs attendent votre validation pour publier.</p>
            </div>
          </div>
          <Link href="/admin/courses?filter=PENDING"
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-700 transition">
            Traiter maintenant <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── Cartes statistiques principales ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Utilisateurs totaux", value: stats.totalUsers, sub: `+${stats.newUsersThisMonth} ce mois`, icon: Users, color: "bg-violet-50 text-violet-700", href: "/admin/users" },
          { label: "Étudiants", value: stats.students, sub: "Apprenants actifs", icon: GraduationCap, color: "bg-blue-50 text-blue-700", href: "/admin/users" },
          { label: "Formateurs", value: stats.instructors, sub: "Créateurs de cours", icon: UserCheck, color: "bg-emerald-50 text-emerald-700", href: "/admin/users" },
          { label: "Cours publiés", value: stats.publishedCourses, sub: `${stats.pendingCourses} en attente`, icon: BookOpen, color: "bg-cyan-50 text-cyan-700", href: "/admin/courses" },
          { label: "Inscriptions totales", value: stats.totalEnrollments, sub: `+${stats.monthEnrollments} ce mois`, icon: TrendingUp, color: "bg-amber-50 text-amber-700", href: "/admin/courses" },
          { label: "Certificats délivrés", value: stats.totalCertificates, sub: `+${stats.monthCertificates} ce mois`, icon: Award, color: "bg-pink-50 text-pink-700", href: "/admin/certificates" },
          { label: "Formations totales", value: stats.totalCourses, sub: `${stats.publishedCourses} publiées`, icon: BarChart3, color: "bg-indigo-50 text-indigo-700", href: "/admin/courses" },
          { label: "Modérateurs", value: stats.moderators, sub: "Équipe modération", icon: Shield, color: "bg-orange-50 text-orange-700", href: "/admin/users" },
        ].map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
              <ArrowRight size={14} className="text-zinc-300 group-hover:text-violet-500 transition" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{card.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{card.label}</div>
            <div className="text-[11px] text-violet-600 font-semibold mt-1">{card.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Derniers utilisateurs inscrits ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Users size={16} className="text-violet-600" /> Derniers inscrits
            </h2>
            <Link href="/admin/users" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Gérer <ArrowRight size={12} />
            </Link>
          </div>
          {stats.recentUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-6 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
              <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                {u.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{u.name || "—"}</p>
                <p className="text-xs text-zinc-400 truncate">{u.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>
                  {roleLabels[u.role]}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Formations les plus suivies ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Star size={16} className="text-violet-600" /> Formations populaires
            </h2>
            <Link href="/admin/courses" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Toutes <ArrowRight size={12} />
            </Link>
          </div>
          {stats.topCourses.length === 0 ? (
            <div className="px-6 py-8 text-sm text-zinc-400 text-center">Aucune formation publiée.</div>
          ) : stats.topCourses.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 px-6 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
              <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{c.title}</p>
                <p className="text-xs text-zinc-400">Par {c.instructor.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-ink">{c._count.enrollments}</p>
                <p className="text-[10px] text-zinc-400">inscrits</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accès rapides ── */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Actions rapides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Valider des cours", desc: `${stats.pendingCourses} en attente`, href: "/admin/courses", icon: CheckCircle, urgent: stats.pendingCourses > 0 },
            { label: "Gérer les utilisateurs", desc: `${stats.totalUsers} comptes`, href: "/admin/users", icon: Users, urgent: false },
            { label: "Voir les certificats", desc: `${stats.totalCertificates} délivrés`, href: "/admin/certificates", icon: Award, urgent: false },
            { label: "Analytics", desc: "Statistiques globales", href: "/admin/analytics", icon: BarChart3, urgent: false },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className={`rounded-2xl border p-5 hover:-translate-y-0.5 transition-all ${a.urgent ? "bg-amber-50 border-amber-200 hover:border-amber-400" : "bg-white border-zinc-200 hover:border-violet-300"}`}>
              <a.icon size={20} className={`mb-3 ${a.urgent ? "text-amber-600" : "text-violet-600"}`} />
              <p className="text-sm font-bold text-ink">{a.label}</p>
              <p className={`text-xs mt-0.5 ${a.urgent ? "text-amber-700 font-semibold" : "text-zinc-400"}`}>{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
