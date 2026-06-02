"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import { MessageSquare, Plus, ArrowLeft, Loader2, Pin, Send } from "lucide-react"

type Topic = { id: string; title: string; content: string; pinned: boolean; createdAt: string; user: { name: string | null }; _count: { replies: number } }

export default function ForumPage() {
  const { courseId } = useParams()
  const { data: session } = useSession()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: "", content: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/forums/${courseId}`).then(r => r.json()).then(data => { setTopics(Array.isArray(data) ? data : []); setLoading(false) })
  }, [courseId])

  const handleCreate = async () => {
    setSaving(true)
    const res = await fetch(`/api/forums/${courseId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ title: "", content: "" }); setCreating(false); const r = await fetch(`/api/forums/${courseId}`); setTopics(await r.json()) }
    setSaving(false)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/student" className="text-sm text-violet-700 hover:underline flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Retour</Link>
            <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2"><MessageSquare size={22} className="text-violet-600" /> Forum du cours</h1>
          </div>
          {session && <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"><Plus size={16} /> Nouveau sujet</button>}
        </div>

        {creating && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6 space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du sujet"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Votre question ou message..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none" />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving || !form.title} className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier
              </button>
              <button onClick={() => setCreating(false)} className="px-4 py-2.5 text-sm text-zinc-600 border border-zinc-300 rounded-xl">Annuler</button>
            </div>
          </div>
        )}

        {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div> : (
          <div className="space-y-3">
            {topics.length === 0 && <div className="text-center py-12"><MessageSquare size={28} className="text-zinc-400 mx-auto mb-3" /><p className="text-zinc-500 text-sm">Aucun sujet. Soyez le premier !</p></div>}
            {topics.map((t) => (
              <Link key={t.id} href={`/forum/${courseId}/${t.id}`} className="block bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-300 transition">
                <div className="flex items-start gap-3">
                  {t.pinned && <Pin size={14} className="text-violet-600 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-ink">{t.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">Par {t.user.name} · {new Date(t.createdAt).toLocaleDateString("fr-FR")} · {t._count.replies} réponses</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
