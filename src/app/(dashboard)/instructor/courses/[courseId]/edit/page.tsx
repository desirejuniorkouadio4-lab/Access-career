"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Plus, Trash2, Edit, Save, ChevronDown,
  ChevronRight, Play, Eye, Loader2, FileText, Video,
  X, Check, HelpCircle, Send
} from "lucide-react"

type Lesson = {
  id: string; title: string; content: string | null
  videoUrl: string | null; duration: number; isFree: boolean; order: number
}
type Chapter = { id: string; title: string; order: number; lessons: Lesson[] }
type Course  = {
  id: string; title: string; slug: string; status: string
  chapters: Chapter[]
}

export default function EditCoursePage() {
  const params    = useParams()
  const courseId  = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId as string
  const router    = useRouter()

  const [course, setCourse]           = useState<Course | null>(null)
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [openChapter, setOpenChapter] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [msg, setMsg]                 = useState({ text: "", ok: true })

  // Nouveau chapitre
  const [newChapter, setNewChapter]   = useState("")
  const [addingChapter, setAddingChapter] = useState(false)

  // Nouvelle leçon
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null)
  const [newLesson, setNewLesson]     = useState({ title: "", content: "", videoUrl: "", duration: 15, isFree: false })

  // Édition leçon
  const [editLesson, setEditLesson]   = useState({ title: "", content: "", videoUrl: "", duration: 15, isFree: false })

  const showMsg = (text: string, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3000)
  }

  const fetchCourse = useCallback(async () => {
    if (!courseId) return
    const res = await fetch(`/api/instructor/courses/${courseId}`)
    if (!res.ok) { router.push("/instructor/courses"); return }
    const data = await res.json()
    setCourse(data)
    if (data.chapters?.length > 0 && !openChapter) setOpenChapter(data.chapters[0].id)
    setLoading(false)
  }, [courseId, router])

  useEffect(() => { fetchCourse() }, [fetchCourse])

  const handleAddChapter = async () => {
    if (!newChapter.trim()) return
    setAddingChapter(true)
    await fetch(`/api/instructor/courses/${courseId}/chapters`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newChapter }),
    })
    setNewChapter(""); showMsg("Chapitre ajouté !")
    await fetchCourse(); setAddingChapter(false)
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Supprimer ce chapitre et toutes ses leçons ?")) return
    await fetch(`/api/instructor/courses/${courseId}/chapters`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    })
    showMsg("Chapitre supprimé."); await fetchCourse()
  }

  const handleAddLesson = async (chapterId: string) => {
    if (!newLesson.title.trim()) return
    setSaving(true)
    await fetch(`/api/instructor/courses/${courseId}/lessons`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newLesson, chapterId }),
    })
    setNewLesson({ title: "", content: "", videoUrl: "", duration: 15, isFree: false })
    setAddingLessonTo(null); showMsg("Leçon ajoutée !"); await fetchCourse(); setSaving(false)
  }

  const handleUpdateLesson = async (lessonId: string) => {
    setSaving(true)
    await fetch(`/api/instructor/courses/${courseId}/lessons`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, ...editLesson }),
    })
    setEditingLesson(null); showMsg("Leçon mise à jour !"); await fetchCourse(); setSaving(false)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Supprimer cette leçon ?")) return
    await fetch(`/api/instructor/courses/${courseId}/lessons`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    })
    showMsg("Leçon supprimée."); await fetchCourse()
  }

  const handleSubmitForReview = async () => {
    const res = await fetch(`/api/instructor/courses/${courseId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PENDING" }),
    })
    if (res.ok) { showMsg("Cours soumis à validation !"); await fetchCourse() }
    else showMsg("Erreur lors de la soumission.", false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-violet-600" />
    </div>
  )
  if (!course) return null

  const totalLessons = course.chapters.reduce((s, c) => s + c.lessons.length, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-ink">{course.title}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {course.chapters.length} chapitres · {totalLessons} leçons ·{" "}
              <span className={
                course.status === "PUBLISHED" ? "text-emerald-600 font-semibold"
                : course.status === "PENDING"  ? "text-amber-600 font-semibold"
                : "text-zinc-500"
              }>
                {course.status === "PUBLISHED" ? "Publié" : course.status === "PENDING" ? "En attente de validation" : "Brouillon"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/instructor/courses/${courseId}/quiz`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-200 transition">
            <HelpCircle size={15} /> Quiz
          </Link>
          {course.status === "DRAFT" && totalLessons > 0 && (
            <button onClick={handleSubmitForReview}
              className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
              <Send size={15} /> Soumettre à validation
            </button>
          )}
        </div>
      </div>

      {/* Message feedback */}
      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Chapitres */}
      <div className="space-y-4">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {/* Header chapitre */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
              <button onClick={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)}>
                {openChapter === chapter.id ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
              </button>
              <div className="w-7 h-7 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                {chapter.order}
              </div>
              <span className="text-sm font-bold text-ink flex-1">{chapter.title}</span>
              <span className="text-xs text-zinc-400">{chapter.lessons.length} leçon{chapter.lessons.length > 1 ? "s" : ""}</span>
              <button onClick={() => handleDeleteChapter(chapter.id)}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={14} />
              </button>
            </div>

            {/* Leçons */}
            {openChapter === chapter.id && (
              <div>
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id}>
                    {editingLesson === lesson.id ? (
                      <div className="px-5 py-4 bg-violet-50 border-b border-zinc-100 space-y-3">
                        <input value={editLesson.title} onChange={e => setEditLesson({ ...editLesson, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                          placeholder="Titre de la leçon" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={editLesson.videoUrl} onChange={e => setEditLesson({ ...editLesson, videoUrl: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                            placeholder="URL YouTube" />
                          <input type="number" value={editLesson.duration} onChange={e => setEditLesson({ ...editLesson, duration: parseInt(e.target.value) || 0 })}
                            className="px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                            placeholder="Durée (min)" />
                        </div>
                        <textarea value={editLesson.content} onChange={e => setEditLesson({ ...editLesson, content: e.target.value })}
                          rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none"
                          placeholder="Contenu texte de la leçon..." />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editLesson.isFree} onChange={e => setEditLesson({ ...editLesson, isFree: e.target.checked })} className="accent-violet-600" />
                          <span className="text-xs font-semibold text-ink">Aperçu gratuit</span>
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateLesson(lesson.id)} disabled={saving}
                            className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 text-white text-xs font-semibold rounded-lg hover:bg-violet-800 transition">
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Enregistrer
                          </button>
                          <button onClick={() => setEditingLesson(null)}
                            className="px-4 py-2 text-xs font-semibold text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50">
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-50 hover:bg-zinc-50/50 transition group">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.videoUrl ? "bg-violet-100 text-violet-600" : lesson.content ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-400"}`}>
                          {lesson.videoUrl ? <Video size={13} /> : lesson.content ? <FileText size={13} /> : <Play size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink font-medium truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.duration > 0 && <span className="text-xs text-zinc-400">{lesson.duration} min</span>}
                            {lesson.isFree && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Gratuit</span>}
                            {lesson.videoUrl && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">Vidéo</span>}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => { setEditingLesson(lesson.id); setEditLesson({ title: lesson.title, content: lesson.content || "", videoUrl: lesson.videoUrl || "", duration: lesson.duration, isFree: lesson.isFree }) }}
                            className="p-1.5 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition">
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Formulaire ajout leçon */}
                {addingLessonTo === chapter.id ? (
                  <div className="px-5 py-4 bg-blue-50 space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Nouvelle leçon</p>
                    <input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                      placeholder="Titre de la leçon *" autoFocus />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                        placeholder="URL YouTube (optionnel)" />
                      <input type="number" value={newLesson.duration} onChange={e => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })}
                        className="px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600"
                        placeholder="Durée (min)" />
                    </div>
                    <textarea value={newLesson.content} onChange={e => setNewLesson({ ...newLesson, content: e.target.value })}
                      rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm outline-none focus:border-violet-600 resize-none"
                      placeholder="Contenu texte (optionnel)" />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newLesson.isFree} onChange={e => setNewLesson({ ...newLesson, isFree: e.target.checked })} className="accent-violet-600" />
                      <span className="text-xs font-semibold text-ink">Aperçu gratuit (visible sans inscription)</span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => handleAddLesson(chapter.id)} disabled={saving || !newLesson.title.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 text-white text-xs font-semibold rounded-lg hover:bg-violet-800 transition disabled:opacity-50">
                        {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Ajouter
                      </button>
                      <button onClick={() => setAddingLessonTo(null)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingLessonTo(chapter.id)}
                    className="w-full flex items-center gap-2 px-5 py-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 transition">
                    <Plus size={14} /> Ajouter une leçon
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ajouter un chapitre */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-300 p-5">
        <p className="text-xs font-bold text-zinc-400 uppercase mb-3">Nouveau chapitre</p>
        <div className="flex gap-3">
          <input value={newChapter} onChange={e => setNewChapter(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddChapter()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600"
            placeholder="Titre du chapitre..." />
          <button onClick={handleAddChapter} disabled={addingChapter || !newChapter.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition disabled:opacity-50">
            {addingChapter ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
