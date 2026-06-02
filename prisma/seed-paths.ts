import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

function slug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

async function main() {
  console.log("🛤️ Seeding career paths...")

  const paths = [
    {
      title: "Devenir Assistant Digital",
      description: "Maîtrisez les outils bureautiques et numériques essentiels pour évoluer dans un environnement professionnel moderne. Ce parcours couvre Excel, Word, Google Workspace, la sécurité en ligne et les bases de la communication digitale.",
      professionalGoal: "Assistant(e) administratif(ve) digital(e)",
      level: "BEGINNER" as const,
      duration: "8 semaines",
      keywords: ["Windows", "Excel", "Word", "Google Workspace", "Sécurité"],
    },
    {
      title: "Devenir Développeur Full-Stack",
      description: "Apprenez à créer des applications web complètes, du frontend au backend. HTML/CSS, JavaScript, React, Node.js, bases de données et déploiement.",
      professionalGoal: "Développeur web junior",
      level: "INTERMEDIATE" as const,
      duration: "16 semaines",
      keywords: ["HTML/CSS", "JavaScript", "Full-Stack", "WordPress"],
    },
    {
      title: "Expert IA & Data",
      description: "Comprenez l'IA, maîtrisez ChatGPT et les outils d'IA générative, puis plongez dans la data science avec Python. De l'initiation à l'expertise.",
      professionalGoal: "Spécialiste IA / Data Analyst junior",
      level: "INTERMEDIATE" as const,
      duration: "12 semaines",
      keywords: ["IA", "ChatGPT", "Prompt Engineering", "Data Science"],
    },
    {
      title: "Booster sa Carrière",
      description: "Un parcours complet pour décrocher votre prochain emploi : CV, lettre de motivation, entretiens, LinkedIn et lancement d'activité.",
      professionalGoal: "Recherche d'emploi / Reconversion",
      level: "BEGINNER" as const,
      duration: "4 semaines",
      keywords: ["CV", "Entretien", "LinkedIn", "entreprise"],
    },
    {
      title: "Community Manager",
      description: "Devenez expert en gestion de communauté et marketing digital : réseaux sociaux, création de contenu, publicité en ligne et e-commerce.",
      professionalGoal: "Community Manager / Social Media Manager",
      level: "INTERMEDIATE" as const,
      duration: "10 semaines",
      keywords: ["Marketing", "Réseaux sociaux", "e-commerce"],
    },
    {
      title: "Leader & Communicant",
      description: "Développez votre leadership, apprenez à parler en public, maîtrisez la négociation et l'intelligence émotionnelle pour diriger avec impact.",
      professionalGoal: "Manager / Chef d'équipe",
      level: "INTERMEDIATE" as const,
      duration: "8 semaines",
      keywords: ["Prise de parole", "négociation", "Leadership"],
    },
  ]

  for (const p of paths) {
    const existing = await db.careerPath.findUnique({ where: { slug: slug(p.title) } })
    if (existing) { console.log(`  → ${p.title} existe déjà`); continue }

    const careerPath = await db.careerPath.create({
      data: {
        title: p.title,
        slug: slug(p.title),
        description: p.description,
        professionalGoal: p.professionalGoal,
        level: p.level,
        duration: p.duration,
        status: "PUBLISHED",
      },
    })

    // Associer les cours correspondants par mots-clés
    const courses = await db.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: p.keywords.map(k => ({ title: { contains: k, mode: "insensitive" as const } })),
      },
      take: 6,
    })

    for (let i = 0; i < courses.length; i++) {
      await db.careerPathCourse.create({
        data: { careerPathId: careerPath.id, courseId: courses[i].id, sortOrder: i + 1 },
      }).catch(() => {})
    }

    console.log(`  ✅ ${p.title} — ${courses.length} cours associés`)
  }

  console.log("🏁 Parcours métiers créés !")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
