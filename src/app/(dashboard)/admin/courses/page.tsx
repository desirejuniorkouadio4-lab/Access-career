"use client"

import { useEffect, useState } from "react"
import {
  BookOpen, Search, CheckCircle, Clock, Edit, XCircle,
  Trash2, Loader2, Users, RefreshCw, UserPlus, Eye
} from "lucide-react"
import Link from "next/link"

type Instructor = { id: string; name: string | null; email: string | null }
type Course = {
  id: string; title: string; slug: string; category: string
  level: string; price: number; isFree: boolean; status: string; createdAt: string
  instructor: Instructor
  _count: { enrollments: number; chapters: number }
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PUBLISHED: { label: "Publié",     color: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
  PENDING:   { label: "En attente", color: "bg-amber-50 text-amber-700",    icon: Clock },
  DRAFT:     { label: "Brouillon",  color: "bg-zinc-100 text-zinc-500",     icon: Edit },
  ARCHIVED:  { label: "Archivé",    color: "bg-red-50 text-red-500",        icon: XCircle },
}

const categoryLabels: Record<string, string> = {
  INFORMATIQUE: "Informatique", IA_DATA: "IA & Data", DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication", EMPLOYABILITE: "Employabilité", MARKETING: "Marketing",
  DESIGN: "Design", LANGUES: "Langues",
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [filterCategory, setFilterCategory] = useState("ALL")
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const [coursesRes, usersRes] = await Promise.all([
      fetch("/api/admin/courses"),
      fetch("/api/admin/users"),
    ])
    const coursesData = await coursesRes.json()
    const usersData = await usersRes.json()
    setCourses(Array.isArray(coursesData) ? coursesData : [])
    setInstructors(Array.isArray(usersData) ? usersData.filter((u: any) => u.role === "INSTRUCTOR" || u.role === "ADMIN") : [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleStatus = async (courseId: string, status: string) => {
    setActionLoading(courseId)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status }),
    })
    await fetchData()
    setActionLoading(null)
  }

  const handleAssign = async (courseId: string, instructorId: string) => {
    setActionLoading(courseId)
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, instructorId }),
    })
    setAssigningId(null)
    await fetchData()
    setActionLoading(null)
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm("Supprimer définitivement ce cours et toutes ses données ?")) return
    setActionLoading(courseId)
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    })
    await fetchData()
    setActionLoading(null)
  }

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "ALL" || c.status === filterStatus
    const matchCat = filterCategory === "ALL" || c.category === filterCategory
    return matchSearch && matchStatus && matchCat
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Gestion des cours</h1>
          <p className="text-zinc-500 text-sm mt-1">{courses.length} cours sur la plateforme.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
        <div className="flex items-center gap-2 border border-zinc-300 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-zinc-400" />
          <input type="text" placeholder="Rechercher un cours ou un formateur..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "PUBLISHED", "PENDING", "DRAFT", "ARCHIVED"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === s ? "bg-violet-700 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              {s === "ALL" ? "Tous" : statusConfig[s]?.label}
            </button>
          ))}
          <div className="w-px bg-zinc-200 mx-1" />
          {["ALL", ...Object.keys(categoryLabels)].map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterCategory === c ? "bg-ink text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              {c === "ALL" ? "Toutes" : categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-zinc-400 text-sm">Aucun cours trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Cours</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden lg:table-cell">Formateur</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden md:table-cell">Inscrits</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Statut</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => {
                  const sc = statusConfig[course.status] || statusConfig.DRAFT
                  const StatusIcon = sc.icon
                  return (
                    <tr key={course.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-ink truncate max-w-[280px]">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{categoryLabels[course.category]}</span>
                          {course.isFree
                            ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Gratuit</span>
                            : <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">{course.price.toLocaleString("fr-FR")} F</span>
                          }
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {assigningId === course.id ? (
                          <select
                            defaultValue={course.instructor.id}
                            onChange={(e) => handleAssign(course.id, e.target.value)}
                            className="text-xs border border-zinc-300 rounded-lg px-2 py-1.5 outline-none focus:border-violet-600 bg-white font-semibold"
                          >
                            {instructors.map((inst) => (
                              <option key={inst.id} value={inst.id}>{inst.name}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-600">{course.instructor.name}</span>
                            <button onClick={() => setAssigningId(course.id)}
                              className="p-1 text-zinc-400 hover:text-violet-700 rounded transition" title="Changer le formateur">
                              <UserPlus size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm font-semibold text-ink flex items-center gap-1">
                          <Users size={13} className="text-zinc-400" /> {course._count.enrollments}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
                          <StatusIcon size={10} /> {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {actionLoading === course.id ? (
                          <Loader2 size={16} className="animate-spin text-violet-600" />
                        ) : (
                          <div className="flex items-center gap-1">
                            {course.status !== "PUBLISHED" && (
                              <button onClick={() => handleStatus(course.id, "PUBLISHED")}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Publier">
                                <CheckCircle size={15} />
                              </button>
                            )}
                            {course.status === "PUBLISHED" && (
                              <button onClick={() => handleStatus(course.id, "ARCHIVED")}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Archiver">
                                <XCircle size={15} />
                              </button>
                            )}
                            <Link href={`/cours/${course.slug}`}
                              className="p-1.5 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition" title="Voir">
                              <Eye size={15} />
                            </Link>
                            <button onClick={() => handleDelete(course.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Supprimer">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
