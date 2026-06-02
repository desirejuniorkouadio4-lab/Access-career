"use client"

import { useEffect, useState } from "react"
import {
  Shield, GraduationCap, BookOpen, UserCheck,
  CheckCircle, XCircle, Loader2, ExternalLink,
  Clock, Eye, X, Check
} from "lucide-react"

type Application = {
  id: string; expertise: string; experience: string; courseIdea: string
  linkedin: string | null; status: string; adminNote: string | null
  createdAt: string
  user: { name: string | null; email: string | null; role: string }
}

const roles = [
  { key: "ADMIN",      label: "Administrateur", icon: Shield,       color: "bg-violet-100 text-violet-700", desc: "Accès complet à toutes les fonctionnalités. Gestion des utilisateurs, formations, paiements, statistiques et paramètres." },
  { key: "INSTRUCTOR", label: "Formateur",       icon: GraduationCap, color: "bg-blue-100 text-blue-700",    desc: "Création et gestion de cours, suivi des apprenants, correction des devoirs, consultation des statistiques de ses formations." },
  { key: "MODERATOR",  label: "Modérateur",      icon: UserCheck,    color: "bg-amber-100 text-amber-700",  desc: "Modération des forums, gestion des signalements, surveillance des discussions, assistance communautaire." },
  { key: "STUDENT",    label: "Étudiant",         icon: BookOpen,     color: "bg-emerald-100 text-emerald-700", desc: "Accès aux formations, quiz, devoirs, certificats et forum. Ne peut pas créer de cours ni gérer la plateforme." },
]

export default function AdminRolesPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("PENDING")
  const [selected, setSelected] = useState<Application | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [processing, setProcessing] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    const r = await fetch("/api/instructor-applications")
    const d = await r.json()
    setApplications(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { fetchApplications() }, [])

  const handleAction = async () => {
    if (!selected || !actionType) return
    setProcessing(true)
    await fetch("/api/instructor-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: selected.id, action: actionType, adminNote }),
    })
    setSelected(null); setActionType(null); setAdminNote("")
    setProcessing(false); await fetchApplications()
  }

  const filtered = applications.filter(a => a.status === filter)
  const pendingCount = applications.filter(a => a.status === "PENDING").length

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING:  { label: "En attente", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Approuvée",  color: "bg-emerald-100 text-emerald-700" },
    REJECTED: { label: "Refusée",    color: "bg-red-100 text-red-700" },
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-ink">Gestion des rôles</h1>

      {/* ── Vue d'ensemble des rôles ── */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Rôles de la plateforme</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div key={r.key} className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.color}`}>
                  <r.icon size={18} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.color}`}>{r.label}</span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Candidatures formateurs ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <GraduationCap size={20} className="text-violet-600" />
            Candidatures formateurs
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                {pendingCount} en attente
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            {["PENDING", "APPROVED", "REJECTED"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${filter === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
                {statusConfig[s].label} ({applications.filter(a => a.status === s).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-violet-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
            <Clock size={28} className="text-zinc-400 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">
              {filter === "PENDING" ? "Aucune candidature en attente." : `Aucune candidature ${statusConfig[filter].label.toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                      {a.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">{a.user.name}</p>
                      <p className="text-xs text-zinc-400">{a.user.email}</p>
                      <p className="text-xs font-semibold text-violet-700 mt-1">{a.expertise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusConfig[a.status].color}`}>
                      {statusConfig[a.status].label}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-3">
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Expérience</p>
                    <p className="text-xs text-zinc-700 line-clamp-3">{a.experience}</p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Idée de cours</p>
                    <p className="text-xs text-zinc-700 line-clamp-3">{a.courseIdea}</p>
                  </div>
                </div>

                {a.linkedin && (
                  <a href={a.linkedin} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-violet-700 hover:underline">
                    <ExternalLink size={11} /> LinkedIn
                  </a>
                )}

                {a.adminNote && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                    <p className="text-xs font-semibold text-blue-700">Note admin : {a.adminNote}</p>
                  </div>
                )}

                {a.status === "PENDING" && (
                  selected?.id === a.id ? (
                    <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
                      <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={2}
                        placeholder={actionType === "reject" ? "Motif du refus (obligatoire)..." : "Message pour le candidat (optionnel)..."}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none resize-none focus:border-violet-600" />
                      <div className="flex gap-2">
                        {actionType === "approve" ? (
                          <button onClick={handleAction} disabled={processing}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60">
                            {processing ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                            Confirmer l&apos;approbation
                          </button>
                        ) : (
                          <button onClick={handleAction} disabled={processing || !adminNote.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-60">
                            {processing ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                            Confirmer le refus
                          </button>
                        )}
                        <button onClick={() => { setSelected(null); setActionType(null); setAdminNote("") }}
                          className="px-4 py-2 text-xs text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50">
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-100">
                      <button onClick={() => { setSelected(a); setActionType("approve"); setAdminNote("") }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
                        <CheckCircle size={12} /> Approuver
                      </button>
                      <button onClick={() => { setSelected(a); setActionType("reject"); setAdminNote("") }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition">
                        <XCircle size={12} /> Refuser
                      </button>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
