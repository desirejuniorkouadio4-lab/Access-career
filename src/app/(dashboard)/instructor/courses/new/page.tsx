"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, BookOpen, Tag, DollarSign, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

const categories = [
  "INFORMATIQUE", "IA_DATA", "DEVELOPPEMENT",
  "COMMUNICATION", "EMPLOYABILITE", "MARKETING", "DESIGN", "LANGUES",
]

const categoryLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique générale",
  IA_DATA: "IA & Data",
  DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication & Art oratoire",
  EMPLOYABILITE: "Aide à l'employabilité",
  MARKETING: "Marketing digital",
  DESIGN: "Design & Créativité",
  LANGUES: "Langues",
}

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "BEGINNER",
    price: "",
    isFree: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.description) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.isFree ? 0 : parseFloat(form.price) || 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erreur lors de la création."); return }
      router.push(`/instructor/courses/${data.id}/edit`)
    } catch {
      setError("Erreur serveur. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/instructor" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Créer un nouveau cours</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Il sera soumis à validation avant publication.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-violet-700" />
            <h2 className="font-bold text-ink">Informations de base</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Titre du cours <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex : Maîtriser Excel en 20 heures"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez ce que les apprenants vont apprendre, les prérequis, le public cible..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Catégorie & Niveau */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-violet-700" />
            <h2 className="font-bold text-ink">Catégorie & Niveau</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition bg-white"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Niveau</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition bg-white"
              >
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-violet-700" />
            <h2 className="font-bold text-ink">Tarification</h2>
          </div>
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isFree: !form.isFree })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.isFree ? "bg-violet-600" : "bg-zinc-300"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFree ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-semibold text-ink">Ce cours est gratuit</span>
          </label>
          {!form.isFree && (
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Prix en francs CFA
              </label>
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ex : 15000"
                  min="0"
                  className="w-full pl-4 pr-16 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  F CFA
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/instructor"
            className="flex-1 text-center py-3 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl hover:bg-zinc-50 transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Création...</> : "Créer et continuer →"}
          </button>
        </div>
      </form>
    </div>
  )
}
