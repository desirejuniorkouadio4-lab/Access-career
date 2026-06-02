"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { ArrowRight, BookOpen, Clock, Target, Loader2, GraduationCap } from "lucide-react"

type CareerPath = {
  id: string; title: string; slug: string; description: string | null
  professionalGoal: string | null; level: string; duration: string | null
  courses: { course: { id: string } }[]
}

const levelLabels: Record<string, string> = { BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé" }
const gradients = ["from-violet-600 to-indigo-900", "from-emerald-600 to-teal-900", "from-blue-600 to-cyan-900", "from-pink-600 to-rose-900", "from-amber-500 to-orange-800", "from-purple-600 to-violet-900"]

export default function ParcoursPage() {
  const [paths, setPaths]     = useState<CareerPath[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/career-paths").then(r => r.json()).then(d => { setPaths(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  return (
    <>
      <Navbar />
      <div className="bg-ink text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap size={40} className="text-violet-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Parcours <span className="font-serif italic text-violet-400">Métiers</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Des formations regroupées pour atteindre un objectif professionnel clair. Chaque parcours mène à une compétence concrète.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
        ) : paths.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap size={32} className="text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-500">Les parcours métiers arrivent bientôt.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((p, i) => (
              <Link key={p.id} href={`/parcours/${p.slug}`}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-400 hover:-translate-y-1 transition-all group">
                <div className={`h-32 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-end p-5 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">
                      {p.courses.length} cours
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-extrabold text-ink mb-2 group-hover:text-violet-700 transition">
                    {p.title}
                  </h3>
                  {p.professionalGoal && (
                    <div className="flex items-center gap-2 text-xs text-violet-700 font-semibold mb-3">
                      <Target size={12} /> {p.professionalGoal}
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {p.courses.length} cours</span>
                      {p.duration && <span className="flex items-center gap-1"><Clock size={11} /> {p.duration}</span>}
                    </div>
                    <span className="font-semibold text-violet-700 flex items-center gap-1">
                      Voir <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
