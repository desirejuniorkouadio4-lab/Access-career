"use client"

import { useEffect, useState } from "react"
import { Flag, Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function ModeratorReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState("PENDING")

  const fetchReports = async () => {
    setLoading(true)
    const r = await fetch("/api/admin/reports")
    const d = await r.json()
    setReports(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { fetchReports() }, [])

  const update = async (id: string, status: string) => {
    setProcessing(id)
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId: id, status }),
    })
    await fetchReports()
    setProcessing(null)
  }

  const filtered = filter === "ALL" ? reports : reports.filter(r => r.status === filter)
  const pendingCount = reports.filter(r => r.status === "PENDING").length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Signalements</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {pendingCount > 0
              ? <span className="text-amber-600 font-semibold">{pendingCount} en attente de traitement</span>
              : "Aucun signalement en attente ✅"
            }
          </p>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "REVIEWED", "RESOLVED", "DISMISSED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {s === "ALL" ? "Tous" : s === "PENDING" ? "En attente" : s === "REVIEWED" ? "En cours" : s === "RESOLVED" ? "Résolus" : "Classés"}
            {" "}({reports.filter(r => s === "ALL" || r.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <CheckCircle size={28} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun signalement dans cette catégorie.</p>
        </div>
      ) : filtered.map(r => (
        <div key={r.id} className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-ink">Signalement sur <span className="text-violet-700">{r.targetType}</span></p>
              <p className="text-xs text-zinc-400">Par {r.reporter?.name} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${r.status === "PENDING" ? "bg-amber-100 text-amber-700" : r.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
              {r.status === "PENDING" ? "En attente" : r.status === "RESOLVED" ? "Résolu" : r.status}
            </span>
          </div>
          <div className="bg-zinc-50 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Motif</p>
            <p className="text-sm text-zinc-700">{r.reason}</p>
          </div>
          {r.status === "PENDING" && (
            <div className="flex gap-2">
              <button onClick={() => update(r.id, "RESOLVED")} disabled={processing === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} Résolu
              </button>
              <button onClick={() => update(r.id, "REVIEWED")} disabled={processing === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-50">
                En cours d&apos;examen
              </button>
              <button onClick={() => update(r.id, "DISMISSED")} disabled={processing === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
                <XCircle size={12} /> Classer sans suite
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
