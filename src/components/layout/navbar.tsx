"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menu, X, User } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"

  const dashboardPath =
    (session?.user as any)?.role === "ADMIN" ? "/admin"
    : (session?.user as any)?.role === "INSTRUCTOR" ? "/instructor"
    : "/student"

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center text-white font-extrabold text-sm relative overflow-hidden">
            <span className="relative z-10">A</span>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-violet-600" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-ink">
            Access Career
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link href="/catalogue" className="text-sm font-medium text-zinc-600 hover:text-violet-700 transition">
            Catalogue
          </Link>
          <Link href="#parcours" className="text-sm font-medium text-zinc-600 hover:text-violet-700 transition">
            Parcours
          </Link>
          <Link href="#pourquoi" className="text-sm font-medium text-zinc-600 hover:text-violet-700 transition">
            Pourquoi nous
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href={dashboardPath}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-700 rounded-lg hover:bg-violet-800 transition"
            >
              <User size={16} />
              Mon espace
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-semibold text-ink rounded-lg hover:bg-zinc-100 transition"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-ink rounded-lg hover:bg-violet-700 transition"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-6 py-4 space-y-3">
          <Link href="#catalogue" className="block text-sm font-medium text-zinc-700" onClick={() => setOpen(false)}>Catalogue</Link>
          <Link href="#parcours" className="block text-sm font-medium text-zinc-700" onClick={() => setOpen(false)}>Parcours</Link>
          <Link href="#pourquoi" className="text-sm font-medium text-zinc-600 hover:text-violet-700 transition">Pourquoi nous</Link>
          <Link href="/become-instructor" className="text-sm font-medium text-zinc-600 hover:text-violet-700 transition">Devenir formateur</Link>
          <hr className="my-3" />
          {isLoggedIn ? (
            <Link
              href={dashboardPath}
              className="block text-sm font-semibold text-white bg-violet-700 text-center py-2.5 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/login" className="block text-sm font-semibold" onClick={() => setOpen(false)}>Connexion</Link>
              <Link href="/register" className="block text-sm font-semibold text-white bg-ink text-center py-2.5 rounded-lg" onClick={() => setOpen(false)}>
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
