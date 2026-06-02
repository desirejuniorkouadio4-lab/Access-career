"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, BookOpen, Award, TrendingUp, Loader2 } from "lucide-react"

type Stats = { totalUsers: number; totalCourses: number; totalEnrollments: number; totalCertificates: number; students: number; instructors: number; pendingCourses: number }

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(setStats) }, [])

  if (!stats) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  const data = [
    { label: "Utilisateurs totaux", value: stats.totalUsers, icon: Users, color: "text-violet-600" },
    { label: "Étudiants actifs", value: stats.students, icon: Users, color: "text-blue-600" },
    { label: "Formateurs", value: stats.instructors, icon: BookOpen, color: "text-emerald-600" },
    { label: "Cours publiés", value: stats.totalCourses, icon: BarChart3, color: "text-cyan-600" },
    { label: "Inscriptions totales", value: stats.totalEnrollments, icon: TrendingUp, color: "text-amber-600" },
    { label: "Certificats délivrés", value: stats.totalCertificates, icon: Award, color: "text-pink-600" },
    { label: "Cours en attente", value: stats.pendingCourses, icon: BookOpen, color: "text-orange-600" },
  ]

  const conversionRate = stats.totalUsers > 0 ? Math.round((stats.totalEnrollments / stats.totalUsers) * 100) : 0
  const certRate = stats.totalEnrollments > 0 ? Math.round((stats.totalCertificates / stats.totalEnrollments) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-ink">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((d) => (
          <div key={d.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <d.icon size={20} className={`${d.color} mb-3`} />
            <div className="text-2xl font-extrabold text-ink">{d.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{d.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h3 className="font-bold text-ink mb-4">Taux de conversion</h3>
          <div className="text-4xl font-extrabold text-violet-700">{conversionRate}%</div>
          <p className="text-sm text-zinc-500 mt-1">des inscrits suivent au moins un cours</p>
          <div className="h-3 bg-zinc-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h3 className="font-bold text-ink mb-4">Taux de certification</h3>
          <div className="text-4xl font-extrabold text-emerald-600">{certRate}%</div>
          <p className="text-sm text-zinc-500 mt-1">des inscrits obtiennent un certificat</p>
          <div className="h-3 bg-zinc-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${certRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
