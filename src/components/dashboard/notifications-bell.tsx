"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck, BookOpen, FileText, GraduationCap, MessageSquare, X } from "lucide-react"

type Notif = {
  id: string; type: string; title: string; message: string
  link: string | null; read: boolean; createdAt: string
}

const iconMap: Record<string, any> = {
  COURSE_APPROVED: BookOpen, COURSE_REJECTED: BookOpen,
  ASSIGNMENT_GRADED: FileText, NEW_ENROLLMENT: GraduationCap,
  APPLICATION_APPROVED: GraduationCap, APPLICATION_REJECTED: GraduationCap,
  FORUM_REPLY: MessageSquare,
}

const colorMap: Record<string, string> = {
  COURSE_APPROVED: "bg-emerald-100 text-emerald-600",
  COURSE_REJECTED: "bg-red-100 text-red-600",
  ASSIGNMENT_GRADED: "bg-blue-100 text-blue-600",
  NEW_ENROLLMENT: "bg-violet-100 text-violet-600",
  APPLICATION_APPROVED: "bg-emerald-100 text-emerald-600",
  APPLICATION_REJECTED: "bg-red-100 text-red-600",
  FORUM_REPLY: "bg-cyan-100 text-cyan-600",
}

export default function NotificationsBell() {
  const [notifs, setNotifs]   = useState<Notif[]>([])
  const [open, setOpen]       = useState(false)
  const ref                   = useRef<HTMLDivElement>(null)

  const unread = notifs.filter(n => !n.read).length

  const fetchNotifs = async () => {
    const r = await fetch("/api/notifications")
    const d = await r.json()
    setNotifs(Array.isArray(d) ? d : [])
  }

  useEffect(() => {
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markRead = async (notifId: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: notifId }),
    })
    setNotifs(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-zinc-200 shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <h3 className="font-bold text-ink text-sm">
              Notifications
              {unread > 0 && <span className="ml-2 text-xs font-bold text-violet-600">{unread} nouvelles</span>}
            </h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} title="Tout marquer comme lu"
                  className="p-1 text-zinc-400 hover:text-violet-700 transition">
                  <CheckCheck size={15} />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 text-zinc-400 hover:text-ink transition">
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell size={24} className="text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Aucune notification.</p>
              </div>
            ) : notifs.map(n => {
              const Icon = iconMap[n.type] || Bell
              const color = colorMap[n.type] || "bg-zinc-100 text-zinc-500"
              return (
                <div key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false) }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-zinc-50 last:border-0 cursor-pointer transition ${n.read ? "hover:bg-zinc-50" : "bg-violet-50/50 hover:bg-violet-50"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink">{n.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0 mt-2" />}
                </div>
              )
            })}
          </div>

          {notifs.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-100 text-center">
              <button onClick={markAllRead} className="text-xs font-semibold text-violet-700 hover:underline">
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
