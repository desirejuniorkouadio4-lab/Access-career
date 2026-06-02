"use client"

import { useEffect, useState } from "react"
import { Shield, Loader2, CheckCircle, XCircle, RefreshCw, AlertTriangle, Clock } from "lucide-react"

type Report = {
  id: string; targetType: string; targetId: string; reason: string
  status: string; createdAt: string; resolvedAt: string | null
  reporter: { name: string | null; email: string | null }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:   { label: "En attente",  color: "bg-amber-100 text-amber-700",  icon: Clock },
  REVIEWED:  { label: "En cours",    color: "bg-blue-100 text-blue-700",    icon: AlertTriangle },
  RESOLVED:  { label: "Résolu",      color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  DISMISSED: { label: "Classé",      color: "bg-zinc-100 text-zinc-500",    icon: XCircle },
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("PENDING")
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchReports = async () => {
    setLoading(true)
    const r = await fetch("/api/admin/reports")
    const d = await r.json()
    setReports(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { fetchReports() }, [])

  const updateStatus = async (reportId: string, status: string) => {
    setProcessing(reportId)
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status }),
    })
    await fetchReports()
    setProcessing(null)
  }

  const filtered = filter === "ALL" ? reports : reports.filter(r => r.status === filter)
  const pendingCount = reports.filter(r => r.status === "PENDING").length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Signalements</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {reports.length} signalement{reports.length > 1 ? "s" : ""}
            {pendingCount > 0 && <span className="text-amber-600 font-semibold"> · {pendingCount} en attente</span>}
          </p>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "REVIEWED", "RESOLVED", "DISMISSED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {s === "ALL" ? "Tous" : statusConfig[s]?.label}
            {" "}({s === "ALL" ? reports.length : reports.filter(r => r.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <Shield size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">
            {filter === "PENDING" ? "Aucun signalement en attente. La plateforme est saine ✅" : "Aucun signalement dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const sc = statusConfig[r.status] || statusConfig.PENDING
            const StatusIcon = sc.icon
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Signalement sur <span className="text-violet-700">{r.targetType}</span>
                      </p>
                      <p className="text-xs text-zinc-400">
                        Par {r.reporter.name} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${sc.color}`}>
                    <StatusIcon size={11} /> {sc.label}
                  </span>
                </div>

                <div className="bg-zinc-50 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Motif du signalement</p>
                  <p className="text-sm text-zinc-700">{r.reason}</p>
                </div>

                {r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(r.id, "RESOLVED")}
                      disabled={processing === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                      {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                      Marquer résolu
                    </button>
                    <button onClick={() => updateStatus(r.id, "REVIEWED")}
                      disabled={processing === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-50">
                      En cours d&apos;examen
                    </button>
                    <button onClick={() => updateStatus(r.id, "DISMISSED")}
                      disabled={processing === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
                      <XCircle size={12} /> Classer sans suite
                    </button>
                  </div>
                )}

                {r.status !== "PENDING" && r.resolvedAt && (
                  <p className="text-xs text-zinc-400">
                    Traité le {new Date(r.resolvedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
