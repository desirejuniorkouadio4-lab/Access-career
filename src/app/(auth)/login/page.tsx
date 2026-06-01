"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get("registered") === "true"
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        setError("Email ou mot de passe incorrect.")
        return
      }
      // Rediriger selon le rôle (le middleware s'en chargera aussi)
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Erreur de connexion. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center text-white font-extrabold text-xs">A</div>
          <span className="font-extrabold text-base">Access Career</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight">
          Bon retour !
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-violet-700 font-semibold hover:underline">
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>

      {justRegistered && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
          <CheckCircle size={16} />
          Compte créé avec succès ! Connectez-vous maintenant.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-semibold text-ink">
              Mot de passe
            </label>
            <Link href="#" className="text-xs text-violet-700 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
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
            <><Loader2 size={18} className="animate-spin" /> Connexion...</>
          ) : (
            <>Se connecter <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Panneau gauche */}
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
          <p className="font-serif italic text-4xl leading-snug text-white mb-4">
            &ldquo;Chaque expert
            <br />
            <span className="text-violet-400">a été débutant</span>
            <br />
            un jour.&rdquo;
          </p>
          <p className="text-sm text-zinc-400 mt-4">
            Continuez là où vous vous êtes arrêté.
          </p>
        </div>
        <p className="relative z-10 text-xs text-zinc-500">
          &copy; 2026 Access Career — Digital Access
        </p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Suspense fallback={<div className="animate-pulse text-zinc-400">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
