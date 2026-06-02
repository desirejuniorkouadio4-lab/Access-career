"use client"

import { useEffect, useState } from "react"
import { FileText, Send, Loader2, CheckCircle, Clock, AlertTriangle } from "lucide-react"

type Assignment = {
  id: string; title: string; instructions: string | null; maxScore: number; dueDate: string | null
  course: { title: string }; lesson: { title: string } | null
  submissions: { id: string; status: string; score: number | null; feedback: string | null; submittedAt: string }[]
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [answer, setAnswer] = useState("")
  const [link, setLink] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/assignments").then(r => r.json()).then(data => { setAssignments(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const handleSubmit = async (assignmentId: string) => {
    setSubmitting(assignmentId)
    await fetch("/api/assignments/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, textAnswer: answer, externalLink: link }),
    })
    setAnswer(""); setLink(""); setActiveId(null); setSubmitting(null)
    const res = await fetch("/api/assignments"); const data = await res.json(); setAssignments(data)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Mes devoirs</h1>
      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <FileText size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun devoir pour le moment.</p>
        </div>
      ) : assignments.map((a) => {
        const sub = a.submissions[0]
        return (
          <div key={a.id} className="bg-white rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs text-violet-700 font-bold mb-1">{a.course.title}</p>
                <h3 className="text-base font-bold text-ink">{a.title}</h3>
                {a.dueDate && <p className="text-xs text-zinc-400 mt-1">Date limite : {new Date(a.dueDate).toLocaleDateString("fr-FR")}</p>}
              </div>
              {sub ? (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.status === "GRADED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {sub.status === "GRADED" ? `${sub.score}/${a.maxScore}` : "En attente"}
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">A rendre</span>
              )}
            </div>
            {a.instructions && <p className="text-sm text-zinc-600 mb-4">{a.instructions}</p>}

            {sub?.feedback && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-emerald-700 mb-1">Correction du formateur</p>
                <p className="text-sm text-emerald-800">{sub.feedback}</p>
              </div>
            )}

            {!sub && (
              activeId === a.id ? (
                <div className="space-y-3 mt-4 pt-4 border-t border-zinc-100">
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Votre réponse..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" />
                  <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien externe (optionnel)"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSubmit(a.id)} disabled={submitting === a.id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
                      {submitting === a.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Soumettre
                    </button>
                    <button onClick={() => setActiveId(null)} className="px-4 py-2.5 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl">Annuler</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveId(a.id)} className="mt-3 flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-200 transition">
                  <FileText size={14} /> Rendre ce devoir
                </button>
              )
            )}
          </div>
        )
      })}
    </div>
  )
}
