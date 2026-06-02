"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Briefcase, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react"

type Project = { id: string; title: string; description: string | null; externalLink: string | null; status: string; createdAt: string }

export default function PortfolioPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", externalLink: "" })
  const [saving, setSaving] = useState(false)

  const fetchData = async () => { const r = await fetch("/api/student/portfolio"); setProjects(await r.json()); setLoading(false) }
  useEffect(() => { fetchData() }, [])

  const handleCreate = async () => {
    setSaving(true)
    await fetch("/api/student/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setForm({ title: "", description: "", externalLink: "" }); setCreating(false); setSaving(false); await fetchData()
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Supprimer ce projet ?")) return
    await fetch("/api/student/portfolio", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId }) })
    await fetchData()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2"><Briefcase size={22} className="text-violet-600" /> Mon portfolio</h1>
          <p className="text-zinc-500 text-sm mt-1">Présentez vos projets réalisés pendant vos formations.</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du projet"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Décrivez votre projet..."
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" />
          <input value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} placeholder="Lien (GitHub, site web, etc.)"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving || !form.title} className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Ajouter
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2.5 text-sm text-zinc-600 border border-zinc-300 rounded-xl">Annuler</button>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <Briefcase size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Ajoutez vos premiers projets pour construire votre portfolio.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-violet-300 transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-bold text-ink">{p.title}</h3>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
              </div>
              {p.description && <p className="text-sm text-zinc-600 mb-3">{p.description}</p>}
              {p.externalLink && (
                <a href={p.externalLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-violet-700 font-semibold hover:underline">
                  <ExternalLink size={13} /> Voir le projet
                </a>
              )}
              <p className="text-xs text-zinc-400 mt-3">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
