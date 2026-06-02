"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard, BookOpen, Search, Award, User, Settings,
  LogOut, GraduationCap, PlusCircle, Users, BarChart3,
  FolderOpen, Shield, X, Star, TrendingUp, FileText,
  Briefcase, UserCheck, HelpCircle, MessageSquare, Flag,
} from "lucide-react"

const studentMenu = [
  { label: "Dashboard",    href: "/student",              icon: LayoutDashboard },
  { label: "Mes cours",    href: "/student/courses",      icon: BookOpen },
  { label: "Catalogue",    href: "/catalogue",            icon: Search },
  { label: "Devoirs",      href: "/student/assignments",  icon: FileText },
  { label: "Quiz",         href: "/student/quizzes",      icon: HelpCircle },
  { label: "Certificats",  href: "/student/certificates", icon: Award },
  { label: "Portfolio",    href: "/student/portfolio",    icon: Briefcase },
  { label: "Mon profil",   href: "/student/profile",      icon: User },
]

const instructorMenu = [
  { label: "Dashboard",      href: "/instructor",             icon: LayoutDashboard },
  { label: "Mes cours",      href: "/instructor/courses",     icon: FolderOpen },
  { label: "Créer un cours", href: "/instructor/courses/new", icon: PlusCircle },
  { label: "Apprenants",     href: "/instructor/students",    icon: Users },
  { label: "Corrections",    href: "/instructor/corrections", icon: FileText },
  { label: "Revenus",        href: "/instructor/revenue",     icon: BarChart3 },
  { label: "Mon profil",     href: "/instructor/profile",     icon: User },
]

const moderatorMenu = [
  { label: "Dashboard",    href: "/moderator",           icon: LayoutDashboard },
  { label: "Signalements", href: "/moderator/reports",   icon: Flag },
  { label: "Forums",       href: "/moderator/forums",    icon: MessageSquare },
  { label: "Mon profil",   href: "/moderator/profile",   icon: User },
]

const adminMenu = [
  { label: "Dashboard",           href: "/admin",             icon: LayoutDashboard },
  { label: "Utilisateurs",        href: "/admin/users",       icon: Users },
  { label: "Rôles & Candidatures",href: "/admin/roles",       icon: UserCheck },
  { label: "Formations",          href: "/admin/courses",     icon: BookOpen },
  { label: "Catégories",          href: "/admin/categories",  icon: FolderOpen },
  { label: "Certificats",         href: "/admin/certificates",icon: Award },
  { label: "Avis",                href: "/admin/reviews",     icon: Star },
  { label: "Signalements",        href: "/admin/reports",     icon: Shield },
  { label: "Paiements",           href: "/admin/payments",    icon: TrendingUp },
  { label: "Analytics",           href: "/admin/analytics",   icon: BarChart3 },
  { label: "Paramètres",          href: "/admin/settings",    icon: Settings },
]

interface SidebarProps {
  user: { name?: string | null; email?: string | null; role?: string }
  open: boolean
  onClose: () => void
}

export default function Sidebar({ user, open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const role = user.role || "STUDENT"

  const menu =
    role === "ADMIN"      ? adminMenu
    : role === "INSTRUCTOR" ? instructorMenu
    : role === "MODERATOR"  ? moderatorMenu
    : studentMenu

  const roleLabel =
    role === "ADMIN"      ? "Administrateur"
    : role === "INSTRUCTOR" ? "Formateur"
    : role === "MODERATOR"  ? "Modérateur"
    : "Apprenant"

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-ink text-white flex flex-col z-50 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-extrabold text-sm">A</div>
            <span className="font-extrabold text-base">Access Career</span>
          </Link>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name || "Utilisateur"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <GraduationCap size={12} className="text-violet-400" />
                <span className="text-xs text-violet-400 font-medium">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href.length > 10 && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-violet-700 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition w-full"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  )
}
