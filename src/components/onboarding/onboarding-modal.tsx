"use client"

import { useEffect, useState } from "react"
import { Rocket, BookOpen, Target, ArrowRight, Check, Sparkles } from "lucide-react"

const categories = [
  { key: "INFORMATIQUE", label: "Informatique", emoji: "💻" },
  { key: "IA_DATA", label: "IA & Data", emoji: "🤖" },
  { key: "DEVELOPPEMENT", label: "Développement", emoji: "🌐" },
  { key: "COMMUNICATION", label: "Communication", emoji: "🎙️" },
  { key: "EMPLOYABILITE", label: "Emploi & Carrière", emoji: "💼" },
  { key: "MARKETING", label: "Marketing digital", emoji: "📱" },
  { key: "DESIGN", label: "Design", emoji: "🎨" },
  { key: "LANGUES", label: "Langues", emoji: "🌍" },
]

const goals = [
  "Trouver un emploi",
  "Évoluer dans ma carrière",
  "Apprendre de nouvelles compétences",
  "Me reconvertir professionnellement",
  "Lancer mon entreprise",
  "Obtenir des certifications",
]

export default function OnboardingModal({ userName }: { userName: string }) {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/onboarding")
      .then(r => r.json())
      .then(d => { if (!d.onboarded) setShow(true) })
      .catch(() => {})
  }, [])

  const toggleCat = (key: string) => {
    setSelectedCats(prev => prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key])
  }
  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  const handleFinish = async () => {
    setSaving(true)
    await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goals: selectedGoals.join(", "),
        bio: selectedCats.length > 0 ? `Centres d'intérêt : ${selectedCats.map(c => categories.find(x => x.key === c)?.label).join(", ")}` : "",
      }),
    })
    setSaving(false)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1.5 bg-zinc-100">
          <div className="h-full bg-violet-600 transition-all rounded-full" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>

        <div className="p-8">
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Rocket size={32} className="text-violet-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-ink mb-2">
                Bienvenue, {userName} ! 🎉
              </h2>
              <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">
                Personnalisons votre expérience en quelques secondes pour vous recommander les meilleurs cours.
              </p>
              <button onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition">
                C&apos;est parti ! <ArrowRight size={16} />
              </button>
              <button onClick={handleFinish}
                className="mt-3 text-sm text-zinc-400 hover:text-zinc-600 transition">
                Passer pour le moment
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Qu&apos;aimeriez-vous apprendre ?</h3>
                  <p className="text-xs text-zinc-400">Sélectionnez vos centres d&apos;intérêt</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {categories.map(c => (
                  <button key={c.key} onClick={() => toggleCat(c.key)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-left transition ${
                      selectedCats.includes(c.key)
                        ? "bg-violet-100 border-2 border-violet-500 text-violet-700"
                        : "bg-zinc-50 border-2 border-transparent text-zinc-600 hover:bg-zinc-100"
                    }`}>
                    <span className="text-lg">{c.emoji}</span>
                    {c.label}
                    {selectedCats.includes(c.key) && <Check size={14} className="ml-auto text-violet-600" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">Retour</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">Continuer</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Target size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Quel est votre objectif ?</h3>
                  <p className="text-xs text-zinc-400">Sélectionnez un ou plusieurs objectifs</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {goals.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition ${
                      selectedGoals.includes(g)
                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700"
                        : "bg-zinc-50 border-2 border-transparent text-zinc-600 hover:bg-zinc-100"
                    }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedGoals.includes(g) ? "border-emerald-500 bg-emerald-500" : "border-zinc-300"
                    }`}>
                      {selectedGoals.includes(g) && <Check size={12} className="text-white" />}
                    </div>
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">Retour</button>
                <button onClick={handleFinish} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60">
                  {saving ? <Sparkles size={14} className="animate-pulse" /> : <Sparkles size={14} />}
                  {saving ? "Personnalisation..." : "Commencer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
