"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import {
  ArrowLeft, Star, Users, Clock, BarChart3,
  CheckCircle, Loader2, BookOpen, Lock
} from "lucide-react"

type Course = {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  level: string
  price: number
  isFree: boolean
  instructor: { name: string | null }
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
  const [course, setCourse]       = useState<Course | null>(null)
  const [loading, setLoading]     = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled]   = useState(false)
  const [message, setMessage]     = useState("")

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`/api/courses?search=${slug}`)
      const data = await res.json()
      const found = data.find((c: Course) => c.slug === slug)
      setCourse(found || null)
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
      setMessage("Le paiement Wave sera disponible prochainement.")
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
      setMessage("Inscription réussie ! Accédez à votre cours.")
    } else {
      setMessage(data.error || "Erreur lors de l'inscription.")
    }
    setEnrolling(false)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-violet-600" />
        </div>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-extrabold text-ink">Cours introuvable</h1>
          <Link href="/catalogue" className="text-violet-700 font-semibold hover:underline">
            ← Retour au catalogue
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Hero du cours */}
      <div className={`bg-gradient-to-br ${gradients[course.category] || "from-zinc-800 to-zinc-900"} text-white`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/catalogue" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 w-fit transition">
            <ArrowLeft size={16} /> Retour au catalogue
          </Link>
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {course.isFree ? (
                  <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full">GRATUIT</span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full">PAYANT</span>
                )}
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
              </div>
            </div>

            {/* Carte d'inscription */}
            <div className="bg-white rounded-2xl p-6 text-ink shadow-2xl">
              <div className={`h-32 bg-gradient-to-br ${gradients[course.category]} rounded-xl mb-5`} />
              <div className="mb-5">
                {course.isFree ? (
                  <p className="text-3xl font-extrabold text-emerald-600">Gratuit</p>
                ) : (
                  <p className="text-3xl font-extrabold text-violet-700">
                    {course.price.toLocaleString("fr-FR")} F CFA
                  </p>
                )}
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
                  {enrolling ? (
                    <><Loader2 size={18} className="animate-spin" /> Inscription...</>
                  ) : course.isFree ? (
                    <><CheckCircle size={18} /> S&apos;inscrire gratuitement</>
                  ) : (
                    <><Lock size={18} /> Payer avec Wave</>
                  )}
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

              <ul className="mt-5 space-y-2.5 pt-5 border-t border-zinc-100">
                {[
                  "Accès à vie au contenu",
                  "Certificat à la fin",
                  "Projets pratiques inclus",
                  "Accès mobile et desktop",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
