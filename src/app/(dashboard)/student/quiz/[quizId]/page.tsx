"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react"

type Question = { id: string; type: string; question: string; options: any; points: number; order: number }
type Quiz = { id: string; title: string; description: string | null; passingScore: number; maxAttempts: number; showCorrection: boolean; questions: Question[]; attemptsUsed: number; canAttempt: boolean; course: { title: string }; lesson: { title: string } | null }
type Result = { questionId: string; isCorrect: boolean; correctAnswer?: any; explanation?: string; userAnswer: any; points: number }

export default function TakeQuizPage() {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<{ score: number; passed: boolean; results: Result[]; attemptsUsed: number } | null>(null)

  useEffect(() => {
    fetch(`/api/student/quiz/${quizId}`)
      .then(r => r.json())
      .then(data => { setQuiz(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [quizId])

  const handleSubmit = async () => {
    if (!quiz) return
    setSubmitting(true)
    const res = await fetch(`/api/student/quiz/${quizId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    setResults(data)
    setSubmitting(false)
  }

  const retry = () => { setResults(null); setAnswers({}) }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
  if (!quiz) return <div className="text-center py-20"><p className="text-zinc-500">Quiz introuvable.</p></div>

  if (results) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className={`rounded-2xl p-8 text-center ${results.passed ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${results.passed ? "bg-emerald-100" : "bg-red-100"}`}>
          {results.passed ? <Trophy size={28} className="text-emerald-600" /> : <XCircle size={28} className="text-red-500" />}
        </div>
        <h2 className="text-2xl font-extrabold text-ink mb-2">{results.passed ? "Félicitations !" : "Score insuffisant"}</h2>
        <p className="text-4xl font-extrabold mb-2" style={{ color: results.passed ? "#059669" : "#ef4444" }}>{results.score}%</p>
        <p className="text-sm text-zinc-500">Score minimum requis : {quiz.passingScore}% · Tentative {results.attemptsUsed}/{quiz.maxAttempts}</p>
      </div>

      {quiz.showCorrection && results.results.map((r, i) => (
        <div key={i} className={`bg-white rounded-2xl border p-5 ${r.isCorrect ? "border-emerald-200" : "border-red-200"}`}>
          <div className="flex items-start gap-3">
            {r.isCorrect ? <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-sm font-bold text-ink mb-2">{quiz.questions[i]?.question}</p>
              {r.explanation && <p className="text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3">{r.explanation}</p>}
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: r.isCorrect ? "#d1fae5" : "#fee2e2", color: r.isCorrect ? "#059669" : "#ef4444" }}>
              {r.points}/{quiz.questions[i]?.points} pt
            </span>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        {!results.passed && results.attemptsUsed < quiz.maxAttempts && (
          <button onClick={retry} className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition">
            <RotateCcw size={16} /> Réessayer
          </button>
        )}
        <Link href="/student" className="flex-1 flex items-center justify-center gap-2 py-3 border border-zinc-300 text-zinc-600 font-semibold rounded-xl hover:bg-zinc-50 transition">
          Retour au dashboard <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h1 className="text-xl font-extrabold text-ink mb-1">{quiz.title}</h1>
        <p className="text-sm text-zinc-500 mb-2">{quiz.course.title}{quiz.lesson ? ` > ${quiz.lesson.title}` : ""}</p>
        {quiz.description && <p className="text-sm text-zinc-600">{quiz.description}</p>}
        <div className="flex gap-4 mt-3 text-xs text-zinc-400">
          <span>{quiz.questions.length} questions</span>
          <span>Score min : {quiz.passingScore}%</span>
          <span>Tentative {quiz.attemptsUsed + 1}/{quiz.maxAttempts}</span>
        </div>
        {!quiz.canAttempt && <p className="mt-3 text-sm text-red-600 font-semibold">Nombre maximum de tentatives atteint.</p>}
      </div>

      {quiz.canAttempt && quiz.questions.map((q, qi) => (
        <div key={q.id} className="bg-white rounded-2xl border border-zinc-200 p-6">
          <p className="text-xs font-bold text-violet-700 mb-2">Question {qi + 1} · {q.points} point{q.points > 1 ? "s" : ""}</p>
          <p className="text-sm font-bold text-ink mb-4">{q.question}</p>
          <div className="space-y-2">
            {(q.options as string[]).map((opt: string, oi: number) => (
              <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${answers[q.id] === oi ? "border-violet-500 bg-violet-50" : "border-zinc-200 hover:border-zinc-300"}`}>
                <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === oi}
                  onChange={() => setAnswers({ ...answers, [q.id]: oi })} className="accent-violet-600" />
                <span className="text-sm text-ink">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {quiz.canAttempt && (
        <button onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < quiz.questions.length}
          className="w-full py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          Soumettre mes réponses ({Object.keys(answers).length}/{quiz.questions.length})
        </button>
      )}
    </div>
  )
}
