"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  BookOpen, Award, Clock, TrendingUp, ArrowRight, Star,
  Play, CheckCircle, BarChart3,
} from "lucide-react"

// Données de démonstration (on remplacera par la BDD plus tard)
const stats = [
  { label: "Cours en cours", value: "3", icon: BookOpen, color: "bg-violet-50 text-violet-700", trend: "+1 cette semaine" },
  { label: "Cours terminés", value: "2", icon: CheckCircle, color: "bg-emerald-50 text-emerald-700", trend: "Bravo !" },
  { label: "Certificats", value: "2", icon: Award, color: "bg-amber-50 text-amber-700", trend: "Vérifiables" },
  { label: "Heures apprises", value: "47", icon: Clock, color: "bg-blue-50 text-blue-700", trend: "+5h ce mois" },
]

const myCourses = [
  { title: "ChatGPT, Copilot & IA générative au travail", category: "IA & Data", progress: 72, lessons: "18/25", lastLesson: "Créer un assistant virtuel", gradient: "from-blue-600 to-indigo-900" },
  { title: "Excel : du tableau de base aux formules avancées", category: "Informatique", progress: 45, lessons: "10/22", lastLesson: "Les fonctions RECHERCHEV", gradient: "from-violet-600 to-violet-900" },
  { title: "Prise de parole en public", category: "Communication", progress: 15, lessons: "3/20", lastLesson: "Structurer son discours", gradient: "from-pink-600 to-rose-900" },
]

const recommended = [
  { title: "Data Science avec Python", category: "IA & Data", rating: 4.9, students: "720", price: "25 000 F", gradient: "from-emerald-600 to-teal-900" },
  { title: "Marketing digital pour PME", category: "Marketing", rating: 4.8, students: "890", price: "12 000 F", gradient: "from-amber-500 to-orange-800" },
]

export default function StudentDashboard() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Apprenant"

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* En-tête de bienvenue */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Bonjour, {firstName} !
        </h1>
        <p className="text-zinc-500 mt-1">
          Continuez votre apprentissage — chaque leçon vous rapproche de vos objectifs.
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition"
          >
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

      {/* Continuer mon apprentissage */}
      {myCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-ink">Continuer mon apprentissage</h2>
            <Link
              href="/student/courses"
              className="text-sm font-semibold text-violet-700 flex items-center gap-1 hover:underline"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          {/* Cours principal (le dernier accédé) */}
          <div className={`bg-gradient-to-br ${myCourses[0].gradient} rounded-2xl p-6 md:p-8 text-white mb-4 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {myCourses[0].category}
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold mt-4 mb-2 max-w-lg">
                {myCourses[0].title}
              </h3>
              <p className="text-sm text-white/70 mb-6">
                Prochaine leçon : {myCourses[0].lastLesson}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button className="flex items-center gap-2 bg-white text-ink px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition">
                  <Play size={16} /> Continuer
                </button>
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-xs text-white/80 mb-1.5">
                    <span>{myCourses[0].lessons} leçons</span>
                    <span>{myCourses[0].progress}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${myCourses[0].progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Autres cours en cours */}
          <div className="grid md:grid-cols-2 gap-4">
            {myCourses.slice(1).map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Play size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-ink mt-1 leading-snug truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Prochaine : {course.lastLesson}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>{course.lessons} leçons</span>
                        <span className="font-semibold text-violet-700">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formations recommandées */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Recommandés pour vous</h2>
          <Link
            href="/student/catalogue"
            className="text-sm font-semibold text-violet-700 flex items-center gap-1 hover:underline"
          >
            Explorer le catalogue <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recommended.map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-300 transition cursor-pointer"
            >
              <div className={`h-28 bg-gradient-to-br ${course.gradient} flex items-end p-4`}>
                <span className="font-serif italic text-lg text-white">{course.category}</span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-ink mb-3">{course.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {course.rating}
                    </span>
                    <span>{course.students} inscrits</span>
                  </div>
                  <span className="text-sm font-bold text-violet-700">{course.price} CFA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
