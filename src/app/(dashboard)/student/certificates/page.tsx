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
    canvas.width  = 1400
    canvas.height = 990
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── Fond blanc cassé
    ctx.fillStyle = "#FDFCF8"
    ctx.fillRect(0, 0, 1400, 990)

    // ── Bordure extérieure violette épaisse
    ctx.strokeStyle = "#6D28D9"
    ctx.lineWidth = 14
    ctx.strokeRect(7, 7, 1386, 976)

    // ── Bordure intérieure fine dorée
    ctx.strokeStyle = "#C4B5FD"
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, 1340, 930)

    // ── Coins décoratifs
    const drawCorner = (x: number, y: number, rx: number, ry: number) => {
      ctx.strokeStyle = "#6D28D9"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, y + ry * 0.4)
      ctx.lineTo(x, y)
      ctx.lineTo(x + rx * 0.4, y)
      ctx.stroke()
    }
    drawCorner(30, 30, 40, 40)
    drawCorner(1370, 30, -40, 40)
    drawCorner(30, 960, 40, -40)
    drawCorner(1370, 960, -40, -40)

    // ── Bande décorative haut violette
    const grad = ctx.createLinearGradient(0, 0, 1400, 0)
    grad.addColorStop(0, "#4C1D95")
    grad.addColorStop(0.5, "#7C3AED")
    grad.addColorStop(1, "#4C1D95")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1400, 10)
    ctx.fillRect(0, 980, 1400, 10)

    // ── Logo + Nom plateforme
    ctx.fillStyle = "#6D28D9"
    ctx.beginPath()
    ctx.roundRect(90, 65, 58, 58, 12)
    ctx.fill()
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 32px Georgia"
    ctx.textAlign = "center"
    ctx.fillText("A", 119, 105)

    ctx.fillStyle = "#1A1A2E"
    ctx.font = "bold 26px Georgia"
    ctx.textAlign = "left"
    ctx.fillText("Access Career", 165, 97)
    ctx.fillStyle = "#6D28D9"
    ctx.font = "13px Arial"
    ctx.fillText("Un département de Digital Access · Côte d'Ivoire", 165, 118)

    // ── Titre principal
    ctx.fillStyle = "#6D28D9"
    ctx.font = "bold 15px Arial"
    ctx.textAlign = "center"
    ctx.letterSpacing = "4px"
    ctx.fillText("CERTIFICAT  DE  COMPLÉTION", 700, 200)

    // ── Ligne décorative sous le titre
    ctx.strokeStyle = "#E9D5FF"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(250, 220)
    ctx.lineTo(1150, 220)
    ctx.stroke()

    // ── Ornement central
    ctx.fillStyle = "#EDE9FE"
    ctx.beginPath()
    ctx.arc(700, 260, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#6D28D9"
    ctx.font = "bold 20px Georgia"
    ctx.textAlign = "center"
    ctx.fillText("✦", 700, 268)

    // ── Texte "Nous certifions que"
    ctx.fillStyle = "#71717A"
    ctx.font = "italic 20px Georgia"
    ctx.textAlign = "center"
    ctx.fillText("Nous certifions que", 700, 330)

    // ── Nom de l'apprenant
    ctx.fillStyle = "#1A1A2E"
    ctx.font = "bold 72px Georgia"
    ctx.textAlign = "center"
    ctx.fillText(userName, 700, 430)

    // ── Ligne élégante sous le nom
    const nw = ctx.measureText(userName).width
    const lx = 700 - Math.min(nw, 700) / 2
    const lw = Math.min(nw, 700)
    const lineGrad = ctx.createLinearGradient(lx, 0, lx + lw, 0)
    lineGrad.addColorStop(0, "transparent")
    lineGrad.addColorStop(0.2, "#6D28D9")
    lineGrad.addColorStop(0.8, "#6D28D9")
    lineGrad.addColorStop(1, "transparent")
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(lx, 448)
    ctx.lineTo(lx + lw, 448)
    ctx.stroke()

    // ── Texte "a complété avec succès"
    ctx.fillStyle = "#71717A"
    ctx.font = "italic 20px Georgia"
    ctx.textAlign = "center"
    ctx.fillText("a complété avec succès la formation", 700, 500)

    // ── Titre du cours
    ctx.fillStyle = "#1A1A2E"
    let courseFont = "bold 36px Georgia"
    ctx.font = courseFont
    while (ctx.measureText(certificate.course.title).width > 1000 && parseInt(courseFont) > 22) {
      const size = parseInt(courseFont) - 2
      courseFont = `bold ${size}px Georgia`
      ctx.font = courseFont
    }
    ctx.textAlign = "center"
    ctx.fillText(certificate.course.title, 700, 565)

    // ── Badge catégorie
    const catText = (categoryLabels[certificate.course.category] || certificate.course.category).toUpperCase()
    const catW = ctx.measureText(catText).width + 48
    ctx.font = "bold 13px Arial"
    const catTextW = ctx.measureText(catText).width
    ctx.fillStyle = "#EDE9FE"
    ctx.beginPath()
    ctx.roundRect(700 - catW / 2, 590, catW, 34, 17)
    ctx.fill()
    ctx.fillStyle = "#6D28D9"
    ctx.textAlign = "center"
    ctx.fillText(catText, 700, 613)

    // ── Ligne séparatrice
    ctx.strokeStyle = "#E9D5FF"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(200, 660)
    ctx.lineTo(1200, 660)
    ctx.stroke()

    // ── Zone signatures (3 colonnes)
    // Colonne gauche : Formateur
    ctx.fillStyle = "#1A1A2E"
    ctx.font = "bold 16px Georgia"
    ctx.textAlign = "center"
    ctx.fillText(certificate.course.instructor.name || "Access Career", 340, 720)
    ctx.strokeStyle = "#D4D4D8"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(200, 700); ctx.lineTo(480, 700); ctx.stroke()
    ctx.fillStyle = "#71717A"
    ctx.font = "12px Arial"
    ctx.fillText("Formateur", 340, 745)

    // Colonne centre : Sceau
    ctx.strokeStyle = "#6D28D9"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(700, 715, 42, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = "#C4B5FD"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(700, 715, 36, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = "#6D28D9"
    ctx.font = "bold 13px Arial"
    ctx.textAlign = "center"
    ctx.fillText("ACCESS", 700, 710)
    ctx.fillText("CAREER", 700, 727)

    // Colonne droite : Directeur
    ctx.fillStyle = "#1A1A2E"
    ctx.font = "bold 16px Georgia"
    ctx.textAlign = "center"
    ctx.fillText("Digital Access", 1060, 720)
    ctx.strokeStyle = "#D4D4D8"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(920, 700); ctx.lineTo(1200, 700); ctx.stroke()
    ctx.fillStyle = "#71717A"
    ctx.font = "12px Arial"
    ctx.fillText("Organisme certificateur", 1060, 745)

    // ── Footer : date + code
    ctx.fillStyle = "#A1A1AA"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Délivré le " + date, 90, 910)
    ctx.textAlign = "right"
    ctx.fillText("Code de vérification : " + certificate.certCode, 1310, 910)
    ctx.fillStyle = "#C4B5FD"
    ctx.textAlign = "center"
    ctx.fillText("Ce certificat peut être vérifié sur access-career-blush.vercel.app/verify", 700, 935)

    // ── Téléchargement
    const link = document.createElement("a")
    link.download = `certificat-${certificate.certCode}.png`
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
