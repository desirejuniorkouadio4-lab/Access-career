import Link from "next/link"

const columns = [
  {
    title: "Formations",
    links: ["Tech & Digital", "IA & Data", "Communication", "Employabilité", "Marketing", "Design"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Pour entreprises", "Devenir formateur", "Partenariats"],
  },
  {
    title: "Ressources",
    links: ["Blog", "Centre d'aide", "Communauté", "Webinaires"],
  },
  {
    title: "Légal",
    links: ["Conditions", "Confidentialité", "Cookies", "Contact"],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-zinc-300 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center text-white font-extrabold text-xs">
                A
              </div>
              <span className="text-white font-extrabold text-lg">Access Career</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
              La plateforme e-learning de Digital Access. Formations certifiées accessibles partout en Afrique.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-violet-400 transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 pt-7 flex flex-wrap justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; 2026 Access Career — Digital Access. Tous droits réservés.</p>
          <p>Abidjan · Côte d&apos;Ivoire</p>
        </div>
      </div>
    </footer>
  )
}
