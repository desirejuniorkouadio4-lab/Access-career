"use client"

import { Settings, Globe, Shield, Bell, Database } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Paramètres</h1>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-4"><Globe size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Informations de la plateforme</h2></div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Nom de la plateforme</label>
            <input defaultValue="Access Career" className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
          <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Description</label>
            <input defaultValue="Plateforme e-learning de Digital Access" className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
          <div><label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Email de contact</label>
            <input defaultValue="contact@accesscareer.ci" className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-4"><Shield size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Sécurité</h2></div>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-ink">Validation obligatoire des cours avant publication</span>
            <div className="w-11 h-6 bg-violet-600 rounded-full relative"><div className="absolute top-0.5 translate-x-5 w-5 h-5 bg-white rounded-full shadow" /></div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-ink">Inscription ouverte à tous</span>
            <div className="w-11 h-6 bg-violet-600 rounded-full relative"><div className="absolute top-0.5 translate-x-5 w-5 h-5 bg-white rounded-full shadow" /></div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-2 mb-4"><Database size={18} className="text-violet-700" /><h2 className="font-bold text-ink">Base de données</h2></div>
        <p className="text-sm text-zinc-500">PostgreSQL sur Neon · Hébergé sur Vercel</p>
        <p className="text-xs text-zinc-400 mt-2">Les paramètres avancés seront disponibles dans une prochaine mise à jour.</p>
      </div>

      <button className="px-6 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition">Enregistrer les paramètres</button>
    </div>
  )
}
