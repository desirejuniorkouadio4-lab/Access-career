import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google"
import Providers from "@/components/providers"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Access Career — Apprendre. Évoluer. Réussir.",
  description:
    "La plateforme e-learning de référence en Côte d'Ivoire. Formations en Tech, IA, Business, Communication et plus.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${jakarta.variable} ${instrument.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
