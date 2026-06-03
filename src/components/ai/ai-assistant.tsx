"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Loader2, Sparkles, MessageSquare } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

interface Props {
  courseTitle: string
  lessonTitle: string
  lessonContent?: string
}

export default function AIAssistant({ courseTitle, lessonTitle, lessonContent }: Props) {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const scrollRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, courseTitle, lessonTitle, lessonContent }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Erreur." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur de connexion." }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-violet-700 text-white rounded-full shadow-xl hover:bg-violet-800 transition-all flex items-center justify-center group hover:scale-110">
          <Bot size={24} />
          <span className="absolute -top-10 right-0 bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg">
            Assistant IA
          </span>
        </button>
      )}

      {/* Panneau chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-ink text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold">Assistant Access Career</p>
                <p className="text-[10px] text-zinc-400">Posez vos questions sur le cours</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition">
              <X size={16} className="text-zinc-400" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[350px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={32} className="text-violet-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-ink">Comment puis-je vous aider ?</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Posez vos questions sur &ldquo;{lessonTitle}&rdquo;
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    "Explique-moi cette leçon simplement",
                    "Donne-moi un exemple concret",
                    "Quels sont les points clés ?",
                  ].map(q => (
                    <button key={q} onClick={() => { setInput(q); }}
                      className="block w-full text-left px-3 py-2 bg-violet-50 text-violet-700 text-xs font-medium rounded-xl hover:bg-violet-100 transition">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-violet-700 text-white rounded-br-md"
                    : "bg-zinc-100 text-ink rounded-bl-md"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Réflexion en cours...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-zinc-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Votre question..."
                className="flex-1 px-3.5 py-2.5 bg-zinc-50 rounded-xl text-sm outline-none focus:bg-zinc-100 transition" />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className="w-9 h-9 bg-violet-700 text-white rounded-xl flex items-center justify-center hover:bg-violet-800 transition disabled:opacity-40">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
