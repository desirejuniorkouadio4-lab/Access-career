"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, BookOpen, Award, TrendingUp, Clock, ArrowRight, Loader2, UserCheck, BarChart3 } from "lucide-react"

type Stats = { totalUsers: number; totalCourses: number; totalEnrollments: number; totalCertificates: number; students: number; instructors: number; pendingCourses: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(setStats) }, [])

  if (!stats) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  const cards = [
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "bg-violet-50 text-violet-700", link: "/admin/users" },
    { label: "Étudiants", value: stats.students, icon: UserCheck, color: "bg-blue-50 text-blue-700", link: "/admin/users" },
    { label: "Formateurs", value: stats.instructors, icon: BookOpen, color: "bg-emerald-50 text-emerald-700", link: "/admin/users" },
    { label: "Cours publiés", value: stats.totalCourses, icon: BarChart3, color: "bg-cyan-50 text-cyan-700", link: "/admin/courses" },
    { label: "Inscriptions", value: stats.totalEnrollments, icon: TrendingUp, color: "bg-amber-50 text-amber-700", link: "/admin/courses" },
    { label: "Certificats", value: stats.totalCertificates, icon: Award, color: "bg-pink-50 text-pink-700", link: "/admin/courses" },
    { label: "En attente", value: stats.pendingCourses, icon: Clock, color: "bg-orange-50 text-orange-700", link: "/admin/courses" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink">Dashboard Administrateur</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.link} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon size={18} /></div>
            <div className="text-2xl font-extrabold text-ink">{c.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/courses" className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition">
          <h2 className="font-bold text-ink flex items-center gap-2 mb-2"><BookOpen size={18} className="text-violet-600" /> Formations</h2>
          <p className="text-sm text-zinc-500">Gérer, valider et archiver les formations.</p>
          {stats.pendingCourses > 0 && <p className="text-sm font-bold text-amber-600 mt-2">{stats.pendingCourses} en attente de validation</p>}
        </Link>
        <Link href="/admin/users" className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition">
          <h2 className="font-bold text-ink flex items-center gap-2 mb-2"><Users size={18} className="text-violet-600" /> Utilisateurs</h2>
          <p className="text-sm text-zinc-500">Gérer les comptes et changer les rôles.</p>
        </Link>
      </div>
    </div>
  )
}
