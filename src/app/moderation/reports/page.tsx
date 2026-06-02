"use client"
import { useEffect, useState } from "react"
import { Flag, Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ModerationReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchReports = async () => { const r = await fetch("/api/admin/reports"); setReports(await r.json()); setLoading(false) }
  useEffect(() => { fetchReports() }, [])

  const update = async (id: string, status: string) => {
    setProcessing(id)
    await fetch("/api/admin/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId: id, status }) })
    await fetchReports(); setProcessing(null)
  }

  const pending = reports.filter(r => r.status === "PENDING")

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-extrabold text-ink">Signalements</h1>
      <p className="text-zinc-500 text-sm">{pending.length} en attente</p>
      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : pending.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <CheckCircle size={28} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun signalement en attente. La plateforme est saine ✅</p>
        </div>
      ) : pending.map(r => (
        <div key={r.id} className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div><p className="text-sm font-bold text-ink">Signalement sur {r.targetType}</p>
              <p className="text-xs text-zinc-400">Par {r.reporter?.name} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p></div>
          </div>
          <p className="text-sm text-zinc-700 bg-zinc-50 rounded-xl px-4 py-3 mb-4">{r.reason}</p>
          <div className="flex gap-2">
            <button onClick={() => update(r.id, "RESOLVED")} disabled={processing === r.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
              {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} Résolu
            </button>
            <button onClick={() => update(r.id, "DISMISSED")} disabled={processing === r.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
              <XCircle size={12} /> Classer
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
