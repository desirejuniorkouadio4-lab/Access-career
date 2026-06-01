"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { GraduationCap, CheckCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react"

const perks = [
  "Créer et vendre vos formations à votre rythme",
  "Accès à plus de 5 000 apprenants sur la plateforme",
  "Certificats co-brandés Access Career / Digital Access",
  "Tableau de bord analytique pour suivre vos revenus",
  "Support pédagogique de l'équipe Access Career",
]

export default function BecomeInstructorPage() {
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    expertise: "",
    experience: "",
    courseidea: "",
    linkedin: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500)) // Simulation API
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-ink mb-3">Candidature envoyée !</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Notre équipe examinera votre dossier dans les <strong>48 à 72 heures</strong>. Vous recevrez une réponse par email.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
            Retour à l&apos;accueil <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-extrabold text-sm">A</div>
            <span className="font-extrabold text-base">Access Career</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-violet-700 rounded-2xl flex items-center justify-center">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Devenez Formateur
              </h1>
              <p className="text-zinc-400 mt-1">sur Access Career</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-xl mt-4">
            Partagez votre expertise avec des milliers d&apos;apprenants en Côte d&apos;Ivoire et en Afrique de l&apos;Ouest.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8">
            {!session && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6 text-sm">
                <p className="font-semibold text-violet-800 mb-1">Vous devez être connecté pour postuler.</p>
                <Link href="/login?callbackUrl=/become-instructor" className="text-violet-700 underline font-semibold">
                  Se connecter ou créer un compte →
                </Link>
              </div>
            )}

            <h2 className="text-xl font-extrabold text-ink mb-6">Votre candidature</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Votre domaine d&apos;expertise <span className="text-red-500">*</span>
                </label>
                <input
                  name="expertise"
                  value={form.expertise}
                  onChange={handleChange}
                  placeholder="Ex : Développement web, Marketing digital, Excel..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Votre expérience professionnelle <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez votre parcours, vos expériences, vos réalisations..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Idée de cours <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="courseidea"
                  value={form.courseidea}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez le cours que vous aimeriez créer sur Access Career..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Profil LinkedIn <span className="text-zinc-400 font-normal">(optionnel)</span>
                </label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !session}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
                  : <>Envoyer ma candidature <ArrowRight size={16} /></>
                }
              </button>
            </form>
          </div>

          {/* Avantages */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h3 className="font-bold text-ink mb-4">Ce que vous obtenez</h3>
              <ul className="space-y-3">
                {perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-ink rounded-2xl p-6 text-white">
              <p className="font-serif italic text-2xl text-violet-400 mb-3">
                &ldquo;Partagez ce que vous savez.&rdquo;
              </p>
              <p className="text-sm text-zinc-400">
                Chaque formateur Access Career contribue à construire l&apos;Afrique de demain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
