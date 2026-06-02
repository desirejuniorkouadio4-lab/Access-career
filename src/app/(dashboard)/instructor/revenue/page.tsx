"use client"

import { DollarSign, TrendingUp, Clock } from "lucide-react"

export default function InstructorRevenuePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Revenus</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5"><DollarSign size={20} className="text-emerald-600 mb-3" /><div className="text-2xl font-extrabold text-ink">0 F</div><div className="text-xs text-zinc-500">Revenus totaux</div></div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5"><TrendingUp size={20} className="text-violet-600 mb-3" /><div className="text-2xl font-extrabold text-ink">0 F</div><div className="text-xs text-zinc-500">Ce mois</div></div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5"><Clock size={20} className="text-amber-600 mb-3" /><div className="text-2xl font-extrabold text-ink">0 F</div><div className="text-xs text-zinc-500">En attente</div></div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-amber-800 font-semibold">Le module de paiement sera activé prochainement avec Wave / CinetPay.</p>
        <p className="text-xs text-amber-600 mt-1">Vos revenus seront automatiquement calculés une fois le paiement intégré.</p>
      </div>
    </div>
  )
}
