"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, BookOpen, Tag, DollarSign, Image } from "lucide-react"
import Link from "next/link"

const categories = ["INFORMATIQUE", "IA_DATA", "DEVELOPPEMENT", "COMMUNICATION", "EMPLOYABILITE", "MARKETING", "DESIGN", "LANGUES"]
const categoryLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication", EMPLOYABILITE: "Employabilité",
  MARKETING: "Marketing", DESIGN: "Design", LANGUES: "Langues",
}

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "", description: "", category: "", level: "BEGINNER",
    price: "", isFree: false, thumbnail: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.description) { setError("Remplissez tous les champs obligatoires."); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: form.isFree ? 0 : parseFloat(form.price) || 0 }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erreur."); setLoading(false); return }
      router.push("/instructor")
    } catch { setError("Erreur serveur."); setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/instructor" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-extrabold text-ink">Créer un nouveau cours</h1><p className="text-sm text-zinc-500 mt-0.5">Il sera visible en brouillon jusqu&apos;à soumission.</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4"><BookOpen size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Informations</h2></div>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold text-ink mb-1.5">Titre *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Ex : Maîtriser Excel en 20 heures" className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
            <div><label className="block text-sm font-semibold text-ink mb-1.5">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Ce que les apprenants vont apprendre..." className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4"><Image size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Image de couverture</h2></div>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="URL de l'image (ex: https://images.unsplash.com/...)" className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
          {form.thumbnail && <img src={form.thumbnail} alt="Aperçu" className="mt-3 rounded-xl h-40 object-cover w-full border border-zinc-200" />}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4"><Tag size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Catégorie et Niveau</h2></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-ink mb-1.5">Catégorie *</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 bg-white">
                <option value="">Choisir</option>
                {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select></div>
            <div><label className="block text-sm font-semibold text-ink mb-1.5">Niveau</label>
              <select name="level" value={form.level} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 bg-white">
                <option value="BEGINNER">Débutant</option><option value="INTERMEDIATE">Intermédiaire</option><option value="ADVANCED">Avancé</option>
              </select></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4"><DollarSign size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Tarification</h2></div>
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="accent-violet-600 w-4 h-4" />
            <span className="text-sm font-semibold text-ink">Ce cours est gratuit</span>
          </label>
          {!form.isFree && <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Prix en F CFA" className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div className="flex gap-3">
          <Link href="/instructor" className="flex-1 text-center py-3 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl hover:bg-zinc-50 transition">Annuler</Link>
          <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null} Créer le cours
          </button>
        </div>
      </form>
    </div>
  )
}
