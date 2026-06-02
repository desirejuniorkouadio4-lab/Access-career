"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Play, CheckCircle, Lock, BookOpen, Award, MessageSquare, Loader2, Clock } from "lucide-react"

type Lesson  = { id: string; title: string; duration: number; isFree: boolean; order: number }
type Chapter = { id: string; title: string; order: number; lessons: Lesson[] }
type Course  = {
  id: string; title: string; slug: string; category: string
  instructor: { name: string | null }
  chapters: Chapter[]
  _count: { enrollments: number }
}

export default function StudentCourseDetailPage() {
  const { slug } = useParams()
  const [course, setCourse]       = useState<Course | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      fetch(`/api/courses/${slug}`).then(r => r.json()),
    ]).then(([courseData]) => {
      setCourse(courseData)
      fetch(`/api/progress?courseId=${courseData.id}`)
        .then(r => r.json())
        .then(p => setCompleted(new Set(p.completedLessonIds || [])))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
  if (!course) return <div className="text-center py-20 text-zinc-500">Cours introuvable.</div>

  const allLessons   = course.chapters.flatMap(c => c.lessons)
  const totalLessons = allLessons.length
  const doneCount    = allLessons.filter(l => completed.has(l.id)).length
  const progress     = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0
  const nextLesson   = allLessons.find(l => !completed.has(l.id))
  const isComplete   = doneCount === totalLessons && totalLessons > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/student/courses" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-ink truncate">{course.title}</h1>
          <p className="text-sm text-zinc-500">Par {course.instructor.name}</p>
        </div>
      </div>

      {/* Progression */}
      <div className={`rounded-2xl p-6 text-white ${isComplete ? "bg-emerald-600" : "bg-ink"} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          {isComplete ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Award size={28} className="text-emerald-200" />
                <div>
                  <p className="font-extrabold text-lg">Cours terminé ! 🎉</p>
                  <p className="text-emerald-200 text-sm">Votre certificat est disponible.</p>
                </div>
              </div>
              <Link href="/student/certificates"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition">
                <Award size={16} /> Voir mon certificat
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Votre progression</p>
                  <p className="text-4xl font-extrabold text-violet-400">{progress}%</p>
                  <p className="text-zinc-400 text-sm mt-1">{doneCount}/{totalLessons} leçons terminées</p>
                </div>
                {nextLesson && (
                  <Link href={`/learn/${course.slug}`}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-600 transition">
                    <Play size={16} /> Continuer
                  </Link>
                )}
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href={`/learn/${course.slug}`}
          className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-violet-300 transition flex items-center gap-3">
          <Play size={18} className="text-violet-600" />
          <div>
            <p className="text-sm font-bold text-ink">{nextLesson ? "Continuer" : "Revoir"}</p>
            <p className="text-xs text-zinc-400 truncate">{nextLesson?.title || "Cours terminé"}</p>
          </div>
        </Link>
        <Link href={`/forum/${course.id}`}
          className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-violet-300 transition flex items-center gap-3">
          <MessageSquare size={18} className="text-blue-600" />
          <div>
            <p className="text-sm font-bold text-ink">Forum</p>
            <p className="text-xs text-zinc-400">Poser une question</p>
          </div>
        </Link>
        <Link href="/student/certificates"
          className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-violet-300 transition flex items-center gap-3">
          <Award size={18} className="text-amber-600" />
          <div>
            <p className="text-sm font-bold text-ink">Certificat</p>
            <p className="text-xs text-zinc-400">{isComplete ? "Disponible" : "Après complétion"}</p>
          </div>
        </Link>
      </div>

      {/* Programme avec progression */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Programme</h2>
        <div className="space-y-3">
          {course.chapters.map(ch => {
            const chLessons  = ch.lessons
            const chDone     = chLessons.filter(l => completed.has(l.id)).length
            const chProgress = chLessons.length > 0 ? Math.round((chDone / chLessons.length) * 100) : 0
            return (
              <div key={ch.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${chDone === chLessons.length ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                    {chDone === chLessons.length ? <CheckCircle size={14} /> : ch.order}
                  </div>
                  <span className="text-sm font-bold text-ink flex-1">{ch.title}</span>
                  <span className="text-xs text-zinc-400">{chDone}/{chLessons.length}</span>
                </div>
                {chLessons.map(l => (
                  <div key={l.id} className="flex items-center gap-3 px-5 py-3 border-b border-zinc-50 last:border-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${completed.has(l.id) ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}>
                      {completed.has(l.id) ? <CheckCircle size={12} /> : <Play size={11} />}
                    </div>
                    <span className={`text-sm flex-1 ${completed.has(l.id) ? "text-zinc-400 line-through" : "text-ink"}`}>{l.title}</span>
                    {l.duration > 0 && <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={10} /> {l.duration}min</span>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
