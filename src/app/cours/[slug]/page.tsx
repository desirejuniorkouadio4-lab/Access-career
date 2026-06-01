"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import {
  ArrowLeft, Users, BarChart3, CheckCircle,
  Loader2, BookOpen, Lock, ChevronDown, ChevronRight, Play
} from "lucide-react"

type Lesson  = { id: string; title: string; duration: number; isFree: boolean; order: number }
type Chapter = { id: string; title: string; order: number; lessons: Lesson[] }
type Course  = {
  id: string; title: string; slug: string; description: string | null
  category: string; level: string; price: number; isFree: boolean
  instructor: { name: string | null; bio: string | null }
  chapters: Chapter[]
  _count: { enrollments: number; reviews: number }
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé",
}
const gradients: Record<string, string> = {
  INFORMATIQUE: "from-violet-600 to-violet-900",
  IA_DATA: "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900",
  COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800",
  MARKETING: "from-cyan-600 to-blue-800",
  DESIGN: "from-purple-600 to-pink-800",
  LANGUES: "from-orange-500 to-red-700",
}

export default function CourseDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [course, setCourse]         = useState<Course | null>(null)
  const [loading, setLoading]       = useState(true)
  const [enrolling, setEnrolling]   = useState(false)
  const [enrolled, setEnrolled]     = useState(false)
  const [message, setMessage]       = useState("")
  const [openChapter, setOpenChapter] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      const res = await fetch(`/api/courses/${slug}`)
      if (!res.ok) { setCourse(null); setLoading(false); return }
      const data = await res.json()
      setCourse(data)
      if (data.chapters?.length > 0) setOpenChapter(data.chapters[0].id)
      setLoading(false)
    }
    if (slug) fetchCourse()
  }, [slug])

  const handleEnroll = async () => {
    if (!session) {
      router.push(`/register?callbackUrl=/cours/${slug}`)
      return
    }
    if (!course) return
    if (!course.isFree) {
      setMessage("Le paiement Wave sera disponible très prochainement.")
      return
    }
    setEnrolling(true)
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    })
    const data = await res.json()
    if (data.enrolled) {
      setEnrolled(true)
      setMessage("Inscription réussie ! Vous pouvez accéder à votre cours.")
    } else {
      setMessage(data.error || "Erreur lors de l'inscription.")
    }
    setEnrolling(false)
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-violet-600" />
      </div>
    </>
  )

  if (!course) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
          <BookOpen size={28} className="text-zinc-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Cours introuvable</h1>
        <p className="text-zinc-500 text-sm">Ce cours n&apos;existe pas ou a été retiré.</p>
        <Link href="/catalogue" className="text-violet-700 font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>
      </div>
    </>
  )

  const totalLessons  = course.chapters.reduce((s, c) => s + c.lessons.length, 0)
  const freeLessons   = course.chapters.reduce((s, c) => s + c.lessons.filter(l => l.isFree).length, 0)
  const totalDuration = course.chapters.reduce((s, c) => s + c.lessons.reduce((ls, l) => ls + l.duration, 0), 0)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradients[course.category] || "from-zinc-800 to-zinc-900"} text-white`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/catalogue" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 w-fit transition">
            <ArrowLeft size={16} /> Retour au catalogue
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full">
                  {course.isFree ? "GRATUIT" : "PAYANT"}
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full">
                  {levelLabels[course.level]}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                {course.title}
              </h1>
              <p className="text-white/80 text-base leading-relaxed mb-6 max-w-2xl">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <Users size={15} /> {course._count.enrollments} apprenants
                </span>
                <span className="flex items-center gap-2">
                  <BarChart3 size={15} /> {levelLabels[course.level]}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen size={15} /> Par {course.instructor.name}
                </span>
                {totalLessons > 0 && (
                  <span className="flex items-center gap-2">
                    <Play size={15} /> {totalLessons} leçons
                    {totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}h`}
                  </span>
                )}
              </div>
            </div>

            {/* Carte inscription */}
            <div className="bg-white rounded-2xl p-6 text-ink shadow-2xl">
              <div className={`h-28 bg-gradient-to-br ${gradients[course.category]} rounded-xl mb-5`} />
              <div className="mb-5">
                {course.isFree
                  ? <p className="text-3xl font-extrabold text-emerald-600">Gratuit</p>
                  : <p className="text-3xl font-extrabold text-violet-700">{course.price.toLocaleString("fr-FR")} F CFA</p>
                }
              </div>

              {message && (
                <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${
                  enrolled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {message}
                </div>
              )}

              {enrolled ? (
                <Link
                  href="/student"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
                >
                  <CheckCircle size={18} /> Accéder à mon cours
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60"
                >
                  {enrolling
                    ? <><Loader2 size={18} className="animate-spin" /> Inscription...</>
                    : course.isFree
                      ? <><CheckCircle size={18} /> S&apos;inscrire gratuitement</>
                      : <><Lock size={18} /> Payer avec Wave</>
                  }
                </button>
              )}

              {!session && (
                <p className="text-xs text-zinc-500 text-center mt-3">
                  Un compte est requis.{" "}
                  <Link href="/register" className="text-violet-700 font-semibold hover:underline">
                    Créer un compte
                  </Link>
                </p>
              )}

              <ul className="mt-5 space-y-2 pt-5 border-t border-zinc-100">
                {["Accès à vie au contenu", "Certificat à la fin", "Projets pratiques inclus", "Accès mobile et desktop"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                    <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du cours */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div>
            {/* Programme */}
            {course.chapters.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-extrabold text-ink mb-2">Programme du cours</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  {course.chapters.length} chapitres · {totalLessons} leçons
                  {freeLessons > 0 && ` · ${freeLessons} leçons gratuites`}
                </p>
                <div className="space-y-3">
                  {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {chapter.order}
                          </div>
                          <span className="text-sm font-bold text-ink text-left">{chapter.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400">{chapter.lessons.length} leçons</span>
                          {openChapter === chapter.id
                            ? <ChevronDown size={16} className="text-zinc-400" />
                            : <ChevronRight size={16} className="text-zinc-400" />
                          }
                        </div>
                      </button>
                      {openChapter === chapter.id && chapter.lessons.length > 0 && (
                        <div className="border-t border-zinc-100">
                          {chapter.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 border-b border-zinc-50 last:border-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.isFree ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}>
                                {lesson.isFree ? <Play size={13} /> : <Lock size={13} />}
                              </div>
                              <span className="text-sm text-zinc-700 flex-1">{lesson.title}</span>
                              <div className="flex items-center gap-2">
                                {lesson.isFree && (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    Aperçu
                                  </span>
                                )}
                                {lesson.duration > 0 && (
                                  <span className="text-xs text-zinc-400">{lesson.duration} min</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formateur */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-ink mb-4">Votre formateur</h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-violet-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {course.instructor.name?.charAt(0) || "F"}
                </div>
                <div>
                  <p className="font-bold text-ink">{course.instructor.name}</p>
                  {course.instructor.bio && (
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
