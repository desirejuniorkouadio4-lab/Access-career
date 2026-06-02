"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, MessageSquare, Flag, Loader2, AlertTriangle, ArrowRight, CheckCircle, Eye } from "lucide-react"

type Stats = {
  pendingReports: number; totalTopics: number; totalReplies: number
  recentReports: { id: string; reason: string; targetType: string; createdAt: string; reporter: { name: string | null } }[]
  recentTopics: { id: string; title: string; createdAt: string; user: { name: string | null }; course: { title: string }; _count: { replies: number } }[]
}

export default function ModeratorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/moderator/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
  if (!stats) return null

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Dashboard Modérateur</h1>
        <p className="text-zinc-500 mt-1">Maintenez un environnement sain sur la plateforme.</p>
      </div>

      {stats.pendingReports > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">{stats.pendingReports} signalement{stats.pendingReports > 1 ? "s" : ""} en attente</p>
              <p className="text-xs text-red-600">Des contenus nécessitent votre attention.</p>
            </div>
          </div>
          <Link href="/moderation/reports"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition">
            Traiter <ArrowRight size={13} />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Signalements en attente", value: stats.pendingReports, icon: Flag,         color: "bg-red-50 text-red-600",     href: "/moderation/reports" },
          { label: "Sujets dans les forums",  value: stats.totalTopics,    icon: MessageSquare, color: "bg-violet-50 text-violet-700", href: "/moderation/forums" },
          { label: "Réponses totales",        value: stats.totalReplies,   icon: Shield,        color: "bg-blue-50 text-blue-700",    href: "/moderation/forums" },
        ].map(c => (
          <Link key={c.label} href={c.href}
            className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <div className="text-2xl font-extrabold text-ink">{c.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2"><Flag size={15} className="text-red-500" /> Signalements récents</h2>
            <Link href="/moderation/reports" className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
          </div>
          {stats.recentReports.length === 0 ? (
            <div className="px-6 py-10 text-center"><CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" /><p className="text-sm text-zinc-400">Aucun signalement en attente. ✅</p></div>
          ) : stats.recentReports.map(r => (
            <div key={r.id} className="flex items-start gap-3 px-6 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><Flag size={13} className="text-red-500" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{r.targetType} signalé</p>
                <p className="text-xs text-zinc-400">Par {r.reporter.name} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{r.reason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2"><MessageSquare size={15} className="text-violet-600" /> Sujets récents</h2>
            <Link href="/moderation/forums" className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
          </div>
          {stats.recentTopics.map(t => (
            <div key={t.id} className="flex items-start gap-3 px-6 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0"><MessageSquare size={13} className="text-violet-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{t.title}</p>
                <p className="text-xs text-zinc-400">{t.user.name} · {t.course.title}</p>
              </div>
              <span className="text-xs text-zinc-400 flex-shrink-0">{t._count.replies} rép.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
