"use client"

import { TrendingUp, DollarSign, Clock, CheckCircle, Smartphone, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminPaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-ink">Module Paiements</h1>

      {/* Bannière statut */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-wrap items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock size={22} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-amber-800">Module en cours de préparation</p>
          <p className="text-sm text-amber-700 mt-0.5">
            L&apos;intégration Wave et CinetPay sera activée prochainement. L&apos;infrastructure est prête.
          </p>
        </div>
      </div>

      {/* Méthodes de paiement prévues */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Méthodes de paiement prévues</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Wave",    type: "Mobile Money",   desc: "Paiement Wave CI, SN, ML", color: "bg-blue-50 text-blue-700",   ready: true },
            { name: "CinetPay", type: "Agrégateur",    desc: "Carte, MTN, Orange, Moov", color: "bg-violet-50 text-violet-700", ready: true },
            { name: "Orange Money", type: "Mobile Money", desc: "Orange CI, SN, ML",    color: "bg-orange-50 text-orange-700", ready: false },
          ].map(m => (
            <div key={m.name} className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${m.color}`}>{m.type}</div>
                {m.ready
                  ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Prêt</span>
                  : <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Bientôt</span>
                }
              </div>
              <h3 className="font-bold text-ink">{m.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats à venir */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Tableau de bord financier (aperçu)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenus totaux",   value: "—",   icon: DollarSign,  color: "bg-emerald-50 text-emerald-700" },
            { label: "Ce mois",          value: "—",   icon: TrendingUp,  color: "bg-violet-50 text-violet-700" },
            { label: "En attente",       value: "—",   icon: Clock,       color: "bg-amber-50 text-amber-700" },
            { label: "Cours payants",    value: "17",  icon: CreditCard,  color: "bg-blue-50 text-blue-700" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-zinc-200 p-5 opacity-60">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div className="text-2xl font-extrabold text-ink">{s.value}</div>
              <div className="text-xs font-medium text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Appel à l'action */}
      <div className="bg-ink rounded-2xl p-8 text-white text-center">
        <Smartphone size={32} className="text-violet-400 mx-auto mb-4" />
        <h3 className="text-xl font-extrabold mb-2">Activer les paiements Wave</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
          Pour activer les paiements, vous devez obtenir les clés API Wave Business et les configurer dans les paramètres.
        </p>
        <Link href="/admin/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition">
          Configurer dans les paramètres <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
