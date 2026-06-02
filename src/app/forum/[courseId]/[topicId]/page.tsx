"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import { ArrowLeft, Send, Loader2, Shield, GraduationCap, CheckCircle } from "lucide-react"

type Reply = { id: string; content: string; isOfficialAnswer: boolean; createdAt: string; user: { name: string | null; role: string } }
type Topic = { id: string; title: string; content: string; createdAt: string; user: { name: string | null; role: string }; replies: Reply[]; course: { title: string } }

export default function TopicPage() {
  const { courseId, topicId } = useParams()
  const { data: session } = useSession()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)

  const fetchTopic = async () => { const r = await fetch(`/api/forums/topics/${topicId}`); setTopic(await r.json()); setLoading(false) }
  useEffect(() => { fetchTopic() }, [topicId])

  const handleReply = async () => {
    if (!reply.trim()) return; setSending(true)
    await fetch(`/api/forums/topics/${topicId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: reply }) })
    setReply(""); setSending(false); await fetchTopic()
  }

  const RoleBadge = ({ role }: { role: string }) => (
    role === "INSTRUCTOR" ? <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Formateur</span>
    : role === "ADMIN" ? <span className="text-[10px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">Admin</span> : null
  )

  if (loading) return <><Navbar /><div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-violet-600" /></div></>
  if (!topic) return null

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href={`/forum/${courseId}`} className="text-sm text-violet-700 hover:underline flex items-center gap-1 mb-6"><ArrowLeft size={14} /> Retour au forum</Link>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6">
          <p className="text-xs text-violet-700 font-bold mb-2">{topic.course.title}</p>
          <h1 className="text-xl font-extrabold text-ink mb-3">{topic.title}</h1>
          <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">{topic.content}</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">
            <span className="font-semibold text-ink">{topic.user.name}</span> <RoleBadge role={topic.user.role} />
            <span>· {new Date(topic.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <h3 className="font-bold text-ink mb-4">{topic.replies.length} réponse{topic.replies.length > 1 ? "s" : ""}</h3>

        <div className="space-y-3 mb-8">
          {topic.replies.map((r) => (
            <div key={r.id} className={`rounded-2xl border p-5 ${r.isOfficialAnswer ? "bg-emerald-50 border-emerald-200" : "bg-white border-zinc-200"}`}>
              {r.isOfficialAnswer && <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-2"><CheckCircle size={13} /> Réponse officielle</div>}
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">{r.content}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
                <span className="font-semibold text-ink">{r.user.name}</span> <RoleBadge role={r.user.role} />
                <span>· {new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))}
        </div>

        {session && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Votre réponse..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none mb-3" />
            <button onClick={handleReply} disabled={sending || !reply.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-50">
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Répondre
            </button>
          </div>
        )}
      </div>
    </>
  )
}
