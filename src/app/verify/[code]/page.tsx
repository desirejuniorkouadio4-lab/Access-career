"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2, Award, ArrowLeft } from "lucide-react"

type CertInfo = {
  valid: boolean
  studentName?: string
  courseTitle?: string
  category?: string
  instructorName?: string
  issuedAt?: string
}

export default function VerifyPage() {
  const { code } = useParams()
  const [result, setResult] = useState<CertInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    fetch(`/api/certificates/verify?code=${code}`)
      .then(r => r.json())
      .then(data => { setResult(data); setLoading(false) })
      .catch(() => { setResult({ valid: false }); setLoading(false) })
  }, [code])

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="bg-ink text-white px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-extrabold text-sm">A</div>
        <span className="font-extrabold text-base">Access Career</span>
        <span className="text-zinc-500 text-sm ml-2">· Vérification de certificat</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl border border-zinc-200 p-10 max-w-lg w-full shadow-sm text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-400">
              <Loader2 size={32} className="animate-spin text-violet-600" />
              <p className="text-sm">Vérification en cours...</p>
            </div>
          ) : result?.valid ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-ink mb-1">Certificat Valide</h1>
              <p className="text-zinc-500 text-sm mb-8">
                Ce certificat a été délivré par Access Career et est authentique.
              </p>

              <div className="bg-zinc-50 rounded-xl p-5 text-left space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Apprenant</span>
                  <span className="text-sm font-bold text-ink">{result.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Formation</span>
                  <span className="text-sm font-bold text-ink text-right max-w-[60%]">{result.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Formateur</span>
                  <span className="text-sm font-semibold text-ink">{result.instructorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Délivré le</span>
                  <span className="text-sm font-semibold text-ink">
                    {new Date(result.issuedAt!).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200">
                  <span className="text-xs text-zinc-500">Code</span>
                  <span className="text-xs font-mono font-bold text-violet-700">{code}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Award size={14} className="text-violet-500" />
                Certifié par Access Career — Digital Access · Côte d&apos;Ivoire
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-ink mb-2">Certificat Invalide</h1>
              <p className="text-zinc-500 text-sm mb-8">
                Ce code de vérification ne correspond à aucun certificat dans notre système.
              </p>
              <p className="text-xs text-zinc-400">
                Code vérifié : <span className="font-mono font-bold text-ink">{code}</span>
              </p>
            </>
          )}

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:underline"
          >
            <ArrowLeft size={15} /> Retour à Access Career
          </Link>
        </div>
      </div>
    </div>
  )
}
