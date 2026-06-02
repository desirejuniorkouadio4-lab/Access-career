"use client"

import { useEffect, useState, useCallback } from "react"
import {
  BookOpen, CheckCircle, XCircle, Eye, Loader2, Archive,
  RotateCcw, Search, Filter, X, ChevronDown, ChevronRight,
  Users, UserCheck, Play, Lock, RefreshCw
} from "lucide-react"

type Instructor = { id: string; name: string | null; email: string | null }
type Course = {
  id: string; title: string; category: string; status: string
  rejectReason: string | null; createdAt: string; isFree: boolean; price: number
  instructor: Instructor
  _count: { enrollments: number; chapters: number; reviews: number }
}
type CourseDetail = Course & {
  description: string | null
  chapters: { id: string; title: string; order: number; lessons: { id: string; title: string; duration: number; isFree: boolean }[] }[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:     { label: "Brouillon",  color: "bg-zinc-100 text-zinc-600" },
  PENDING:   { label: "En attente", color: "bg-amber-100 text-amber-700" },
  PUBLISHED: { label: "Publié",     color: "bg-emerald-100 text-emerald-700" },
  REJECTED:  { label: "Refusé",     color: "bg-red-100 text-red-700" },
  ARCHIVED:  { label: "Archivé",    color: "bg-zinc-200 text-zinc-500" },
}

const categories = ["INFORMATIQUE","IA_DATA","DEVELOPPEMENT","COMMUNICATION","EMPLOYABILITE","MARKETING","DESIGN","LANGUES"]
const catLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication", EMPLOYABILITE: "Employabilité",
  MARKETING: "Marketing", DESIGN: "Design", LANGUES: "Langues",
}

type Modal = "detail" | "reject" | "assign" | null

