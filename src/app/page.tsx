"use client"

import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Search, ArrowRight, BookOpen, Award, Users, Clock, Star, Monitor, Bot, Code, Megaphone, Target, BarChart3 } from "lucide-react"

const categories = [
  { icon: Monitor, name: "Informatique", count: 22, color: "bg-violet-50 text-violet-700" },
  { icon: Bot, name: "IA & Data", count: 18, color: "bg-blue-50 text-blue-700" },
  { icon: Code, name: "Développement", count: 20, color: "bg-emerald-50 text-emerald-700" },
  { icon: Megaphone, name: "Communication", count: 15, color: "bg-pink-50 text-pink-700" },
  { icon: Target, name: "Employabilité", count: 14, color: "bg-amber-50 text-amber-700" },
  { icon: BarChart3, name: "Marketing", count: 12, color: "bg-cyan-50 text-cyan-700" },
]

const courses = [
  { title: "Excel : du tableau de base aux formules avancées", category: "Informatique", level: "Intermédiaire", duration: "20h", rating: 4.9, students: "1 240", price: "15 000 F", isFree: false, gradient: "from-violet-600 to-violet-900" },
  { title: "ChatGPT, Copilot & IA générative au travail", category: "IA & Data", level: "Débutant", duration: "12h", rating: 4.9, students: "890", price: "12 000 F", isFree: false, gradient: "from-blue-600 to-indigo-900" },
  { title: "Comprendre l'IA sans être informaticien", category: "IA & Data", level: "Débutant", duration: "5h", rating: 4.9, students: "2 100", price: null, isFree: true, gradient: "from-blue-500 to-purple-800" },
  { title: "Prise de parole en public : vaincre le trac", category: "Communication", level: "Débutant", duration: "14h", rating: 4.9, students: "1 050", price: "18 000 F", isFree: false, gradient: "from-pink-600 to-rose-900" },
  { title: "Rédiger un CV et une lettre qui attirent", category: "Employabilité", level: "Débutant", duration: "4h", rating: 4.9, students: "3 200", price: null, isFree: true, gradient: "from-amber-500 to-orange-800" },
  { title: "Devenir Développeur Full-Stack en 16 semaines", category: "Tech & Digital", level: "Intermédiaire", duration: "120h", rating: 4.8, students: "640", price: "45 000 F", isFree: false, gradient: "from-emerald-600 to-teal-900" },
]

