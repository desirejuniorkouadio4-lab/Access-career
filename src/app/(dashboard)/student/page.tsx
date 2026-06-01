"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  BookOpen, Award, CheckCircle, TrendingUp,
  ArrowRight, Play, Search, Loader2
} from "lucide-react"

type EnrolledCourse = {
  enrollmentId: string
  enrolledAt: string
  completedAt: string | null
  progress: number
  totalLessons: number
  completedLessons: number
  course: {
    id: string; title: string; slug: string
    category: string; level: string; isFree: boolean
    instructor: { name: string | null }
  }
}

const gradients: Record<string, string> = {
  INFORMATIQUE:  "from-violet-600 to-violet-900",
  IA_DATA:       "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900",
  COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800",
  MARKETING:     "from-cyan-600 to-blue-800",
  DESIGN:        "from-purple-600 to-pink-800",
  LANGUES:       "from-orange-500 to-red-700",
}

const categoryLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data",
  DEVELOPPEMENT: "Développement", COMMUNICATION: "Communication",
  EMPLOYABILITE: "Employabilité", MARKETING: "Marketing",
  DESIGN: "Design", LANGUES: "Langues",
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Apprenant"
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/courses")
      .then(r => r.json())
      .then(data => { setEnrollments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const inProgress  = enrollments.filter(e => e.progress > 0 && !e.completedAt)
  const notStarted  = enrollments.filter(e => e.progress === 0)
  const completed   = enrollments.filter(e => e.completedAt)

  const stats = [
    { label: "Cours en cours",  value: inProgress.length.toString(),  icon: BookOpen,    color: "bg-violet-50 text-violet-700",  trend: "Continuez !" },
    { label: "Non commencés",   value: notStarted.length.toString(),  icon: Play,        color: "bg-blue-50 text-blue-700",      trend: "À démarrer" },
    { label: "Cours terminés",  value: completed.length.toString(),   icon: CheckCircle, color: "bg-emerald-50 text-emerald-700", trend: "Bravo !" },
    { label: "Certificats",     value: completed.length.toString(),   icon: Award,       color: "bg-amber-50 text-amber-700",    trend: "Disponibles" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Bonjour, {firstName} !
        </h1>
        <p className="text-zinc-500 mt-1">
          {enrollments.length === 0
            ? "Commencez votre apprentissage en vous inscrivant à un cours."
            : `Vous avez ${enrollments.length} cours dans votre espace.`
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <TrendingUp size={14} className="text-zinc-300" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{stat.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{stat.label}</div>
            <div className="text-[11px] text-violet-600 font-semibold mt-2">{stat.trend}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 size={24} className="animate-spin mr-3" /> Chargement de vos cours...
        </div>
      ) : enrollments.length === 0 ? (
        /* État vide */
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">Aucun cours pour le moment</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
            Explorez notre catalogue et inscrivez-vous à votre première formation.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"
          >
            Explorer le catalogue <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          {/* Cours en cours */}
          {inProgress.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink mb-4">Continuer l&apos;apprentissage</h2>

              {/* Premier cours — grande carte */}
              <div className={`bg-gradient-to-br ${gradients[inProgress[0].course.category] || "from-zinc-700 to-zinc-900"} rounded-2xl p-6 md:p-8 text-white mb-4 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    {categoryLabels[inProgress[0].course.category]}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold mt-4 mb-1 max-w-lg">
                    {inProgress[0].course.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-6">
                    Par {inProgress[0].course.instructor.name} · {inProgress[0].completedLessons}/{inProgress[0].totalLessons} leçons
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    <Link
                      href={`/learn/${inProgress[0].course.slug}`}
                      className="flex items-center gap-2 bg-white text-ink px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition"
                    >
                      <Play size={16} /> Continuer
                    </Link>
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs text-white/80 mb-1.5">
                        <span>Progression</span>
                        <span className="font-bold">{inProgress[0].progress}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${inProgress[0].progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Autres cours en cours */}
              {inProgress.slice(1).map((e) => (
                <CourseRow key={e.enrollmentId} enrollment={e} />
              ))}
            </div>
          )}

          {/* Cours non commencés */}
          {notStarted.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink mb-4">À démarrer</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {notStarted.map((e) => (
                  <CourseRow key={e.enrollmentId} enrollment={e} />
                ))}
              </div>
            </div>
          )}

          {/* Cours terminés */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink mb-4">Cours terminés</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {completed.map((e) => (
                  <CourseRow key={e.enrollmentId} enrollment={e} completed />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Découvrir plus */}
      {enrollments.length > 0 && (
        <div className="bg-ink rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white">Découvrez plus de formations</h3>
            <p className="text-zinc-400 text-sm mt-0.5">120+ cours disponibles dans le catalogue.</p>
          </div>
          <Link
            href="/catalogue"
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"
          >
            Explorer <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}

function CourseRow({ enrollment, completed }: { enrollment: EnrolledCourse; completed?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[enrollment.course.category] || "from-zinc-600 to-zinc-900"} flex items-center justify-center flex-shrink-0`}>
          {completed
            ? <CheckCircle size={20} className="text-white" />
            : <Play size={18} className="text-white" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">
            {categoryLabels[enrollment.course.category]}
          </p>
          <h3 className="text-sm font-bold text-ink leading-snug mb-2 truncate">
            {enrollment.course.title}
          </h3>
          <p className="text-xs text-zinc-400 mb-3">
            Par {enrollment.course.instructor.name}
          </p>
          {!completed && (
            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>{enrollment.completedLessons}/{enrollment.totalLessons} leçons</span>
                <span className="font-semibold text-violet-700">{enrollment.progress}%</span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full" style={{ width: `${enrollment.progress}%` }} />
              </div>
            </div>
          )}
          {completed && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle size={13} /> Terminé · Certificat disponible
            </span>
          )}
        </div>
        <Link
          href={`/learn/${enrollment.course.slug}`}
          className="flex-shrink-0 px-3 py-1.5 bg-violet-700 text-white text-xs font-semibold rounded-lg hover:bg-violet-800 transition"
        >
          {enrollment.progress > 0 ? "Continuer" : "Commencer"}
        </Link>
      </div>
    </div>
  )
}
