"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Sidebar from "@/components/dashboard/sidebar"
import { Menu, Bell } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name,
    email: session?.user?.email,
    role: (session?.user as any)?.role || "STUDENT",
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-zinc-600 hover:text-ink"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-sm font-semibold text-zinc-500 hidden sm:block">
              Bienvenue, <span className="text-ink">{user.name?.split(" ")[0]}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-zinc-400 hover:text-ink transition">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
