"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle, HelpCircle } from "lucide-react"

type Question = { type: string; question: string; options: string[]; correctAnswers: (string | number)[]; points: number; explanation: string }

export default function CreateQuizPage() {
  const { courseId } = useParams()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lessons, setLessons] = useState<{ id: string; title: string }[]>([])
  const [form, setForm] = useState({ title: "", description: "", lessonId: "", passingScore: 70, maxAttempts: 3, showCorrection: true })
  const [questions, setQuestions] = useState<Question[]>([
    { type: "SINGLE_CHOICE", question: "", options: ["", "", "", ""], correctAnswers: [0], points: 1, explanation: "" },
  ])

  useEffect(() => {
    fetch(`/api/instructor/courses/${courseId}`)
      .then(r => r.json())
      .then(data => {
        const allLessons = (data.chapters || []).flatMap((c: any) => c.lessons.map((l: any) => ({ id: l.id, title: `${c.title} > ${l.title}` })))
        setLessons(allLessons)
      })
  }, [courseId])

  const addQuestion = () => {
    setQuestions([...questions, { type: "SINGLE_CHOICE", question: "", options: ["", "", "", ""], correctAnswers: [0], points: 1, explanation: "" }])
  }

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions]
    ;(updated[idx] as any)[field] = value
    setQuestions(updated)
  }

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions]
    updated[qIdx].options[oIdx] = value
    setQuestions(updated)
  }

  const handleSubmit = async () => {
    if (!form.title || questions.some(q => !q.question)) return
    setSaving(true)
    const res = await fetch(`/api/instructor/courses/${courseId}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, questions }),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
  }

  if (saved) return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
      <h2 className="text-2xl font-extrabold text-ink mb-2">Quiz créé avec succès !</h2>
      <p className="text-zinc-500 mb-6">Le quiz est prêt pour vos apprenants.</p>
      <Link href={`/instructor/courses/${courseId}/edit`} className="px-6 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition">
        Retour au cours
      </Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/instructor/courses/${courseId}/edit`} className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Créer un quiz</h1>
          <p className="text-sm text-zinc-500">Ajoutez des questions pour évaluer vos apprenants.</p>
        </div>
      </div>

      {/* Infos quiz */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Paramètres du quiz</h2>
        </div>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du quiz"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Description (optionnel)"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Leçon associée</label>
            <select value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs outline-none bg-white">
              <option value="">Aucune</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Score min (%)</label>
            <input type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: parseInt(e.target.value) || 70 })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Tentatives max</label>
            <input type="number" value={form.maxAttempts} onChange={(e) => setForm({ ...form, maxAttempts: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs outline-none" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.showCorrection} onChange={(e) => setForm({ ...form, showCorrection: e.target.checked })} className="accent-violet-600" />
              <span className="text-xs font-semibold text-ink">Correction</span>
            </label>
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => (
        <div key={qi} className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-violet-700 uppercase">Question {qi + 1}</span>
            <button onClick={() => removeQuestion(qi)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg transition">
              <Trash2 size={14} />
            </button>
          </div>
          <textarea value={q.question} onChange={(e) => updateQuestion(qi, "question", e.target.value)} rows={2}
            placeholder="Posez votre question ici..."
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none mb-3" />

          <div className="space-y-2 mb-4">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-3">
                <input type="radio" name={`correct-${qi}`} checked={(q.correctAnswers[0] as number) === oi}
                  onChange={() => updateQuestion(qi, "correctAnswers", [oi])} className="accent-violet-600" />
                <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600" />
              </div>
            ))}
          </div>

          <textarea value={q.explanation} onChange={(e) => updateQuestion(qi, "explanation", e.target.value)} rows={1}
            placeholder="Explication (affichée après correction)"
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs outline-none focus:border-violet-600 resize-none" />
        </div>
      ))}

      <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-2xl text-sm font-semibold text-violet-700 hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2">
        <Plus size={16} /> Ajouter une question
      </button>

      <button onClick={handleSubmit} disabled={saving}
        className="w-full py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer le quiz
      </button>
    </div>
  )
}
