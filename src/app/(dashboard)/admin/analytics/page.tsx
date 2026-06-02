"use client"

import { useEffect, useState } from "react"
import {
  Users, BookOpen, Award, TrendingUp, Loader2,
  BarChart3, Star, GraduationCap
} from "lucide-react"

type MonthData = { label: string; users: number; enrollments: number; certificates: number }
type TopCourse = { id: string; title: string; instructor: { name: string | null }; _count: { enrollments: number } }
type TopInstructor = { id: string; name: string | null; _count: { courses: number } }
type CatStat = { category: string; _count: { id: number } }

type Analytics = {
  overview: {
    totalUsers: number; totalCourses: number; totalEnrollments: number
    totalCertificates: number; students: number; instructors: number
    publishedCourses: number; pendingCourses: number
    completionRate: number; conversionRate: number
  }
  monthlyData: MonthData[]
  topCourses: TopCourse[]
  topInstructors: TopInstructor[]
  categoryStats: CatStat[]
}

const catLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Dev",
  COMMUNICATION: "Comm.", EMPLOYABILITE: "Emploi", MARKETING: "Marketing",
  DESIGN: "Design", LANGUES: "Langues",
}

const catColors: Record<string, string> = {
  INFORMATIQUE: "bg-violet-500", IA_DATA: "bg-blue-500", DEVELOPPEMENT: "bg-emerald-500",
  COMMUNICATION: "bg-pink-500", EMPLOYABILITE: "bg-amber-500", MARKETING: "bg-cyan-500",
  DESIGN: "bg-purple-500", LANGUES: "bg-orange-500",
}

function BarChart({ data, keys, colors, height = 160 }: {
  data: any[]; keys: string[]; colors: string[]; height?: number
}) {
  const maxVal = Math.max(...data.flatMap(d => keys.map(k => d[k] || 0)), 1)
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end gap-0.5" style={{ height: height - 24 }}>
            {keys.map((k, ki) => (
              <div key={k} className={`flex-1 rounded-t-sm transition-all ${colors[ki]}`}
                style={{ height: `${((d[k] || 0) / maxVal) * 100}%`, minHeight: d[k] > 0 ? 2 : 0 }} />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function GaugeBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-zinc-600">{label}</span>
        <span className="font-extrabold text-ink">{value}%</span>
      </div>
      <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )

  if (!data) return (
    <div className="text-center py-20 text-zinc-500">Erreur de chargement.</div>
  )

  const { overview, monthlyData, topCourses, topInstructors, categoryStats } = data

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-ink">Analytics</h1>

      {/* ── KPIs principaux ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Utilisateurs",   value: overview.totalUsers,       icon: Users,      color: "bg-violet-50 text-violet-700" },
          { label: "Cours publiés",   value: overview.publishedCourses, icon: BookOpen,   color: "bg-blue-50 text-blue-700" },
          { label: "Inscriptions",    value: overview.totalEnrollments, icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
          { label: "Certificats",     value: overview.totalCertificates,icon: Award,      color: "bg-amber-50 text-amber-700" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon size={18} />
            </div>
            <div className="text-2xl font-extrabold text-ink">{k.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Graphique mensuel ── */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h2 className="font-bold text-ink mb-1">Évolution sur 6 mois</h2>
        <p className="text-xs text-zinc-400 mb-6">Nouveaux utilisateurs · Inscriptions · Certificats</p>
        <BarChart
          data={monthlyData}
          keys={["users", "enrollments", "certificates"]}
          colors={["bg-violet-500", "bg-blue-400", "bg-emerald-400"]}
          height={180}
        />
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-100">
          {[
            { label: "Utilisateurs",  color: "bg-violet-500" },
            { label: "Inscriptions",  color: "bg-blue-400" },
            { label: "Certificats",   color: "bg-emerald-400" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${l.color}`} />
              <span className="text-xs text-zinc-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Taux clés ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-bold text-ink mb-5">Taux de performance</h2>
          <div className="space-y-5">
            <GaugeBar
              value={overview.conversionRate}
              color="bg-violet-500"
              label="Taux de conversion (inscrits → cours)"
            />
            <GaugeBar
              value={overview.completionRate}
              color="bg-emerald-500"
              label="Taux de certification"
            />
            <GaugeBar
              value={overview.totalUsers > 0 ? Math.round((overview.students / overview.totalUsers) * 100) : 0}
              color="bg-blue-500"
              label="Part des étudiants"
            />
          </div>
          <div className="mt-6 pt-5 border-t border-zinc-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-violet-700">{overview.students}</div>
              <div className="text-xs text-zinc-500">Étudiants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-700">{overview.instructors}</div>
              <div className="text-xs text-zinc-500">Formateurs</div>
            </div>
          </div>
        </div>

        {/* ── Formations par catégorie ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-bold text-ink mb-5">Répartition par catégorie</h2>
          {categoryStats.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">Aucune donnée.</p>
          ) : (
            <div className="space-y-3">
              {categoryStats.map(c => {
                const pct = Math.round((c._count.id / overview.publishedCourses) * 100) || 0
                return (
                  <div key={c.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-zinc-600">{catLabels[c.category] || c.category}</span>
                      <span className="font-bold text-ink">{c._count.id} cours ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${catColors[c.category] || "bg-zinc-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Top formations ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Star size={16} className="text-violet-600" /> Top formations
            </h2>
          </div>
          {topCourses.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">Aucune donnée.</p>
          ) : topCourses.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 px-6 py-3.5 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
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

        {/* ── Top formateurs ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <GraduationCap size={16} className="text-violet-600" /> Formateurs actifs
            </h2>
          </div>
          {topInstructors.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">Aucun formateur.</p>
          ) : topInstructors.map((inst, i) => (
            <div key={inst.id} className="flex items-center gap-3 px-6 py-3.5 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
              <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                {inst.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{inst.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-ink">{inst._count.courses}</p>
                <p className="text-[10px] text-zinc-400">cours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
