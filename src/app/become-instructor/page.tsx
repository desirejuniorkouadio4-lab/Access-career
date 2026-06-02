"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { GraduationCap, CheckCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react"

const perks = [
  "Créer et vendre vos formations à votre rythme",
  "Accès à plus de 5 000 apprenants sur la plateforme",
  "Certificats co-brandés Access Career / Digital Access",
  "Tableau de bord analytique pour suivre vos revenus",
  "Support pédagogique de l'équipe Access Career",
]

export default function BecomeInstructorPage() {
  const { data: session, status } = useSession()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    expertise: "", experience: "", courseIdea: "", linkedin: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.expertise || !form.experience || !form.courseIdea) {
      setError("Veuillez remplir tous les champs obligatoires."); return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/instructor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erreur lors de l'envoi."); setLoading(false); return }
      setSubmitted(true)
    } catch {
      setError("Erreur de connexion.")
    }
    setLoading(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-zinc-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink mb-3">Candidature envoyée !</h1>
        <p className="text-zinc-500 text-sm mb-6">
          Notre équipe examinera votre dossier dans les <strong>48 à 72 heures</strong>.<br />
          Vous serez notifié par email dès qu&apos;une décision sera prise.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          Retour à l&apos;accueil <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-ink text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-8 w-fit transition">
            <ArrowLeft size={14} /> Retour
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-violet-700 rounded-2xl flex items-center justify-center">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Devenez Formateur</h1>
              <p className="text-zinc-400 mt-1">sur Access Career — Digital Access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="bg-white rounded-2xl border border-zinc-200 p-8">
            {status === "unauthenticated" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Vous devez être connecté pour postuler.
                </p>
                <Link href="/login?callbackUrl=/become-instructor"
                  className="text-violet-700 underline font-semibold text-sm">
                  Se connecter ou créer un compte →
                </Link>
              </div>
            )}

            {session?.user && (session.user as any).role === "INSTRUCTOR" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-emerald-800">
                  ✅ Vous êtes déjà formateur sur Access Career.
                </p>
                <Link href="/instructor" className="text-violet-700 underline font-semibold text-sm">
                  Accéder à mon espace formateur →
                </Link>
              </div>
            )}

            <h2 className="text-xl font-extrabold text-ink mb-6">Votre candidature</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Votre domaine d&apos;expertise <span className="text-red-500">*</span>
                </label>
                <input name="expertise" value={form.expertise} onChange={handleChange}
                  placeholder="Ex : Développement web, Marketing digital, Excel..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Votre expérience professionnelle <span className="text-red-500">*</span>
                </label>
                <textarea name="experience" value={form.experience} onChange={handleChange} rows={4}
                  placeholder="Décrivez votre parcours, vos réalisations, vos compétences..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Idée de cours <span className="text-red-500">*</span>
                </label>
                <textarea name="courseIdea" value={form.courseIdea} onChange={handleChange} rows={3}
                  placeholder="Décrivez le cours que vous aimeriez créer..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Profil LinkedIn <span className="text-zinc-400 font-normal">(optionnel)</span>
                </label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading || status === "unauthenticated" || (session?.user as any)?.role === "INSTRUCTOR"}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi...</> : <>Envoyer ma candidature <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h3 className="font-bold text-ink mb-4">Ce que vous obtenez</h3>
              <ul className="space-y-3">
                {perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink rounded-2xl p-6 text-white">
              <p className="font-serif italic text-2xl text-violet-400 mb-3">&ldquo;Partagez ce que vous savez.&rdquo;</p>
              <p className="text-sm text-zinc-400">Chaque formateur Access Career contribue à construire l&apos;Afrique de demain.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
