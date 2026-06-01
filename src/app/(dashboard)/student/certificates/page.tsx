"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Award, Download, ExternalLink, Loader2, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

type Certificate = {
  id: string
  certCode: string
  issuedAt: string
  course: {
    title: string
    category: string
    instructor: { name: string | null }
  }
}

const categoryLabels: Record<string, string> = {
  INFORMATIQUE:  "Informatique",
  IA_DATA:       "IA & Data",
  DEVELOPPEMENT: "Développement",
  COMMUNICATION: "Communication",
  EMPLOYABILITE: "Employabilité",
  MARKETING:     "Marketing",
  DESIGN:        "Design",
  LANGUES:       "Langues",
}

const gradients: Record<string, string> = {
  INFORMATIQUE:  "from-violet-600 to-violet-900",
  IA_DATA:       "from-blue-600 to-indigo-900",
  DEVELOPPEMENT: "from-emerald-600 to-teal-900",
  COMMUNICATION: "from-pink-600 to-rose-900",
  EMPLOYABILITE: "from-amber-500 to-orange-800",
  MARKETING:     "from-cyan-600 to-blue-800",
  DESIGN:        "from-purple-600 to-pink-800",
  LANGUES:       "from-orange-500 to-red-700",
}

export default function CertificatesPage() {
  const { data: session } = useSession()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/certificates")
      .then(r => r.json())
      .then(data => {
        setCertificates(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Mes Certificats
        </h1>
        <p className="text-zinc-500 mt-1">
          {certificates.length > 0
            ? `${certificates.length} certificat${certificates.length > 1 ? "s" : ""} obtenu${certificates.length > 1 ? "s" : ""}`
            : "Terminez un cours pour obtenir votre premier certificat."
          }
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">Aucun certificat pour le moment</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
            Terminez toutes les leçons d&apos;un cours pour obtenir votre certificat vérifiable.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"
          >
            Explorer le catalogue <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              userName={session?.user?.name || "Apprenant"}
            />
          ))}
        </div>
      )}

    </div>
  )
}

function CertificateCard({
  certificate,
  userName,
}: {
  certificate: Certificate
  userName: string
}) {
  const date = new Date(certificate.issuedAt).toLocaleDateString("fr-FR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  })

  const handleDownload = () => {
    const canvas = document.createElement("canvas")
    canvas.width  = 1200
    canvas.height = 850
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fond
    ctx.fillStyle = "#0A0A0A"
    ctx.fillRect(0, 0, 1200, 850)

    // Bande décorative haut
    ctx.fillStyle = "#7C3AED"
    ctx.fillRect(0, 0, 1200, 8)

    // Bordure intérieure
    ctx.strokeStyle = "#2A2A2F"
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, 1140, 790)

    // Logo "A"
    ctx.fillStyle = "#7C3AED"
    ctx.beginPath()
    ctx.roundRect(80, 70, 60, 60, 12)
    ctx.fill()
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 36px Arial"
    ctx.textAlign = "center"
    ctx.fillText("A", 110, 112)

    // Nom plateforme
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Access Career", 160, 112)

    ctx.fillStyle = "#71717A"
    ctx.font = "14px Arial"
    ctx.fillText("Un département de Digital Access", 160, 135)

    // Titre certificat
    ctx.fillStyle = "#8B5CF6"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("CERTIFICAT DE COMPLÉTION", 600, 240)

    // Ligne décorative
    ctx.strokeStyle = "#2A2A2F"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(200, 260)
    ctx.lineTo(1000, 260)
    ctx.stroke()

    // Texte certifie
    ctx.fillStyle = "#A1A1AA"
    ctx.font = "18px Arial"
    ctx.fillText("Ce certificat est décerné à", 600, 320)

    // Nom de l'apprenant
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 52px Arial"
    ctx.fillText(userName, 600, 400)

    // Ligne décorative sous nom
    ctx.strokeStyle = "#7C3AED"
    ctx.lineWidth = 2
    const nameWidth = ctx.measureText(userName).width
    ctx.beginPath()
    ctx.moveTo(600 - nameWidth / 2, 420)
    ctx.lineTo(600 + nameWidth / 2, 420)
    ctx.stroke()

    // Texte "pour avoir complété"
    ctx.fillStyle = "#A1A1AA"
    ctx.font = "18px Arial"
    ctx.fillText("pour avoir complété avec succès la formation", 600, 470)

    // Titre du cours
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 28px Arial"
    const courseTitle = certificate.course.title
    if (ctx.measureText(courseTitle).width > 900) {
      ctx.font = "bold 22px Arial"
    }
    ctx.fillText(courseTitle, 600, 530)

    // Catégorie
    ctx.fillStyle = "#8B5CF6"
    ctx.font = "bold 14px Arial"
    ctx.fillText(categoryLabels[certificate.course.category] || certificate.course.category, 600, 565)

    // Ligne décorative
    ctx.strokeStyle = "#2A2A2F"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(200, 600)
    ctx.lineTo(1000, 600)
    ctx.stroke()

    // Infos bas
    ctx.fillStyle = "#71717A"
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Formateur : ${certificate.course.instructor.name || "Access Career"}`, 100, 660)
    ctx.fillText(`Date de délivrance : ${date}`, 100, 690)

    ctx.textAlign = "right"
    ctx.fillText(`Code de vérification : ${certificate.certCode}`, 1100, 660)
    ctx.fillText("access-career-blush.vercel.app/verify", 1100, 690)

    // Bande décorative bas
    ctx.fillStyle = "#7C3AED"
    ctx.fillRect(0, 842, 1200, 8)

    // Télécharger
    const link = document.createElement("a")
    link.download = `certificat-access-career-${certificate.certCode}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-violet-300 transition">
      {/* Aperçu visuel du certificat */}
      <div className={`bg-gradient-to-br ${gradients[certificate.course.category] || "from-zinc-700 to-zinc-900"} p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">A</span>
            </div>
            <span className="text-white/80 text-sm font-semibold">Access Career</span>
          </div>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
            Certificat de complétion
          </p>
          <p className="text-white text-xs mb-1">Décerné à</p>
          <p className="text-white font-extrabold text-2xl mb-4">{userName}</p>
          <p className="text-white/70 text-xs mb-1">Pour avoir complété</p>
          <p className="text-white font-bold text-base leading-snug">
            {certificate.course.title}
          </p>
        </div>
      </div>

      {/* Infos + actions */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Catégorie</p>
            <span className="text-xs font-bold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">
              {categoryLabels[certificate.course.category]}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Délivré le</p>
            <p className="text-xs font-semibold text-ink">{date}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-zinc-50 rounded-xl">
          <p className="text-xs text-zinc-500 mb-1">Code de vérification</p>
          <p className="text-xs font-mono font-bold text-ink tracking-wider">
            {certificate.certCode}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition"
          >
            <Download size={15} /> Télécharger
          </button>
          <Link
            href={`/verify/${certificate.certCode}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-xl hover:border-ink hover:text-ink transition"
          >
            <ExternalLink size={15} /> Vérifier
          </Link>
        </div>
      </div>
    </div>
  )
}
