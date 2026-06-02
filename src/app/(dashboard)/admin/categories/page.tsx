"use client"

import { useState } from "react"
import { FolderOpen } from "lucide-react"

const categories = [
  { key: "INFORMATIQUE", label: "Informatique générale", desc: "Windows, Excel, Word, PowerPoint, sécurité", count: 6 },
  { key: "IA_DATA", label: "IA & Data", desc: "ChatGPT, Copilot, Data Science, Prompt Engineering", count: 4 },
  { key: "DEVELOPPEMENT", label: "Développement", desc: "HTML/CSS, JavaScript, Full-Stack, WordPress", count: 4 },
  { key: "COMMUNICATION", label: "Communication & Art oratoire", desc: "Prise de parole, négociation, leadership", count: 4 },
  { key: "EMPLOYABILITE", label: "Aide à l'employabilité", desc: "CV, entretiens, LinkedIn, entrepreneuriat", count: 4 },
  { key: "MARKETING", label: "Marketing digital", desc: "Réseaux sociaux, e-commerce, community management", count: 3 },
  { key: "DESIGN", label: "Design & Créativité", desc: "Canva, Figma, photographie", count: 2 },
  { key: "LANGUES", label: "Langues", desc: "Anglais des affaires, français renforcé", count: 2 },
]

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-ink">Gestion des catégories</h1>
      <p className="text-zinc-500 text-sm">{categories.length} catégories configurées sur la plateforme.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c.key} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <FolderOpen size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{c.label}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{c.desc}</p>
                <p className="text-xs font-semibold text-violet-700 mt-2">{c.count} formations</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
