"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Loader2, CheckCircle, Clock, Send, Trash2 } from "lucide-react"

type Assignment = {
  id: string; title: string; instructions: string | null; maxScore: number; dueDate: string | null
  submissions: { id: string; status: string; score: number | null; user: { name: string | null } }[]
}

export default function CourseAssignmentsPage() {
  const { courseId } = useParams()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading]   = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ title: "", instructions: "", maxScore: "100", dueDate: "" })

  const fetchData = async () => {
    const r = await fetch(`/api/assignments?courseId=${courseId}`)
    const d = await r.json()
    setAssignments(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [courseId])

  const handleCreate = async () => {
    setSaving(true)
    await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, courseId, maxScore: parseInt(form.maxScore) || 100, dueDate: form.dueDate || null }),
    })
    setForm({ title: "", instructions: "", maxScore: "100", dueDate: "" })
    setCreating(false); setSaving(false); await fetchData()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-extrabold text-ink">Devoirs du cours</h1>
        </div>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          <Plus size={15} /> Créer un devoir
        </button>
      </div>

      {/* Formulaire création */}
      {creating && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <h3 className="font-bold text-ink">Nouveau devoir</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Titre du devoir" className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
          <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} rows={3}
            placeholder="Consignes et instructions..."
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Note maximale</label>
              <input type="number" value={form.maxScore} onChange={e => setForm({ ...form, maxScore: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Date limite</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving || !form.title}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Créer
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2.5 text-sm text-zinc-600 border border-zinc-300 rounded-xl">Annuler</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : assignments.length === 0 && !creating ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <FileText size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun devoir créé pour ce cours.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => {
            const pending = a.submissions.filter(s => s.status === "PENDING").length
            const graded  = a.submissions.filter(s => s.status === "GRADED").length
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-ink">{a.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                      <span>Note max : {a.maxScore}</span>
                      {a.dueDate && <span>Limite : {new Date(a.dueDate).toLocaleDateString("fr-FR")}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {pending > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Clock size={10} /> {pending} à corriger
                      </span>
                    )}
                    {graded > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={10} /> {graded} corrigé{graded > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {a.instructions && (
                  <p className="text-xs text-zinc-600 bg-zinc-50 rounded-lg px-3 py-2 mb-3">{a.instructions}</p>
                )}

                {a.submissions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-zinc-400 uppercase">{a.submissions.length} soumission{a.submissions.length > 1 ? "s" : ""}</p>
                    {a.submissions.map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-2.5">
                        <span className="text-sm font-semibold text-ink">{s.user.name}</span>
                        <div className="flex items-center gap-2">
                          {s.status === "GRADED"
                            ? <span className="text-xs font-bold text-emerald-700">{s.score}/{a.maxScore}</span>
                            : <span className="text-xs font-bold text-amber-600">En attente</span>
                          }
                          <Link href="/instructor/corrections"
                            className="text-xs text-violet-700 font-semibold hover:underline">
                            {s.status === "PENDING" ? "Corriger" : "Voir"}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Aucune soumission.</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
