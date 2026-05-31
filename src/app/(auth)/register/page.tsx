"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        return
      }
      router.push("/login?registered=true")
    } catch {
      setError("Erreur de connexion. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Panneau gauche — déco */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-ink text-white p-12 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-violet-700/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-extrabold text-sm">A</div>
            <span className="font-extrabold text-lg">Access Career</span>
          </Link>
        </div>
        <div className="relative z-10">
          <p className="font-serif italic text-4xl leading-snug text-white mb-6">
            &ldquo;La meilleure
            <br />
            <span className="text-violet-400">investissement</span>
            <br />
            c&apos;est en vous.&rdquo;
          </p>
          <div className="flex gap-4 mt-8">
            {[["120+", "Formations"], ["5 000+", "Apprenants"], ["40+", "Formateurs"]].map(([n, l]) => (
              <div key={l} className="bg-white/5 rounded-xl p-4 flex-1 text-center border border-white/10">
                <div className="font-extrabold text-xl text-violet-400">{n}</div>
                <div className="text-xs text-zinc-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-zinc-500">
          &copy; 2026 Access Career — Digital Access
        </p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center text-white font-extrabold text-xs">A</div>
              <span className="font-extrabold text-base">Access Career</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-ink tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Déjà inscrit ?{" "}
              <Link href="/login" className="text-violet-700 font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex : Konan Aya"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 caractères"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Répétez le mot de passe"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-violet-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Création en cours...</>
              ) : (
                <>Créer mon compte <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-zinc-400 text-center mt-6 leading-relaxed">
            En vous inscrivant, vous acceptez nos{" "}
            <Link href="#" className="underline">Conditions d&apos;utilisation</Link>{" "}
            et notre{" "}
            <Link href="#" className="underline">Politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
