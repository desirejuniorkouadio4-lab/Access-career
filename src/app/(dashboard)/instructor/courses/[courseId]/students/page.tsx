"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Loader2, CheckCircle, Clock } from "lucide-react"

type Enrollment = {
  id: string; progress: number; completedAt: string | null; enrolledAt: string
  user: { name: string | null; email: string | null }
}

export default function CourseStudentsPage() {
  const { courseId } = useParams()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [courseName, setCourseName] = useState("")

  useEffect(() => {
    fetch(`/api/instructor/courses/${courseId}`)
      .then(r => r.json())
      .then(d => {
        setCourseName(d.title || "")
        setEnrollments(d.enrollments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [courseId])

  const completed = enrollments.filter(e => e.completedAt).length
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/instructor/courses" className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-xl transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Apprenants inscrits</h1>
          <p className="text-sm text-zinc-500">{courseName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Inscrits",       value: enrollments.length, icon: Users,       color: "bg-violet-50 text-violet-700" },
          { label: "Terminé",         value: completed,          icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
          { label: "Progression moy.", value: `${avgProgress}%`,  icon: Clock,       color: "bg-blue-50 text-blue-700" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-200 p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.color}`}>
              <s.icon size={16} />
            </div>
            <div className="text-xl font-extrabold text-ink">{s.value}</div>
            <div className="text-xs text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <Users size={28} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun apprenant inscrit pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Apprenant</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden md:table-cell">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Progression</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase hidden sm:table-cell">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 text-xs font-bold">
                        {e.user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-semibold text-ink">{e.user.name}</span>
                      {e.completedAt && <CheckCircle size={13} className="text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-sm text-zinc-500">{e.user.email}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${e.completedAt ? "bg-emerald-500" : "bg-violet-600"}`} style={{ width: `${e.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink">{Math.round(e.progress)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-xs text-zinc-400">
                    {new Date(e.enrolledAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