const features = [
  { icon: BookOpen, num: "01", title: "Apprentissage par projet", desc: "Construisez un portfolio concret avec des projets réels à montrer aux recruteurs." },
  { icon: Users, num: "02", title: "Mentorat individuel", desc: "Un mentor expert vous accompagne avec des sessions hebdomadaires en visio." },
  { icon: Award, num: "03", title: "Certification reconnue", desc: "Certificats vérifiables QR code, reconnus par notre réseau de partenaires en Afrique de l'Ouest." },
  { icon: Clock, num: "04", title: "Accès à vie", desc: "Une fois inscrit, gardez accès au contenu et aux mises à jour pour toujours." },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-violet-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Colonne gauche : texte */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 border border-violet-100 rounded-full text-xs font-semibold text-violet-800 mb-6">
                <span className="w-1.5 h-1.5 bg-violet-600 rounded-full" />
                Un département de Digital Access
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-ink mb-6">
                Apprenez ce qui
                <br />
                compte{" "}
                <span className="font-serif italic text-violet-700">vraiment</span>
                <br />
                pour votre carrière.
              </h1>

              <p className="text-lg text-zinc-500 max-w-xl mb-9 leading-relaxed">
                Des formations conçues par des experts, certifiées et accessibles
                partout en Afrique. Tech, Business, Langues — choisissez votre voie.
              </p>

              <div className="flex max-w-xl border-2 border-ink rounded-xl p-1.5 shadow-[5px_5px_0_0_#7C3AED]">
                <div className="flex items-center gap-3 flex-1 px-4">
                  <Search size={18} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Que voulez-vous apprendre aujourd'hui ?"
                    className="flex-1 py-3 text-sm outline-none bg-transparent placeholder:text-zinc-400"
                  />
                </div>
                <button className="flex items-center gap-2 bg-ink text-white px-6 rounded-lg text-sm font-semibold hover:bg-violet-700 transition">
                  Explorer <ArrowRight size={15} />
                </button>
              </div>

              <div className="flex gap-10 mt-12 pt-8 border-t border-zinc-200">
                {[
                  ["120+", "Formations"],
                  ["5 000+", "Apprenants"],
                  ["40+", "Formateurs"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <div className="font-serif text-4xl text-ink">
                      <span className="text-violet-700">{num}</span>
                    </div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite : cartes visuelles flottantes */}
            <div className="relative h-[520px] hidden lg:block">
              {/* Carte 1 : Tech & Digital */}
              <div className="absolute top-0 right-0 w-[300px] bg-white rounded-2xl border border-zinc-200 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="h-[130px] bg-gradient-to-br from-violet-500 to-violet-800 rounded-t-2xl" />
                <div className="p-5">
                  <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wider mb-2">
                    Tech & Digital
                  </p>
                  <h3 className="text-[15px] font-bold text-ink mb-3">
                    Maîtriser React et Next.js
                  </h3>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>8 semaines</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Star size={11} fill="currentColor" /> 4.9
                    </span>
                  </div>
                </div>
              </div>

              {/* Carte 2 : Business */}
              <div className="absolute bottom-10 left-0 w-[270px] bg-white rounded-2xl border border-zinc-200 shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="h-[120px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-t-2xl" />
                <div className="p-5">
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                    Business
                  </p>
                  <h3 className="text-[15px] font-bold text-ink mb-3">
                    Marketing digital pour PME
                  </h3>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>6 semaines</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Star size={11} fill="currentColor" /> 4.8
                    </span>
                  </div>
                </div>
              </div>

              {/* Carte 3 : Badge violet */}
              <div className="absolute top-[200px] right-[70px] w-[210px] bg-violet-700 rounded-2xl p-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <p className="font-serif italic text-2xl text-white leading-tight mb-3">
                  + 5 000
                  <br />
                  apprenants
                </p>
                <p className="text-sm text-violet-200">
                  déjà certifiés
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BARRE DE CONFIANCE ══ */}
      <div className="border-y border-zinc-200 bg-zinc-50/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-12 flex-wrap">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Ils nous font confiance
          </span>
          {["EduWeb", "CAFOP", "iZEN Foundation", "Digital Access"].map((name) => (
            <span
              key={name}
              className="font-serif text-xl text-zinc-600 opacity-60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ══ CATÉGORIES ══ */}
      <section id="catalogue" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <p className="text-xs font-bold text-violet-700 uppercase tracking-widest mb-3">
            Catalogue
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-ink">
            Six domaines pour{" "}
            <span className="font-serif italic text-violet-700">
              tracer votre voie
            </span>
            .
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative bg-white border border-zinc-200 rounded-2xl p-7 cursor-pointer hover:border-ink hover:-translate-y-1 transition-all"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-violet-700 rounded-t-2xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${cat.color}`}
              >
                <cat.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{cat.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">
                Parcourez nos formations dans ce domaine.
              </p>
              <span className="text-sm font-semibold text-violet-700 flex items-center gap-1">
                {cat.count} formations <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COURS PHARES ══ */}
      <section id="parcours" className="bg-ink">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-14">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">
              Formations phares
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white">
              Apprenez avec les{" "}
              <span className="font-serif italic text-violet-400">meilleurs</span>.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div
                key={i}
                className="bg-ink-2 rounded-2xl border border-zinc-800 overflow-hidden hover:border-violet-500 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div
                  className={`h-40 bg-gradient-to-br ${course.gradient} relative flex items-end p-5`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="relative font-serif italic text-xl text-white leading-tight">
                    {course.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {course.isFree ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-900/40 text-emerald-400 rounded">
                        GRATUIT
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-violet-900/40 text-violet-400 rounded">
                        PAYANT
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-4 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 pt-4 border-t border-zinc-800">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {course.rating}
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span>{course.duration}</span>
                    <span className="text-zinc-700">·</span>
                    <span>{course.students} inscrits</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    {course.isFree ? (
                      <span className="text-sm font-bold text-emerald-400">
                        Gratuit
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-violet-400">
                        {course.price} CFA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POURQUOI NOUS ══ */}
      <section id="pourquoi" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <p className="text-xs font-bold text-violet-700 uppercase tracking-widest mb-3">
            Notre approche
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-ink">
            Pensée pour{" "}
            <span className="font-serif italic text-violet-700">
              votre réussite
            </span>
            .
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.num}>
              <div className="font-serif italic text-5xl text-violet-700 mb-5">
                {f.num}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative bg-ink rounded-3xl px-10 py-20 text-center overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] bg-violet-700/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] bg-violet-600/30 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-2xl mx-auto">
              Prêt à transformer{" "}
              <span className="font-serif italic text-violet-400">
                votre carrière
              </span>{" "}
              ?
            </h2>
            <p className="text-lg text-zinc-400 max-w-lg mx-auto mb-9">
              Rejoignez plus de 5 000 apprenants. Premier cours gratuit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-xl hover:bg-violet-500 hover:text-white transition"
              >
                Commencer gratuitement <ArrowRight size={16} />
              </Link>
              <Link
                href="#catalogue"
                className="px-8 py-4 text-white font-semibold border border-zinc-700 rounded-xl hover:border-white transition"
              >
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
