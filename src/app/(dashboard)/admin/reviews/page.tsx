"use client"

import { useEffect, useState } from "react"
import { Star, Loader2, EyeOff, Trash2, Eye, RefreshCw } from "lucide-react"

type Review = {
  id: string; rating: number; comment: string | null; status: string; createdAt: string
  user:   { name: string | null; email: string | null }
  course: { title: string }
}

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={13} className={i <= n ? "text-amber-400 fill-amber-400" : "text-zinc-300"} />
    ))}
  </div>
)

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    const r = await fetch("/api/admin/reviews")
    const d = await r.json()
    setReviews(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const updateStatus = async (reviewId: string, status: string) => {
    setProcessing(reviewId)
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status }),
    })
    await fetchReviews()
    setProcessing(null)
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Supprimer cet avis définitivement ?")) return
    setProcessing(reviewId)
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId }),
    })
    await fetchReviews()
    setProcessing(null)
  }

  const filtered = filter === "ALL" ? reviews : reviews.filter(r => r.status === filter)

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—"

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Gestion des avis</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {reviews.length} avis · Note moyenne : <strong>{avgRating}</strong>/5
          </p>
        </div>
        <button onClick={fetchReviews} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "ALL",      label: "Tous",    count: reviews.length },
          { key: "PUBLISHED",label: "Publiés", count: reviews.filter(r => r.status === "PUBLISHED").length },
          { key: "HIDDEN",   label: "Masqués", count: reviews.filter(r => r.status === "HIDDEN").length },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === f.key ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <Star size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun avis pour le moment.</p>
          <p className="text-zinc-400 text-xs mt-2">Les avis apparaîtront ici lorsque des étudiants noteront les formations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className={`bg-white rounded-2xl border p-5 transition ${r.status === "HIDDEN" ? "border-zinc-200 opacity-60" : "border-zinc-200 hover:border-violet-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
                      {r.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{r.user.name}</p>
                      <p className="text-xs text-zinc-400">{r.course.title}</p>
                    </div>
                    <Stars n={r.rating} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${r.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {r.status === "PUBLISHED" ? "Publié" : "Masqué"}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-zinc-700 bg-zinc-50 rounded-xl px-4 py-3 mt-2">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
                  <p className="text-xs text-zinc-400 mt-2">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-100">
                {r.status === "PUBLISHED" ? (
                  <button onClick={() => updateStatus(r.id, "HIDDEN")}
                    disabled={processing === r.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition disabled:opacity-50">
                    {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />}
                    Masquer
                  </button>
                ) : (
                  <button onClick={() => updateStatus(r.id, "PUBLISHED")}
                    disabled={processing === r.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-200 transition disabled:opacity-50">
                    {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
                    Publier
                  </button>
                )}
                <button onClick={() => deleteReview(r.id)}
                  disabled={processing === r.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50">
                  {processing === r.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
