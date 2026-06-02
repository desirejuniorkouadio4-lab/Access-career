"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Users, Search, RefreshCw, Plus, Edit, Trash2, Eye,
  Shield, GraduationCap, BookOpen, Award, Loader2,
  X, Check, AlertTriangle, UserCheck
} from "lucide-react"

type User = {
  id: string; name: string | null; email: string | null; phone: string | null
  role: string; createdAt: string
  _count: { enrollments: number; courses: number; certificates: number }
}

const roles = ["STUDENT", "INSTRUCTOR", "MODERATOR", "ADMIN"]
const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  ADMIN:      { label: "Admin",       color: "bg-violet-100 text-violet-700",  icon: Shield },
  INSTRUCTOR: { label: "Formateur",   color: "bg-blue-100 text-blue-700",      icon: GraduationCap },
  STUDENT:    { label: "Étudiant",    color: "bg-emerald-100 text-emerald-700", icon: BookOpen },
  MODERATOR:  { label: "Modérateur",  color: "bg-amber-100 text-amber-700",    icon: UserCheck },
}

type Modal = "create" | "edit" | "detail" | "delete" | null

export default function AdminUsersPage() {
  const [users, setUsers]           = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [filterRole, setFilterRole] = useState("ALL")
  const [modal, setModal]           = useState<Modal>(null)
  const [selected, setSelected]     = useState<User | null>(null)
  const [detail, setDetail]         = useState<any>(null)
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState("")

  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "STUDENT", phone: "" })
  const [editForm, setEditForm]     = useState({ name: "", email: "", phone: "", role: "" })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterRole !== "ALL") params.set("role", filterRole)
    if (search) params.set("search", search)
    const r = await fetch(`/api/admin/users?${params}`)
    const d = await r.json()
    setUsers(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [filterRole, search])

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [fetchUsers])

  const fetchDetail = async (userId: string) => {
    const r = await fetch(`/api/admin/users/${userId}`)
    setDetail(await r.json())
  }

  const handleCreate = async () => {
    setSaving(true); setMsg("")
    const r = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    })
    const d = await r.json()
    if (r.ok) {
      setMsg("Compte créé !")
      setCreateForm({ name: "", email: "", password: "", role: "STUDENT", phone: "" })
      setModal(null); await fetchUsers()
    } else setMsg(d.error || "Erreur")
    setSaving(false)
  }

  const handleEdit = async () => {
    if (!selected) return
    setSaving(true); setMsg("")
    const r = await fetch("/api/admin/users", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected.id, ...editForm }),
    })
    if (r.ok) { setModal(null); await fetchUsers() }
    else { const d = await r.json(); setMsg(d.error || "Erreur") }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!selected) return
    setSaving(true)
    await fetch("/api/admin/users", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected.id }),
    })
    setModal(null); setSelected(null); await fetchUsers(); setSaving(false)
  }

  const openEdit = (u: User) => {
    setSelected(u)
    setEditForm({ name: u.name || "", email: u.email || "", phone: u.phone || "", role: u.role })
    setMsg(""); setModal("edit")
  }

  const openDetail = async (u: User) => {
    setSelected(u); setDetail(null); setModal("detail")
    await fetchDetail(u.id)
  }

  const openDelete = (u: User) => { setSelected(u); setModal("delete") }
  const closeModal = () => { setModal(null); setSelected(null); setDetail(null); setMsg("") }

  const filteredCount = { total: users.length }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Gestion des utilisateurs</h1>
          <p className="text-zinc-500 text-sm mt-1">{users.length} utilisateur{users.length > 1 ? "s" : ""} au total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
            <RefreshCw size={15} /> Actualiser
          </button>
          <button onClick={() => { setMsg(""); setModal("create") }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition">
            <Plus size={15} /> Créer un compte
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-zinc-300 rounded-xl px-4 py-2.5 bg-white">
          <Search size={16} className="text-zinc-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..."
            className="flex-1 text-sm outline-none bg-transparent" />
          {search && <button onClick={() => setSearch("")}><X size={14} className="text-zinc-400" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...roles].map((r) => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${filterRole === r ? "bg-violet-700 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-violet-300"}`}>
              {r === "ALL" ? "Tous" : roleConfig[r]?.label}
              {" "}({r === "ALL" ? users.length : users.filter(u => u.role === r).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-16 text-zinc-400">
          <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Rôle</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Activité</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Inscrit</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-zinc-400 text-sm">Aucun utilisateur trouvé.</td></tr>
                )}
                {users.map((u) => {
                  const rc = roleConfig[u.role]
                  const RoleIcon = rc?.icon || Users
                  return (
                    <tr key={u.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-semibold text-ink">{u.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-sm text-zinc-500">{u.email}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${rc?.color}`}>
                          <RoleIcon size={11} /> {rc?.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1"><BookOpen size={11} /> {u._count.enrollments} cours</span>
                          <span className="flex items-center gap-1"><Award size={11} /> {u._count.certificates} certif.</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-xs text-zinc-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetail(u)} title="Voir l'activité"
                            className="p-1.5 text-zinc-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => openEdit(u)} title="Modifier"
                            className="p-1.5 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => openDelete(u)} title="Supprimer"
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ MODAL CRÉER ══ */}
      {modal === "create" && (
        <ModalWrapper title="Créer un compte" onClose={closeModal}>
          <div className="space-y-3">
            {[
              { label: "Nom complet *", key: "name", type: "text", placeholder: "Ex : Yasmine KOUADIO" },
              { label: "Email *", key: "email", type: "email", placeholder: "email@exemple.com" },
              { label: "Mot de passe *", key: "password", type: "password", placeholder: "Minimum 8 caractères" },
              { label: "Téléphone", key: "phone", type: "text", placeholder: "+225 07 00 00 00" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">{f.label}</label>
                <input type={f.type} value={(createForm as any)[f.key]} placeholder={f.placeholder}
                  onChange={(e) => setCreateForm({ ...createForm, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Rôle</label>
              <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 bg-white">
                {roles.map(r => <option key={r} value={r}>{roleConfig[r].label}</option>)}
              </select>
            </div>
            {msg && <p className={`text-sm font-semibold ${msg.includes("Erreur") || msg.includes("existe") ? "text-red-600" : "text-emerald-600"}`}>{msg}</p>}
            <div className="flex gap-2 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">Annuler</button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Créer
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* ══ MODAL MODIFIER ══ */}
      {modal === "edit" && selected && (
        <ModalWrapper title={`Modifier — ${selected.name}`} onClose={closeModal}>
          <div className="space-y-3">
            {[
              { label: "Nom complet", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Téléphone", key: "phone", type: "text" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">{f.label}</label>
                <input type={f.type} value={(editForm as any)[f.key]}
                  onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Rôle</label>
              <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-violet-600 bg-white">
                {roles.map(r => <option key={r} value={r}>{roleConfig[r].label}</option>)}
              </select>
            </div>
            {msg && <p className="text-sm text-red-600 font-semibold">{msg}</p>}
            <div className="flex gap-2 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">Annuler</button>
              <button onClick={handleEdit} disabled={saving}
                className="flex-1 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Enregistrer
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* ══ MODAL ACTIVITÉ ══ */}
      {modal === "detail" && selected && (
        <ModalWrapper title={`Activité — ${selected.name}`} onClose={closeModal} wide>
          {!detail ? (
            <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-violet-600" /></div>
          ) : (
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Cours inscrits", value: detail.enrollments?.length || 0, icon: BookOpen },
                  { label: "Certificats", value: detail.certificates?.length || 0, icon: Award },
                  { label: "Cours créés", value: detail.courses?.length || 0, icon: GraduationCap },
                ].map((s) => (
                  <div key={s.label} className="bg-zinc-50 rounded-xl p-3 text-center">
                    <s.icon size={16} className="text-violet-600 mx-auto mb-1" />
                    <div className="text-xl font-extrabold text-ink">{s.value}</div>
                    <div className="text-[11px] text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {detail.enrollments?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Formations suivies</h3>
                  <div className="space-y-2">
                    {detail.enrollments.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-2.5">
                        <span className="text-sm text-ink">{e.course.title}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-600 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                          </div>
                          <span className="text-xs font-bold text-violet-700">{Math.round(e.progress || 0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.certificates?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Certificats obtenus</h3>
                  <div className="space-y-2">
                    {detail.certificates.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-2.5">
                        <span className="text-sm text-ink">{c.course.title}</span>
                        <span className="text-xs font-mono text-emerald-700">{c.certCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.bio && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Bio</h3>
                  <p className="text-sm text-zinc-600 bg-zinc-50 rounded-xl p-4">{detail.bio}</p>
                </div>
              )}
            </div>
          )}
        </ModalWrapper>
      )}

      {/* ══ MODAL SUPPRIMER ══ */}
      {modal === "delete" && selected && (
        <ModalWrapper title="Supprimer le compte" onClose={closeModal}>
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Supprimer <strong>{selected.name}</strong> ?</p>
              <p className="text-xs text-zinc-500 mt-1">
                Cette action est irréversible. Toutes les données associées seront supprimées
                (inscriptions, progression, certificats).
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-zinc-300 text-sm font-semibold text-zinc-600 rounded-xl">Annuler</button>
              <button onClick={handleDelete} disabled={saving}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Supprimer définitivement
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  )
}

function ModalWrapper({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h3 className="font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
