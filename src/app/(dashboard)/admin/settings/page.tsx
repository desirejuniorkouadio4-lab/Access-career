"use client"

import { useState } from "react"
import { Globe, Shield, Bell, Database, CreditCard, Save, CheckCircle, Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [general, setGeneral] = useState({
    platformName: "Access Career",
    description: "Plateforme e-learning de Digital Access",
    email: "contact@accesscareer.ci",
    website: "https://access-career-blush.vercel.app",
  })
  const [security, setSecurity] = useState({
    requireCourseValidation: true,
    openRegistration: true,
    allowInstructorApplication: true,
  })
  const [payments, setPayments] = useState({
    waveApiKey: "",
    cinetpayApiKey: "",
    commissionRate: "20",
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Paramètres</h1>

      {/* Général */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Informations générales</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nom de la plateforme", key: "platformName", placeholder: "Access Career" },
            { label: "Description",          key: "description",  placeholder: "Description de la plateforme" },
            { label: "Email de contact",     key: "email",        placeholder: "contact@example.com" },
            { label: "URL du site",          key: "website",      placeholder: "https://..." },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">{f.label}</label>
              <input value={(general as any)[f.key]} placeholder={f.placeholder}
                onChange={e => setGeneral({ ...general, [f.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Sécurité et accès</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Validation obligatoire des cours avant publication",      key: "requireCourseValidation" },
            { label: "Inscription ouverte à tous",                              key: "openRegistration" },
            { label: "Autoriser les candidatures pour devenir formateur",       key: "allowInstructorApplication" },
          ].map(opt => (
            <label key={opt.key} className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-sm text-ink">{opt.label}</span>
              <div onClick={() => setSecurity({ ...security, [opt.key]: !(security as any)[opt.key] })}
                className={`w-11 h-6 rounded-full relative transition-colors ${(security as any)[opt.key] ? "bg-violet-600" : "bg-zinc-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(security as any)[opt.key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Paiements */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Configuration paiements</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Clé API Wave Business</label>
            <input type="password" value={payments.waveApiKey}
              onChange={e => setPayments({ ...payments, waveApiKey: e.target.value })}
              placeholder="wave_sk_prod_..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Clé API CinetPay</label>
            <input type="password" value={payments.cinetpayApiKey}
              onChange={e => setPayments({ ...payments, cinetpayApiKey: e.target.value })}
              placeholder="cinetpay_..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Taux de commission Access Career (%)</label>
            <input type="number" value={payments.commissionRate} min="0" max="100"
              onChange={e => setPayments({ ...payments, commissionRate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
          </div>
        </div>
      </div>

      {/* Base de données */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-violet-700" />
          <h2 className="font-bold text-ink">Infrastructure</h2>
        </div>
        <div className="space-y-2 text-sm text-zinc-600">
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span>Base de données</span>
            <span className="font-semibold text-emerald-600">PostgreSQL — Neon ✓</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span>Hébergement</span>
            <span className="font-semibold text-emerald-600">Vercel ✓</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span>Authentification</span>
            <span className="font-semibold text-emerald-600">Auth.js v5 ✓</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Framework</span>
            <span className="font-semibold text-emerald-600">Next.js 16 ✓</span>
          </div>
        </div>
      </div>

      {/* Bouton save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
        {saving
          ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</>
          : saved
            ? <><CheckCircle size={18} /> Paramètres enregistrés !</>
            : <><Save size={18} /> Enregistrer les paramètres</>
        }
      </button>
    </div>
  )
}
