"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Search, Star, Users, Filter, X, BookOpen } from "lucide-react"

type Course = {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  level: string
  price: number
  isFree: boolean
  thumbnail: string | null
  instructor: { name: string | null; image: string | null }
  _count: { enrollments: number; reviews: number }
}

const categoryLabels: Record<string, string> = {
  INFORMATIQUE:   "Informatique",
  IA_DATA:        "IA & Data",
  DEVELOPPEMENT:  "Développement",
  COMMUNICATION:  "Communication",
  EMPLOYABILITE:  "Employabilité",
  MARKETING:      "Marketing",
  DESIGN:         "Design",
  LANGUES:        "Langues",
}

const levelLabels: Record<string, string> = {
  BEGINNER:     "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED:     "Avancé",
}

const gradients: Record<string, string> = {
  INFORMATIQUE:  "from-violet-600 to-violet-900",
  IA_DATA:       "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900",
  COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800",
  MARKETING:     "from-cyan-600 to-blue-800",
  DESIGN:        "from-purple-600 to-pink-800",
  LANGUES:       "from-orange-500 to-red-700",
}

export default function CataloguePage() {
  const [courses, setCourses]     = useState<Course[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [category, setCategory]   = useState("")
  const [level, setLevel]         = useState("")
  const [freeOnly, setFreeOnly]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)   params.set("search", search)
    if (category) params.set("category", category)
    if (level)    params.set("level", level)
    if (freeOnly) params.set("free", "true")
    const res = await fetch(`/api/courses?${params}`)
    const data = await res.json()
    setCourses(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [search, category, level, freeOnly])

  useEffect(() => {
    const t = setTimeout(fetchCourses, 300)
    return () => clearTimeout(t)
  }, [fetchCourses])

  const clearFilters = () => {
    setSearch(""); setCategory(""); setLevel(""); setFreeOnly(false)
  }

  const hasFilters = search || category || level || freeOnly

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-ink text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Trouvez votre{" "}
            <span className="font-serif italic text-violet-400">formation idéale</span>
          </h1>
          <p className="text-zinc-400 mb-8">
            {courses.length > 0 ? `${courses.length} formations disponibles` : "Des formations pour tous les niveaux"}
          </p>
          <div className="flex max-w-2xl mx-auto border-2 border-zinc-700 rounded-xl p-1.5 bg-zinc-900 focus-within:border-violet-500 transition">
            <div className="flex items-center gap-3 flex-1 px-4">
              <Search size={18} className="text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher Excel, IA, Communication..."
                className="flex-1 py-2.5 text-sm outline-none bg-transparent text-white placeholder:text-zinc-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              showFilters ? "bg-violet-700 text-white border-violet-700" : "border-zinc-300 text-zinc-600 hover:border-ink"
            }`}
          >
            <Filter size={15} /> Filtres
            {hasFilters && <span className="w-5 h-5 bg-white text-violet-700 rounded-full text-[11px] font-bold flex items-center justify-center">!</span>}
          </button>

          {/* Pills catégories */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(categoryLabels).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setCategory(category === val ? "" : val)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  category === val
                    ? "bg-ink text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:underline ml-auto">
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Panneau filtres avancés */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8 grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Niveau</label>
              <div className="space-y-2">
                {Object.entries(levelLabels).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      checked={level === val}
                      onChange={() => setLevel(level === val ? "" : val)}
                      className="accent-violet-600"
                    />
                    <span className="text-sm text-zinc-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Prix</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${freeOnly ? "bg-violet-600" : "bg-zinc-300"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${freeOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-semibold text-ink">Gratuit uniquement</span>
              </label>
            </div>
          </div>
        )}

        {/* Grille de cours */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse">
                <div className="h-36 bg-zinc-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-zinc-200 rounded w-1/3" />
                  <div className="h-4 bg-zinc-200 rounded w-full" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Aucune formation trouvée</h3>
            <p className="text-zinc-500 text-sm mb-6">Essayez d&apos;autres mots-clés ou effacez les filtres.</p>
            <button onClick={clearFilters} className="px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
              Voir toutes les formations
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/cours/${course.slug}`}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-400 hover:-translate-y-1 transition-all group"
              >
                <div className={`h-36 bg-gradient-to-br ${gradients[course.category] || "from-zinc-600 to-zinc-900"} relative flex items-end p-4`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="relative font-serif italic text-base text-white">
                    {categoryLabels[course.category]}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {course.isFree ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">GRATUIT</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded">PAYANT</span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded">
                      {levelLabels[course.level]}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-ink leading-snug mb-3 line-clamp-2 group-hover:text-violet-700 transition">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    Par <span className="font-semibold">{course.instructor.name || "Formateur"}</span>
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Users size={12} />
                      <span>{course._count.enrollments} inscrits</span>
                    </div>
                    {course.isFree ? (
                      <span className="text-sm font-bold text-emerald-600">Gratuit</span>
                    ) : (
                      <span className="text-sm font-bold text-violet-700">
                        {course.price.toLocaleString("fr-FR")} F
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
