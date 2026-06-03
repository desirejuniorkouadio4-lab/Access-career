import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ reply: "Connexion requise." })
    }

    const { message, courseTitle, lessonTitle, lessonContent } = await req.json()
    if (!message) {
      return NextResponse.json({ reply: "Message vide." })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: "L'assistant IA n'est pas encore configuré. L'administrateur doit ajouter la variable ANTHROPIC_API_KEY dans les paramètres Vercel pour activer cette fonctionnalité.",
      })
    }

    const systemPrompt = `Tu es l'assistant pédagogique d'Access Career, une plateforme e-learning en Côte d'Ivoire.

Contexte du cours : "${courseTitle || "Non précisé"}"
Leçon actuelle : "${lessonTitle || "Non précisée"}"
${lessonContent ? `Contenu de la leçon :\n${lessonContent.substring(0, 2000)}` : ""}

Règles :
- Réponds en français, de manière claire et pédagogique
- Adapte tes explications au niveau de l'apprenant
- Donne des exemples concrets liés au contexte africain quand c'est pertinent
- Si la question sort du sujet du cours, recadre poliment
- Sois encourageant et motivant
- Garde tes réponses concises (max 300 mots)`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      }),
    })

    if (!response.ok) {
      console.error("[AI_CHAT] API Error:", response.status)
      return NextResponse.json({
        reply: "L'assistant est temporairement indisponible. Réessayez dans quelques instants.",
      })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || "Je n'ai pas pu générer de réponse."

    return NextResponse.json({ reply })
  } catch (e) {
    console.error("[AI_CHAT]", e)
    return NextResponse.json({
      reply: "Une erreur est survenue. Vérifiez que la clé API est configurée dans Vercel.",
    })
  }
}
