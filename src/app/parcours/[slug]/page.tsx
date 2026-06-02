"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { ArrowLeft, BookOpen, Clock, Target, Users, Star, Loader2, CheckCircle, GraduationCap, ArrowRight } from "lucide-react"

type Course = {
  id: string; title: string; slug: string; category: string; level: string
  isFree: boolean; price: number
  instructor: { name: string | null }
  _count: { enrollments: number; chapters: number }
}
type CareerPath = {
  id: string; title: string; slug: string; description: string | null
  professionalGoal: string | null; level: string; duration: string | null
  courses: { sortOrder: number; course: Course }[]
}

const levelLabels: Record<string, string> = { BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé" }
const catLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication", EMPLOYABILITE: "Employabilité",
  MARKETING: "Marketing", DESIGN: "Design", LANGUES: "Langues",
}
const gradients: Record<string, string> = {
  INFORMATIQUE: "from-violet-600 to-violet-900", IA_DATA: "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900", COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800", MARKETING: "from-cyan-600 to-blue-800",
  DESIGN: "from-purple-600 to-pink-800", LANGUES: "from-orange-500 to-red-700",
}

export default function ParcoursDetailPage() {
  const { slug } = useParams()
  const [path, setPath]       = useState<CareerPath | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/career-paths/${slug}`)
      .then(r => r.json())
      .then(d => { setPath(d.id ? d : null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <><Navbar /><div className="flex justify-center py-20 min-h-screen"><Loader2 size={24} className="animate-spin text-violet-600" /></div></>
  )
  if (!path) return (
    <><Navbar /><div className="text-center py-20 min-h-screen"><p className="text-zinc-500">Parcours introuvable.</p>
      <Link href="/parcours" className="text-violet-700 hover:underline mt-4 inline-block">← Voir les parcours</Link></div></>
  )

  const totalEnrollments = path.courses.reduce((s, c) => s + c.course._count.enrollments, 0)

  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="bg-ink text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/parcours" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 w-fit transition">
            <ArrowLeft size={14} /> Tous les parcours
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-700 rounded-2xl flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">{path.courses.length} cours inclus</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{path.title}</h1>
          <p className="text-zinc-400 text-base max-w-2xl mb-6">{path.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
            {path.professionalGoal && <span className="flex items-center gap-2"><Target size={15} /> {path.professionalGoal}</span>}
            {path.duration && <span className="flex items-center gap-2"><Clock size={15} /> {path.duration}</span>}
            <span className="flex items-center gap-2"><BookOpen size={15} /> {path.courses.length} formations</span>
            <span className="flex items-center gap-2"><Users size={15} /> {totalEnrollments} apprenants</span>
          </div>
        </div>
      </div>

      {/* Cours du parcours */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-extrabold text-ink mb-2">Programme du parcours</h2>
        <p className="text-zinc-500 text-sm mb-8">Suivez les cours dans l&apos;ordre pour une progression optimale.</p>

        <div className="space-y-4">
          {path.courses.map((pc, i) => {
            const c = pc.course
            return (
              <Link key={c.id} href={`/cours/${c.slug}`}
                className="flex items-start gap-4 bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[c.category] || "from-zinc-600 to-zinc-900"} flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-ink group-hover:text-violet-700 transition">{c.title}</h3>
                    {c.isFree && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">GRATUIT</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="font-medium text-violet-700">{catLabels[c.category]}</span>
                    <span>{levelLabels[c.level]}</span>
                    <span>Par {c.instructor.name}</span>
                    <span className="flex items-center gap-1"><Users size={10} /> {c._count.enrollments}</span>
                    <span>{c._count.chapters} chapitres</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-center">
                  {!c.isFree && <span className="text-sm font-bold text-violet-700">{c.price.toLocaleString("fr-FR")} F</span>}
                  <ArrowRight size={16} className="text-zinc-300 group-hover:text-violet-500 transition" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Avantages */}
        <div className="mt-16 bg-violet-50 rounded-2xl border border-violet-200 p-8">
          <h3 className="text-lg font-extrabold text-ink mb-5">Ce que vous obtiendrez</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Compétences directement applicables en entreprise",
              "Certificat pour chaque cours terminé",
              "Projets pratiques pour votre portfolio",
              "Accès à vie aux contenus et mises à jour",
              "Mentorat et forum pour poser vos questions",
              "Un parcours structuré étape par étape",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
