"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle,
  Menu, X, Play, Lock, ArrowLeft, Loader2, Trophy
} from "lucide-react"

type Lesson  = {
  id: string; title: string; content: string | null
  videoUrl: string | null; duration: number; isFree: boolean; order: number
}
type Chapter = { id: string; title: string; order: number; lessons: Lesson[] }
type Course  = {
  id: string; title: string; slug: string; category: string
  instructor: { name: string | null }
  chapters: Chapter[]
}

export default function LearnPage() {
  const { slug }  = useParams()
  const router    = useRouter()
  const { data: session, status } = useSession()

  const [course, setCourse]             = useState<Course | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [completed, setCompleted]       = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [loading, setLoading]           = useState(true)
  const [markingDone, setMarkingDone]   = useState(false)
  const [courseFinished, setCourseFinished] = useState(false)

  // Charger le cours + progression sauvegardée
  useEffect(() => {
    if (!slug || status === "loading") return
    if (!session?.user) { router.push(`/login?callbackUrl=/learn/${slug}`); return }

    const load = async () => {
      setLoading(true)
      try {
        // 1. Charger le cours
        const courseRes = await fetch(`/api/courses/${slug}`)
        if (!courseRes.ok) { router.push("/student"); return }
        const courseData: Course = await courseRes.json()
        setCourse(courseData)

        const allLessons = courseData.chapters.flatMap(c => c.lessons)
        if (allLessons.length === 0) { setLoading(false); return }

        // 2. Charger la progression sauvegardée
        const progressRes = await fetch(`/api/progress?courseId=${courseData.id}`)
        const progressData = await progressRes.json()
        const savedIds: string[] = progressData.completedLessonIds || []
        const savedSet = new Set<string>(savedIds)
        setCompleted(savedSet)

        // 3. Reprendre là où on s'est arrêté
        const firstUncompleted = allLessons.find(l => !savedSet.has(l.id))
        setActiveLesson(firstUncompleted || allLessons[allLessons.length - 1])

        // 4. Vérifier si cours déjà terminé
        if (savedIds.length === allLessons.length && allLessons.length > 0) {
          setCourseFinished(true)
        }
      } catch {
        router.push("/student")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, status, session?.user?.id])

  const markComplete = useCallback(async () => {
    if (!activeLesson || !session || markingDone) return
    setMarkingDone(true)
    try {
      await fetch("/api/progress", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonId: activeLesson.id }),
      })
      const newCompleted = new Set([...completed, activeLesson.id])
      setCompleted(newCompleted)

      const allLessons = course?.chapters.flatMap(c => c.lessons) || []
      if (newCompleted.size === allLessons.length) {
        setCourseFinished(true)
      } else {
        // Passer automatiquement à la leçon suivante
        const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id)
        if (currentIndex < allLessons.length - 1) {
          setActiveLesson(allLessons[currentIndex + 1])
        }
      }
    } finally {
      setMarkingDone(false)
    }
  }, [activeLesson, session, markingDone, completed, course])

  const allLessons   = course?.chapters.flatMap(c => c.lessons) || []
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson   = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson   = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const progress     = allLessons.length > 0 ? Math.round((completed.size / allLessons.length) * 100) : 0

  if (loading || status === "loading") return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink gap-4">
      <Loader2 size={32} className="animate-spin text-violet-400" />
      <p className="text-zinc-500 text-sm">Chargement de votre cours...</p>
    </div>
  )

  if (!course) return null

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-ink border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/student" className="text-zinc-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-px h-5 bg-zinc-700" />
          <div>
            <p className="text-sm font-bold text-white truncate max-w-[180px] md:max-w-sm">
              {course.title}
            </p>
            <p className="text-xs text-zinc-500">{course.instructor.name}</p></div><div className="flex items-center gap-2"><a href={`/forum/${course.id}`} className="px-2.5 py-1 bg-zinc-800 hover:bg-violet-700 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition">Forum</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-28 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 font-semibold w-8">{progress}%</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold transition"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
            <span className="hidden sm:inline">Programme</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          {/* Bandeau félicitations */}
          {courseFinished && (
            <div className="bg-emerald-900/50 border-b border-emerald-700 px-6 py-4 flex items-center gap-4">
              <Trophy size={24} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  🎉 Félicitations ! Vous avez terminé ce cours.
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  Votre certificat a été généré automatiquement.
                </p>
              </div>
              <Link
                href="/student"
                className="ml-auto flex-shrink-0 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition"
              >
                Voir mon certificat
              </Link>
            </div>
          )}

          {activeLesson ? (
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
              {/* Lecteur vidéo */}
              {activeLesson.videoUrl ? (
                <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden mb-8 border border-zinc-800">
                  {activeLesson.videoUrl.includes("youtube") || activeLesson.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={activeLesson.videoUrl
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "youtube.com/embed/")}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video src={activeLesson.videoUrl} controls className="w-full h-full" />
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 border border-zinc-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play size={28} className="text-zinc-500" />
                    </div>
                    <p className="text-zinc-500 text-sm">Vidéo à venir</p>
                  </div>
                </div>
              )}

              {/* Titre + bouton terminer */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">
                    Leçon {currentIndex + 1} sur {allLessons.length}
                  </p>
                  <h1 className="text-xl md:text-2xl font-extrabold text-white">
                    {activeLesson.title}
                  </h1>
                  {activeLesson.duration > 0 && (
                    <p className="text-zinc-500 text-sm mt-1">{activeLesson.duration} minutes</p>
                  )}
                </div>
                <button
                  onClick={markComplete}
                  disabled={markingDone || completed.has(activeLesson.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    completed.has(activeLesson.id)
                      ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800 cursor-default"
                      : "bg-violet-700 text-white hover:bg-violet-600"
                  }`}
                >
                  {markingDone
                    ? <Loader2 size={16} className="animate-spin" />
                    : completed.has(activeLesson.id)
                      ? <><CheckCircle size={16} /> Terminé</>
                      : <><CheckCircle size={16} /> Marquer comme terminé</>
                  }
                </button>
              </div>

              {/* Contenu texte */}
              {activeLesson.content && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {activeLesson.content}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Précédent
                </button>
                {nextLesson ? (
                  <button
                    onClick={() => setActiveLesson(nextLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-violet-700 text-white rounded-xl text-sm font-semibold hover:bg-violet-600 transition ml-auto"
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                ) : !completed.has(activeLesson.id) ? (
                  <button
                    onClick={markComplete}
                    disabled={markingDone}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition ml-auto"
                  >
                    {markingDone ? <Loader2 size={16} className="animate-spin" /> : <><Trophy size={16} /> Terminer le cours</>}
                  </button>
                ) : (
                  <Link
                    href="/student"
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition ml-auto"
                  >
                    <Trophy size={16} /> Voir mon certificat
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
              Sélectionnez une leçon pour commencer.
            </div>
          )}
        </main>

        {/* Sidebar programme */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed right-0 top-14 bottom-0 w-72 bg-zinc-900 border-l border-zinc-800 overflow-y-auto z-20 lg:relative lg:top-0 lg:z-auto">
              <div className="p-4 border-b border-zinc-800">
                <p className="text-sm font-bold text-white mb-2">Programme</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold">{progress}%</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {completed.size}/{allLessons.length} leçons terminées
                </p>
              </div>

              {course.chapters.map((chapter) => (
                <div key={chapter.id}>
                  <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Ch. {chapter.order} · {chapter.title}
                    </p>
                  </div>
                  {chapter.lessons.map((lesson) => {
                    const isActive = activeLesson?.id === lesson.id
                    const isDone   = completed.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { setActiveLesson(lesson); setSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-zinc-800/50 transition ${
                          isActive ? "bg-violet-900/40 border-l-2 border-l-violet-500" : "hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isDone
                            ? <CheckCircle size={16} className="text-emerald-500" />
                            : isActive
                              ? <Play size={16} className="text-violet-400" />
                              : <Circle size={16} className="text-zinc-600" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug truncate ${isActive ? "text-white font-semibold" : "text-zinc-400"}`}>
                            {lesson.title}
                          </p>
                          {lesson.duration > 0 && (
                            <p className="text-xs text-zinc-600 mt-0.5">{lesson.duration} min</p>
                          )}
                        </div>
                        {!lesson.isFree && <Lock size={12} className="text-zinc-600 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              ))}
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
