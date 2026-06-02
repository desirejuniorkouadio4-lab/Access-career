"use client"

import Link from "next/link"
import {
  Briefcase, FileText, MessageSquare, GraduationCap,
  ExternalLink, Target, Star, ArrowRight
} from "lucide-react"

const resources = [
  {
    title: "Rédiger un CV efficace",
    desc: "Structure, contenu, mise en page : les règles pour un CV qui attire les recruteurs.",
    icon: FileText, color: "bg-violet-100 text-violet-700",
    link: "/catalogue",
  },
  {
    title: "Préparer ses entretiens",
    desc: "Techniques pour répondre aux questions classiques et faire bonne impression.",
    icon: MessageSquare, color: "bg-blue-100 text-blue-700",
    link: "/catalogue",
  },
  {
    title: "Optimiser son LinkedIn",
    desc: "Transformez votre profil LinkedIn en aimant à opportunités professionnelles.",
    icon: Star, color: "bg-cyan-100 text-cyan-700",
    link: "/catalogue",
  },
  {
    title: "Lancer son activité",
    desc: "Guide complet pour créer son entreprise en Côte d'Ivoire : statuts, financement, clients.",
    icon: Target, color: "bg-amber-100 text-amber-700",
    link: "/catalogue",
  },
]

const jobSites = [
  { name: "Emploi.ci",     url: "https://www.emploi.ci",      desc: "Offres d'emploi en Côte d'Ivoire" },
  { name: "Novojob CI",    url: "https://www.novojob.com/ci",  desc: "Recrutement en Afrique de l'Ouest" },
  { name: "LinkedIn Jobs",  url: "https://www.linkedin.com/jobs", desc: "Offres internationales" },
  { name: "Go Africa Online",url: "https://www.goafricaonline.com", desc: "Annuaire entreprises africaines" },
]

export default function StudentCareerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2">
          <Briefcase size={22} className="text-violet-600" /> Espace Carrière
        </h1>
        <p className="text-zinc-500 mt-1">
          Ressources et outils pour booster votre employabilité.
        </p>
      </div>

      {/* Parcours métiers */}
      <div className="bg-ink rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-700/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <GraduationCap size={28} className="text-violet-400 mb-3" />
          <h2 className="text-xl font-extrabold mb-2">Parcours Métiers</h2>
          <p className="text-zinc-400 text-sm mb-5 max-w-lg">
            Des formations regroupées pour atteindre un objectif professionnel clair : développeur, community manager, data analyst...
          </p>
          <Link href="/parcours"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-600 transition">
            Découvrir les parcours <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Formations emploi */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Formations employabilité</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {resources.map(r => (
            <Link key={r.title} href={r.link}
              className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${r.color}`}>
                <r.icon size={18} />
              </div>
              <h3 className="text-sm font-bold text-ink mb-1 group-hover:text-violet-700 transition">{r.title}</h3>
              <p className="text-xs text-zinc-500">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-ink">Votre Portfolio</h3>
          <p className="text-sm text-zinc-500 mt-0.5">Présentez vos projets réalisés pendant vos formations.</p>
        </div>
        <Link href="/student/portfolio"
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-100 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-200 transition">
          <Briefcase size={15} /> Mon portfolio
        </Link>
      </div>

      {/* Sites d'emploi */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Sites d&apos;emploi recommandés</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {jobSites.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between bg-white rounded-2xl border border-zinc-200 px-5 py-4 hover:border-violet-300 transition group">
              <div>
                <p className="text-sm font-bold text-ink group-hover:text-violet-700 transition">{s.name}</p>
                <p className="text-xs text-zinc-400">{s.desc}</p>
              </div>
              <ExternalLink size={15} className="text-zinc-300 group-hover:text-violet-500 transition flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
