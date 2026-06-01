"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users, BookOpen, Clock, TrendingUp, UserCheck,
  ArrowRight, CheckCircle, XCircle, Eye
} from "lucide-react"

const stats = [
  { label: "Utilisateurs total", value: "127", icon: Users, color: "bg-violet-50 text-violet-700", trend: "+12 ce mois" },
  { label: "Cours publiés", value: "18", icon: BookOpen, color: "bg-emerald-50 text-emerald-700", trend: "En ligne" },
  { label: "En attente validation", value: "3", icon: Clock, color: "bg-amber-50 text-amber-700", trend: "À traiter" },
  { label: "Candidatures formateurs", value: "5", icon: UserCheck, color: "bg-blue-50 text-blue-700", trend: "Nouvelles" },
]

const pendingCourses = [
  { title: "Prompt Engineering avancé", instructor: "Kouassi Jean", category: "IA & Data", date: "30 Mai 2026" },
  { title: "Gestion de projet Agile", instructor: "Traoré Aminata", category: "Business", date: "29 Mai 2026" },
  { title: "Photographie pro avec smartphone", instructor: "Bamba Seydou", category: "Design", date: "28 Mai 2026" },
]

const pendingInstructors = [
  { name: "Kouassi Jean", expertise: "IA & Data", email: "jean@example.com", date: "30 Mai 2026" },
  { name: "Traoré Aminata", expertise: "Business & Management", email: "aminata@example.com", date: "29 Mai 2026" },
  { name: "Bamba Seydou", expertise: "Design & Photo", email: "seydou@example.com", date: "28 Mai 2026" },
]

const recentUsers = [
  { name: "Konan Aya", email: "aya@example.com", role: "STUDENT", date: "Aujourd'hui" },
  { name: "Diabaté Sékou", email: "sekou@example.com", role: "STUDENT", date: "Hier" },
  { name: "Marie Kouassi", email: "marie@example.com", role: "INSTRUCTOR", date: "28 Mai" },
  { name: "Oumar Diallo", email: "oumar@example.com", role: "STUDENT", date: "27 Mai" },
]

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  INSTRUCTOR: "bg-blue-100 text-blue-700",
  STUDENT: "bg-emerald-100 text-emerald-700",
  MODERATOR: "bg-amber-100 text-amber-700",
}

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Dashboard Administrateur
        </h1>
        <p className="text-zinc-500 mt-1">Vue d&apos;ensemble de la plateforme Access Career.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <TrendingUp size={14} className="text-zinc-300" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{stat.value}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{stat.label}</div>
            <div className="text-[11px] text-violet-600 font-semibold mt-2">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cours en attente */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <Clock size={16} className="text-amber-500" /> Cours à valider
            </h2>
            <Link href="/admin/courses" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {pendingCourses.map((course, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{course.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{course.instructor} · {course.category} · {course.date}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approuver">
                  <CheckCircle size={16} />
                </button>
                <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Rejeter">
                  <XCircle size={16} />
                </button>
                <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg transition" title="Voir">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Candidatures formateurs */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <UserCheck size={16} className="text-blue-500" /> Candidatures formateurs
            </h2>
            <Link href="/admin/instructors" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {pendingInstructors.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-50 last:border-0">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{item.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{item.expertise} · {item.date}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Accepter">
                  <CheckCircle size={16} />
                </button>
                <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Refuser">
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers utilisateurs */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="font-bold text-ink flex items-center gap-2">
            <Users size={16} className="text-violet-600" /> Derniers inscrits
          </h2>
          <Link href="/admin/users" className="text-xs font-semibold text-violet-700 flex items-center gap-1 hover:underline">
            Gérer les utilisateurs <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-zinc-50 border-b border-zinc-100">
                <th className="px-6 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Inscrit</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr key={i} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-ink">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-zinc-500">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-xs text-zinc-400">{user.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-semibold text-violet-700 hover:underline">
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
