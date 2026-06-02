"use client"

import { useEffect, useState } from "react"
import { User, Save, Loader2, CheckCircle, Camera } from "lucide-react"

export default function ModeratorProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState({ name: "", email: "", phone: "", bio: "", image: "" })

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => { setForm({ name: d.name || "", email: d.email || "", phone: d.phone || "", bio: d.bio || "", image: d.image || "" }); setLoading(false) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Mon profil</h1>
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-extrabold text-2xl relative overflow-hidden">
            {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : form.name?.charAt(0)?.toUpperCase() || "?"}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-violet-700 rounded-full flex items-center justify-center"><Camera size={13} className="text-white" /></div>
          </div>
          <div><p className="font-bold text-ink">{form.name}</p><p className="text-sm text-zinc-500">{form.email}</p></div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Photo (URL)</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Nom</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
            <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Téléphone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" /></div>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? "Enregistré !" : "Enregistrer"}
      </button>
    </div>
  )
}
