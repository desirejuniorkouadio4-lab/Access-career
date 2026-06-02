"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { User, Save, Loader2, Camera, MapPin, GraduationCap, Target, CheckCircle } from "lucide-react"

type Profile = {
  name: string; email: string; phone: string; bio: string
  country: string; city: string; educationLevel: string; professionalGoal: string
  image: string
}

export default function StudentProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Profile>({
    name: "", email: "", phone: "", bio: "",
    country: "", city: "", educationLevel: "", professionalGoal: "", image: ""
  })
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" })
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false })
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      await update({ name: form.name })
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg({ text: "Les mots de passe ne correspondent pas.", ok: false }); return
    }
    if (pwForm.newPw.length < 8) {
      setPwMsg({ text: "8 caractères minimum.", ok: false }); return
    }
    setPwSaving(true)
    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
    })
    const data = await res.json()
    setPwMsg({ text: res.ok ? "Mot de passe modifié !" : data.error, ok: res.ok })
    if (res.ok) setPwForm({ current: "", newPw: "", confirm: "" })
    setPwSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Mon profil</h1>

      {/* Infos personnelles */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Informations personnelles</h2>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-extrabold text-2xl flex-shrink-0 relative">
            {form.name?.charAt(0)?.toUpperCase() || "?"}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-violet-700 rounded-full flex items-center justify-center cursor-pointer">
              <Camera size={13} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-bold text-ink">{form.name}</p>
            <p className="text-sm text-zinc-500">{form.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Nom complet</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Téléphone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+225 07 00 00 00"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Parlez-nous de vous..."
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition resize-none" />
        </div>
      </div>

      {/* Localisation */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Localisation</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Pays</label>
            <input name="country" value={form.country} onChange={handleChange} placeholder="Côte d'Ivoire"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Ville</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Abidjan"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          </div>
        </div>
      </div>

      {/* Objectifs */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Objectifs professionnels</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Niveau d&apos;études</label>
            <select name="educationLevel" value={form.educationLevel} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition bg-white">
              <option value="">Sélectionner</option>
              <option value="brevet">Brevet / BEPC</option>
              <option value="bac">Baccalauréat</option>
              <option value="bac+2">Bac+2 (BTS/DUT)</option>
              <option value="licence">Licence (Bac+3)</option>
              <option value="master">Master (Bac+5)</option>
              <option value="doctorat">Doctorat</option>
              <option value="autodidacte">Autodidacte</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Objectif professionnel</label>
            <input name="professionalGoal" value={form.professionalGoal} onChange={handleChange} placeholder="Ex : Devenir développeur web"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          </div>
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Enregistré !" : "Enregistrer les modifications"}
        </button>
        {saved && <span className="text-sm text-emerald-600 font-semibold">Profil mis à jour.</span>}
      </div>

      {/* Mot de passe */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h2 className="font-bold text-ink mb-5">Changer le mot de passe</h2>
        <div className="space-y-3 max-w-sm">
          <input type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} placeholder="Mot de passe actuel"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder="Nouveau mot de passe (8 car. min)"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Confirmer le nouveau mot de passe"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 transition" />
          {pwMsg.text && <p className={`text-sm font-semibold ${pwMsg.ok ? "text-emerald-600" : "text-red-600"}`}>{pwMsg.text}</p>}
          <button onClick={handlePasswordChange} disabled={pwSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition disabled:opacity-60">
            {pwSaving ? <Loader2 size={14} className="animate-spin" /> : null} Modifier le mot de passe
          </button>
        </div>
      </div>
    </div>
  )
}
