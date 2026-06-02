"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HelpCircle, CheckCircle, XCircle, Loader2, RotateCcw, Trophy } from "lucide-react"

type Attempt = {
  id: string; score: number; passed: boolean; attemptNumber: number; submittedAt: string
  quiz: { id: string; title: string; passingScore: number; maxAttempts: number; course: { title: string } }
}

export default function StudentQuizzesPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch("/api/student/quizzes")
      .then(r => r.json())
      .then(d => { setAttempts(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Mes quiz</h1>
      <p className="text-zinc-500 text-sm">{attempts.length} tentative{attempts.length > 1 ? "s" : ""} enregistrée{attempts.length > 1 ? "s" : ""}</p>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : attempts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <HelpCircle size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Vous n&apos;avez pas encore passé de quiz.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map(a => (
            <div key={a.id} className={`bg-white rounded-2xl border p-5 ${a.passed ? "border-emerald-200" : "border-zinc-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
                    {a.passed ? <Trophy size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{a.quiz.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{a.quiz.course.title}</p>
                    <p className="text-xs text-zinc-400">
                      Tentative {a.attemptNumber}/{a.quiz.maxAttempts} ·
                      {new Date(a.submittedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-2xl font-extrabold ${a.passed ? "text-emerald-600" : "text-red-500"}`}>{a.score}%</p>
                  <p className="text-xs text-zinc-400">min : {a.quiz.passingScore}%</p>
                </div>
              </div>
              {!a.passed && a.attemptNumber < a.quiz.maxAttempts && (
                <Link href={`/student/quiz/${a.quiz.id}`}
                  className="mt-3 flex items-center gap-1.5 w-fit px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg hover:bg-violet-200 transition">
                  <RotateCcw size={12} /> Réessayer
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
