"use client"

import { useEffect, useState } from "react"
import { FileText, CheckCircle, Loader2, Send } from "lucide-react"

type Submission = { id: string; textAnswer: string | null; externalLink: string | null; status: string; score: number | null; submittedAt: string; user: { name: string | null } }
type Assignment = { id: string; title: string; maxScore: number; course: { title: string }; submissions: Submission[] }

export default function InstructorCorrectionsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState<{ subId: string; score: string; feedback: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => { const r = await fetch("/api/assignments"); setAssignments(await r.json()); setLoading(false) }
  useEffect(() => { fetchData() }, [])

  const handleGrade = async () => {
    if (!grading) return; setSaving(true)
    await fetch("/api/assignments/submit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: grading.subId, score: parseInt(grading.score) || 0, feedback: grading.feedback, status: "GRADED" }),
    })
    setGrading(null); setSaving(false); await fetchData()
  }

  const pending = assignments.filter(a => a.submissions.some(s => s.status === "PENDING"))

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Corrections</h1>
      <p className="text-zinc-500 text-sm">{pending.reduce((s, a) => s + a.submissions.filter(s => s.status === "PENDING").length, 0)} devoirs en attente de correction.</p>

      {assignments.map((a) => a.submissions.map((sub) => (
        <div key={sub.id} className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-violet-700 font-bold">{a.course.title} · {a.title}</p>
              <p className="text-sm font-bold text-ink mt-1">{sub.user.name}</p>
              <p className="text-xs text-zinc-400">Soumis le {new Date(sub.submittedAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.status === "GRADED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {sub.status === "GRADED" ? `${sub.score}/${a.maxScore}` : "A corriger"}
            </span>
          </div>
          {sub.textAnswer && <div className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-700 mb-3">{sub.textAnswer}</div>}
          {sub.externalLink && <a href={sub.externalLink} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-700 underline mb-3 block">{sub.externalLink}</a>}

          {sub.status === "PENDING" && (
            grading?.subId === sub.id ? (
              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <div className="flex gap-3">
                  <input type="number" value={grading.score} onChange={(e) => setGrading({ ...grading, score: e.target.value })} placeholder={`Note / ${a.maxScore}`}
                    className="w-24 px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none" />
                  <span className="self-center text-sm text-zinc-400">/ {a.maxScore}</span>
                </div>
                <textarea value={grading.feedback} onChange={(e) => setGrading({ ...grading, feedback: e.target.value })} rows={3} placeholder="Commentaire pour l'apprenant..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none resize-none" />
                <div className="flex gap-2">
                  <button onClick={handleGrade} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg transition">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Valider la note
                  </button>
                  <button onClick={() => setGrading(null)} className="px-4 py-2 text-sm text-zinc-600 border border-zinc-300 rounded-lg">Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setGrading({ subId: sub.id, score: "", feedback: "" })}
                className="mt-2 px-4 py-2 bg-violet-100 text-violet-700 text-sm font-semibold rounded-lg hover:bg-violet-200 transition">
                Corriger
              </button>
            )
          )}
        </div>
      )))}
    </div>
  )
}