export default function AdminCoursesPage() {
  const [courses, setCourses]         = useState<Course[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [filterStatus, setFilterStatus]   = useState("ALL")
  const [filterCat, setFilterCat]     = useState("")
  const [filterInst, setFilterInst]   = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [modal, setModal]             = useState<Modal>(null)
  const [selected, setSelected]       = useState<Course | null>(null)
  const [detail, setDetail]           = useState<CourseDetail | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [assignTo, setAssignTo]       = useState("")
  const [processing, setProcessing]   = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filterStatus !== "ALL") p.set("status", filterStatus)
    if (filterCat)  p.set("category", filterCat)
    if (filterInst) p.set("instructor", filterInst)
    if (search)     p.set("search", search)
    const r = await fetch(`/api/admin/courses/list?${p}`)
    const d = await r.json()
    setCourses(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [filterStatus, filterCat, filterInst, search])

  useEffect(() => {
    const t = setTimeout(fetchCourses, 300)
    return () => clearTimeout(t)
  }, [fetchCourses])

  useEffect(() => {
    fetch("/api/admin/instructors").then(r => r.json()).then(d => setInstructors(Array.isArray(d) ? d : []))
  }, [])

  const doAction = async (courseId: string, status: string, extra?: Record<string, any>) => {
    setProcessing(courseId)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status, ...extra }),
    })
    setProcessing(null); setModal(null); setRejectReason(""); setAssignTo("")
    await fetchCourses()
  }

  const doAssign = async () => {
    if (!selected || !assignTo) return
    setProcessing(selected.id)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selected.id, instructorId: assignTo }),
    })
    setProcessing(null); setModal(null); setAssignTo("")
    await fetchCourses()
  }

  const openDetail = async (c: Course) => {
    setSelected(c); setDetail(null); setModal("detail")
    const r = await fetch(`/api/admin/courses/${c.id}`)
    setDetail(await r.json())
  }

  const counts: Record<string, number> = { ALL: 0 }
  courses.forEach(c => {
    counts.ALL = (counts.ALL || 0) + 1
    counts[c.status] = (counts[c.status] || 0) + 1
  })
  const pendingCount = courses.filter(c => c.status === "PENDING").length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Gestion des formations</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {courses.length} formation{courses.length > 1 ? "s" : ""}
            {pendingCount > 0 && <span className="text-amber-600 font-semibold ml-2">· {pendingCount} en attente</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition ${showFilters ? "bg-violet-700 text-white border-violet-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}>
            <Filter size={15} /> Filtres
          </button>
          <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-4 py-2.5">
        <Search size={16} className="text-zinc-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une formation..." className="flex-1 text-sm outline-none bg-transparent" />
        {search && <button onClick={() => setSearch("")}><X size={14} className="text-zinc-400" /></button>}
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Catégorie</label>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm outline-none bg-white focus:border-violet-600">
              <option value="">Toutes</option>
              {categories.map(c => <option key={c} value={c}>{catLabels[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Formateur</label>
            <select value={filterInst} onChange={e => setFilterInst(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm outline-none bg-white focus:border-violet-600">
              <option value="">Tous</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button onClick={() => { setFilterCat(""); setFilterInst(""); setSearch("") }}
              className="text-xs font-semibold text-red-500 hover:underline">
              Effacer les filtres
            </button>
          </div>
        </div>
      )}

      {/* Onglets statut */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "PUBLISHED", "DRAFT", "REJECTED", "ARCHIVED"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${filterStatus === s ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
            {s === "ALL" ? "Toutes" : statusConfig[s]?.label}
            {" "}({s === "ALL" ? courses.length : courses.filter(c => c.status === s).length})
          </button>
        ))}
      </div>

      {/* Liste des cours */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <BookOpen size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucune formation trouvée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-violet-200 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[c.status]?.color}`}>
                      {statusConfig[c.status]?.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="font-medium text-violet-700">{catLabels[c.category]}</span>
                    <span className="flex items-center gap-1"><UserCheck size={11} /> {c.instructor.name}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {c._count.enrollments} inscrits</span>
                    <span>{c._count.chapters} chapitres</span>
                    <span>{c.isFree ? "Gratuit" : `${c.price.toLocaleString("fr-FR")} F`}</span>
                  </div>
                  {c.rejectReason && c.status === "REJECTED" && (
                    <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-1.5 rounded-lg">
                      Motif refus : {c.rejectReason}
                    </p>
                  )}
                </div>
                <span className="text-xs text-zinc-400 flex-shrink-0">
                  {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                {/* Voir le détail */}
                <button onClick={() => openDetail(c)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 text-zinc-600 text-xs font-semibold rounded-lg hover:border-violet-400 hover:text-violet-700 transition">
                  <Eye size={12} /> Détail
                </button>

                {/* Assigner à un formateur */}
                <button onClick={() => { setSelected(c); setAssignTo(c.instructor.id); setModal("assign") }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 text-zinc-600 text-xs font-semibold rounded-lg hover:border-violet-400 hover:text-violet-700 transition">
                  <UserCheck size={12} /> Assigner
                </button>

                {c.status === "PENDING" && <>
                  <button onClick={() => doAction(c.id, "PUBLISHED")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                    {processing === c.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                    Approuver
                  </button>
                  <button onClick={() => { setSelected(c); setRejectReason(""); setModal("reject") }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition">
                    <XCircle size={12} /> Refuser
                  </button>
                </>}

                {c.status === "PUBLISHED" && <>
                  <button onClick={() => doAction(c.id, "DRAFT")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition disabled:opacity-50">
                    Dépublier
                  </button>
                  <button onClick={() => doAction(c.id, "ARCHIVED")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
                    <Archive size={12} /> Archiver
                  </button>
                </>}

                {c.status === "DRAFT" && (
                  <button onClick={() => doAction(c.id, "PUBLISHED")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                    <CheckCircle size={12} /> Publier directement
                  </button>
                )}

                {(c.status === "REJECTED" || c.status === "ARCHIVED") && <>
                  <button onClick={() => doAction(c.id, "PUBLISHED")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                    <CheckCircle size={12} /> Republier
                  </button>
                  <button onClick={() => doAction(c.id, "DRAFT")} disabled={processing === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
                    <RotateCcw size={12} /> Brouillon
                  </button>
                </>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL DÉTAIL ══ */}
      {modal === "detail" && selected && (
        <ModalWrap title={selected.title} onClose={() => { setModal(null); setDetail(null) }}>
          {!detail ? (
            <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
          ) : (
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Inscrits",   value: detail._count.enrollments },
                  { label: "Chapitres",  value: detail._count.chapters },
                  { label: "Avis",       value: detail._count.reviews },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-ink">{s.value}</div>
                    <div className="text-xs text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Formateur</p>
                <p className="text-sm font-semibold text-ink">{detail.instructor.name}</p>
                <p className="text-xs text-zinc-400">{detail.instructor.email}</p>
              </div>

              {detail.description && (
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Description</p>
                  <p className="text-sm text-zinc-700 bg-zinc-50 rounded-xl p-4">{detail.description}</p>
                </div>
              )}

              {detail.chapters.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-2">
                    Programme — {detail.chapters.length} chapitres · {detail.chapters.reduce((s, c) => s + c.lessons.length, 0)} leçons
                  </p>
                  <div className="space-y-2">
                    {detail.chapters.map(ch => (
                      <div key={ch.id} className="bg-zinc-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-ink mb-2">
                          Ch.{ch.order} — {ch.title} ({ch.lessons.length} leçons)
                        </p>
                        <div className="space-y-1">
                          {ch.lessons.map(l => (
                            <div key={l.id} className="flex items-center gap-2 text-xs text-zinc-500">
                              {l.isFree ? <Play size={11} className="text-emerald-500" /> : <Lock size={11} />}
                              <span>{l.title}</span>
                              {l.duration > 0 && <span className="ml-auto">{l.duration} min</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalWrap>
      )}

      {/* ══ MODAL REFUS ══ */}
      {modal === "reject" && selected && (
        <ModalWrap title="Refuser la formation" onClose={() => { setModal(null); setRejectReason("") }}>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800">{selected.title}</p>
              <p className="text-xs text-red-600">Par {selected.instructor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Motif du refus <span className="text-red-500">*</span>
              </label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4}
                placeholder="Expliquez pourquoi ce cours est refusé. Le formateur recevra ce message..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-red-400 resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setModal(null); setRejectReason("") }}
                className="flex-1 py-2.5 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">
                Annuler
              </button>
              <button onClick={() => doAction(selected.id, "REJECTED", { rejectReason })}
                disabled={!rejectReason.trim() || processing === selected.id}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {processing === selected.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Confirmer le refus
              </button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* ══ MODAL ASSIGNER ══ */}
      {modal === "assign" && selected && (
        <ModalWrap title="Assigner à un formateur" onClose={() => { setModal(null); setAssignTo("") }}>
          <div className="space-y-4">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-ink">{selected.title}</p>
              <p className="text-xs text-violet-700">Formateur actuel : {selected.instructor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Nouveau formateur</label>
              <select value={assignTo} onChange={e => setAssignTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 bg-white">
                <option value="">Sélectionner un formateur</option>
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>{i.name} — {i.email}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setModal(null); setAssignTo("") }}
                className="flex-1 py-2.5 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">
                Annuler
              </button>
              <button onClick={doAssign} disabled={!assignTo || processing === selected.id}
                className="flex-1 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {processing === selected.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Assigner
              </button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  )
}

function ModalWrap({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h3 className="font-bold text-ink truncate">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
