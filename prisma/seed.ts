import { PrismaClient, Role, Category, Level, CourseStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

function slug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

async function main() {
  console.log("🌱 Seeding database...")

  const pwd = await bcrypt.hash("Test1234!", 12)

  // ══ UTILISATEURS ══
  const users = await Promise.all([
    db.user.upsert({ where: { email: "yasmine@accesscareer.ci" }, update: {}, create: { name: "Yasmine KOUADIO", email: "yasmine@accesscareer.ci", password: pwd, role: "INSTRUCTOR" as Role, bio: "Experte en IA et Data Science, 8 ans d'expérience en formation professionnelle." } }),
    db.user.upsert({ where: { email: "oumou@accesscareer.ci" }, update: {}, create: { name: "Oumou DIALLO", email: "oumou@accesscareer.ci", password: pwd, role: "INSTRUCTOR" as Role, bio: "Spécialiste en communication, leadership et développement personnel." } }),
    db.user.upsert({ where: { email: "zamble@accesscareer.ci" }, update: {}, create: { name: "Zamblé FRANCK", email: "zamble@accesscareer.ci", password: pwd, role: "STUDENT" as Role } }),
    db.user.upsert({ where: { email: "ange@accesscareer.ci" }, update: {}, create: { name: "Ange PAMELA", email: "ange@accesscareer.ci", password: pwd, role: "STUDENT" as Role } }),
    db.user.upsert({ where: { email: "roland@accesscareer.ci" }, update: {}, create: { name: "Roland GNABO", email: "roland@accesscareer.ci", password: pwd, role: "STUDENT" as Role } }),
    db.user.upsert({ where: { email: "anicet@accesscareer.ci" }, update: {}, create: { name: "Anicet KPAN", email: "anicet@accesscareer.ci", password: pwd, role: "MODERATOR" as Role } }),
  ])

  const yasmine = users[0]
  const oumou   = users[1]

  // ══ COURS ══
  const coursesData = [
    // ── INFORMATIQUE ──
    { title: "Windows 11 de A à Z pour débutants", cat: "INFORMATIQUE" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Apprenez à utiliser Windows 11 efficacement : navigation, paramètres, gestion de fichiers et personnalisation de votre PC.",
      chapters: [
        { title: "Découvrir Windows 11", lessons: [
          { title: "L'interface et le menu Démarrer", dur: 15, free: true, content: "Découvrez l'interface modernisée de Windows 11 : barre des tâches centrée, widgets, et navigation fluide." },
          { title: "Gérer les fichiers et dossiers", dur: 20, free: false, content: "Maîtrisez l'Explorateur de fichiers : créer, copier, déplacer et organiser vos documents." },
          { title: "Paramètres et personnalisation", dur: 15, free: false, content: "Personnalisez votre bureau, fond d'écran, thèmes et paramètres système." },
        ]},
        { title: "Productivité quotidienne", lessons: [
          { title: "Les raccourcis clavier essentiels", dur: 10, free: false, content: "Les 20 raccourcis Windows qui vous feront gagner du temps chaque jour." },
          { title: "Installer et gérer les applications", dur: 15, free: false, content: "Microsoft Store, installation de logiciels, désinstallation propre." },
          { title: "Sécurité et mises à jour", dur: 15, free: false, content: "Windows Defender, pare-feu, mises à jour automatiques et bonnes pratiques." },
        ]},
      ]},
    { title: "Excel : du tableau de base aux formules avancées", cat: "INFORMATIQUE" as Category, lvl: "INTERMEDIATE" as Level, price: 15000, free: false, inst: yasmine.id, desc: "Maîtrisez Excel de A à Z : saisie de données, formules, graphiques, tableaux croisés dynamiques et macros.",
      chapters: [
        { title: "Les fondamentaux d'Excel", lessons: [
          { title: "Interface et navigation dans Excel", dur: 15, free: true, content: "Découvrez le ruban, les onglets, les cellules et la navigation dans un classeur Excel." },
          { title: "Saisie et mise en forme des données", dur: 20, free: false, content: "Entrer des données, formater les cellules, bordures, couleurs et alignement." },
          { title: "Formules de base : SOMME, MOYENNE, SI", dur: 25, free: false, content: "Créez vos premières formules et comprenez les références de cellules." },
          { title: "Créer des graphiques", dur: 20, free: false, content: "Histogrammes, camemberts, courbes : visualisez vos données efficacement." },
        ]},
        { title: "Fonctions avancées", lessons: [
          { title: "RECHERCHEV et RECHERCHEH", dur: 25, free: false, content: "Rechercher des données dans de grands tableaux avec les fonctions de recherche." },
          { title: "Tableaux croisés dynamiques", dur: 30, free: false, content: "Analysez des milliers de lignes en quelques clics avec les TCD." },
          { title: "Mise en forme conditionnelle", dur: 15, free: false, content: "Colorez automatiquement vos cellules selon des règles personnalisées." },
          { title: "Introduction aux macros VBA", dur: 30, free: false, content: "Automatisez vos tâches répétitives avec les macros et le langage VBA." },
        ]},
        { title: "Projets pratiques", lessons: [
          { title: "Projet : Tableau de bord commercial", dur: 45, free: false, content: "Créez un dashboard de suivi des ventes avec graphiques et TCD." },
          { title: "Projet : Gestion de budget personnel", dur: 30, free: false, content: "Construisez un outil de suivi budgétaire mensuel automatisé." },
        ]},
      ]},
    { title: "Word : rédiger des documents professionnels", cat: "INFORMATIQUE" as Category, lvl: "BEGINNER" as Level, price: 8000, free: false, inst: yasmine.id, desc: "Créez des documents Word professionnels : mise en page, styles, tableaux, en-têtes et modèles.",
      chapters: [
        { title: "Bases de Word", lessons: [
          { title: "Interface et saisie de texte", dur: 15, free: true, content: "Découvrez Word : ruban, règle, barre d'état et premiers pas." },
          { title: "Mise en forme du texte", dur: 15, free: false, content: "Polices, tailles, gras, italique, couleurs et espacement." },
          { title: "Styles et sommaire automatique", dur: 20, free: false, content: "Utilisez les styles pour structurer vos documents et générer un sommaire." },
        ]},
        { title: "Documents avancés", lessons: [
          { title: "Tableaux et images", dur: 20, free: false, content: "Insérez et mettez en forme des tableaux et images dans vos documents." },
          { title: "En-têtes, pieds de page et numérotation", dur: 15, free: false, content: "Personnalisez vos en-têtes et gérez la numérotation des pages." },
          { title: "Modèles et publipostage", dur: 25, free: false, content: "Créez des modèles réutilisables et des courriers en série." },
        ]},
      ]},
    { title: "Google Workspace : Gmail, Drive, Docs, Sheets", cat: "INFORMATIQUE" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Maîtrisez les outils Google pour travailler efficacement en ligne et en équipe.",
      chapters: [
        { title: "Gmail et Google Drive", lessons: [
          { title: "Organiser sa boîte Gmail", dur: 15, free: true, content: "Labels, filtres, archivage et recherche avancée dans Gmail." },
          { title: "Google Drive : stocker et partager", dur: 15, free: true, content: "Organisez vos fichiers dans le cloud et partagez-les en équipe." },
        ]},
        { title: "Google Docs et Sheets", lessons: [
          { title: "Créer et collaborer sur Google Docs", dur: 20, free: true, content: "Rédaction collaborative en temps réel, commentaires et suggestions." },
          { title: "Google Sheets : les bases du tableur", dur: 20, free: true, content: "Formules, graphiques et partage dans Google Sheets." },
        ]},
      ]},
    { title: "PowerPoint : créer des présentations qui marquent", cat: "INFORMATIQUE" as Category, lvl: "INTERMEDIATE" as Level, price: 7500, free: false, inst: yasmine.id, desc: "Concevez des présentations impactantes avec PowerPoint : design, animations et storytelling visuel.",
      chapters: [
        { title: "Bases de PowerPoint", lessons: [
          { title: "Créer sa première présentation", dur: 15, free: true, content: "Interface, diapositives, thèmes et premiers pas avec PowerPoint." },
          { title: "Textes, images et mise en page", dur: 20, free: false, content: "Organisez vos contenus visuellement avec les outils de mise en page." },
        ]},
        { title: "Techniques avancées", lessons: [
          { title: "Animations et transitions", dur: 20, free: false, content: "Ajoutez du dynamisme à vos présentations sans en abuser." },
          { title: "Design professionnel et storytelling", dur: 25, free: false, content: "Les principes de design et de narration pour des présentations mémorables." },
        ]},
      ]},
    { title: "Sécurité en ligne : protéger ses données", cat: "INFORMATIQUE" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Protégez votre identité numérique, vos mots de passe et vos données personnelles en ligne.",
      chapters: [
        { title: "Les menaces en ligne", lessons: [
          { title: "Phishing, malwares et arnaques", dur: 15, free: true, content: "Reconnaître les tentatives de phishing et les logiciels malveillants." },
          { title: "Mots de passe sécurisés", dur: 10, free: true, content: "Créer et gérer des mots de passe robustes avec un gestionnaire." },
        ]},
        { title: "Bonnes pratiques", lessons: [
          { title: "Navigation sécurisée et VPN", dur: 15, free: true, content: "Naviguer en toute sécurité et comprendre l'utilité d'un VPN." },
          { title: "Protection des données personnelles", dur: 15, free: true, content: "RGPD, cookies, vie privée : vos droits et comment les exercer." },
        ]},
      ]},
    // ── IA & DATA ──
    { title: "Comprendre l'IA sans être informaticien", cat: "IA_DATA" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Une introduction claire et accessible à l'intelligence artificielle pour tous les professionnels.",
      chapters: [
        { title: "Qu'est-ce que l'IA ?", lessons: [
          { title: "Histoire et évolution de l'IA", dur: 15, free: true, content: "De Turing à ChatGPT : les grandes étapes de l'intelligence artificielle." },
          { title: "Types d'IA et applications", dur: 20, free: true, content: "IA faible, IA forte, machine learning, deep learning : de quoi parle-t-on ?" },
          { title: "L'IA dans votre quotidien", dur: 15, free: true, content: "Recommandations Netflix, GPS, reconnaissance faciale : l'IA est partout." },
        ]},
        { title: "L'IA au travail", lessons: [
          { title: "Métiers impactés par l'IA", dur: 15, free: true, content: "Quels métiers vont évoluer, disparaître ou apparaître avec l'IA ?" },
          { title: "Éthique et limites de l'IA", dur: 20, free: true, content: "Biais algorithmiques, vie privée, emploi : les enjeux éthiques." },
        ]},
      ]},
    { title: "ChatGPT, Copilot & IA générative au travail", cat: "IA_DATA" as Category, lvl: "BEGINNER" as Level, price: 12000, free: false, inst: yasmine.id, desc: "Apprenez à utiliser ChatGPT, Microsoft Copilot et les outils d'IA générative pour booster votre productivité.",
      chapters: [
        { title: "Premiers pas avec ChatGPT", lessons: [
          { title: "Créer un compte et naviguer dans l'interface", dur: 10, free: true, content: "Inscription, interface, modèles disponibles et premiers échanges." },
          { title: "L'art du prompt : obtenir les meilleures réponses", dur: 25, free: false, content: "Techniques pour formuler des prompts clairs, précis et efficaces." },
          { title: "Cas pratiques : emails, résumés, brainstorming", dur: 30, free: false, content: "Utilisez ChatGPT pour rédiger des emails, résumer des documents et générer des idées." },
        ]},
        { title: "IA générative avancée", lessons: [
          { title: "Microsoft Copilot dans Office 365", dur: 20, free: false, content: "Copilot dans Word, Excel, PowerPoint et Outlook : cas concrets." },
          { title: "Créer des images avec l'IA (DALL-E, Midjourney)", dur: 20, free: false, content: "Générez des visuels professionnels avec les IA d'image." },
          { title: "Automatiser avec l'IA (Zapier, Make)", dur: 25, free: false, content: "Connectez l'IA à vos outils pour automatiser des workflows." },
        ]},
        { title: "Projet final", lessons: [
          { title: "Projet : Créer un assistant virtuel pour son entreprise", dur: 40, free: false, content: "Concevez un assistant IA personnalisé pour répondre aux questions de vos clients." },
        ]},
      ]},
    { title: "Prompt Engineering : maîtriser l'art de parler aux IA", cat: "IA_DATA" as Category, lvl: "INTERMEDIATE" as Level, price: 15000, free: false, inst: yasmine.id, desc: "Devenez expert en formulation de prompts pour tirer le maximum des IA génératives.",
      chapters: [
        { title: "Fondamentaux du Prompt Engineering", lessons: [
          { title: "Anatomie d'un bon prompt", dur: 20, free: true, content: "Structure, contexte, contraintes : les composantes d'un prompt efficace." },
          { title: "Techniques avancées : Few-shot, Chain-of-Thought", dur: 25, free: false, content: "Exemples, raisonnement en chaîne et rôles pour des résultats précis." },
        ]},
        { title: "Applications professionnelles", lessons: [
          { title: "Prompts pour le marketing et la rédaction", dur: 20, free: false, content: "Créez du contenu marketing, des articles et des scripts vidéo." },
          { title: "Prompts pour l'analyse de données", dur: 25, free: false, content: "Analysez des tableaux, extrayez des insights et créez des rapports." },
          { title: "Prompts pour le code et l'automatisation", dur: 25, free: false, content: "Générez du code, débuguez et automatisez des tâches techniques." },
        ]},
      ]},
    { title: "Data Science avec Python : de zéro aux tableaux de bord", cat: "IA_DATA" as Category, lvl: "INTERMEDIATE" as Level, price: 25000, free: false, inst: yasmine.id, desc: "Apprenez Python pour la data science : pandas, matplotlib, visualisation et analyse de données.",
      chapters: [
        { title: "Python pour les données", lessons: [
          { title: "Installation de Python et Jupyter", dur: 20, free: true, content: "Installer Python, Anaconda et Jupyter Notebook sur votre machine." },
          { title: "Variables, listes et boucles", dur: 25, free: false, content: "Les bases de Python : types de données, structures et contrôle de flux." },
          { title: "Pandas : manipuler des données", dur: 30, free: false, content: "Charger, filtrer, transformer et analyser des données avec pandas." },
        ]},
        { title: "Visualisation et analyse", lessons: [
          { title: "Graphiques avec Matplotlib et Seaborn", dur: 25, free: false, content: "Créez des visualisations professionnelles de vos données." },
          { title: "Analyse exploratoire de données (EDA)", dur: 30, free: false, content: "Techniques d'analyse exploratoire pour comprendre vos datasets." },
          { title: "Projet : Dashboard de données", dur: 45, free: false, content: "Construisez un tableau de bord interactif avec Streamlit." },
        ]},
      ]},
    // ── DÉVELOPPEMENT ──
    { title: "HTML/CSS pour débutants", cat: "DEVELOPPEMENT" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Créez vos premières pages web avec HTML et CSS. Aucun prérequis nécessaire.",
      chapters: [
        { title: "HTML : la structure", lessons: [
          { title: "Votre première page HTML", dur: 15, free: true, content: "Balises, structure de base et affichage dans le navigateur." },
          { title: "Titres, paragraphes et liens", dur: 15, free: true, content: "Structurez votre contenu avec les balises texte et les liens." },
          { title: "Images, listes et tableaux", dur: 20, free: true, content: "Ajoutez des médias et des données structurées à vos pages." },
        ]},
        { title: "CSS : le style", lessons: [
          { title: "Sélecteurs et propriétés de base", dur: 20, free: true, content: "Couleurs, polices, marges et bordures avec CSS." },
          { title: "Flexbox et mise en page", dur: 25, free: false, content: "Disposez vos éléments facilement avec Flexbox." },
          { title: "Projet : Page de profil personnelle", dur: 30, free: false, content: "Créez votre propre page de profil web responsive." },
        ]},
      ]},
    { title: "JavaScript de zéro à héros", cat: "DEVELOPPEMENT" as Category, lvl: "INTERMEDIATE" as Level, price: 20000, free: false, inst: yasmine.id, desc: "Maîtrisez JavaScript pour créer des sites web interactifs et dynamiques.",
      chapters: [
        { title: "Les bases de JavaScript", lessons: [
          { title: "Variables, types et opérateurs", dur: 20, free: true, content: "Les fondamentaux du langage JavaScript." },
          { title: "Fonctions et conditions", dur: 20, free: false, content: "Créez des fonctions, gérez des conditions et des boucles." },
          { title: "Manipuler le DOM", dur: 25, free: false, content: "Modifiez dynamiquement le contenu de vos pages web." },
        ]},
        { title: "JavaScript avancé", lessons: [
          { title: "Tableaux, objets et méthodes", dur: 25, free: false, content: "Structures de données avancées et méthodes essentielles." },
          { title: "Programmation asynchrone (Fetch, Promises)", dur: 30, free: false, content: "Appels API, async/await et gestion des données distantes." },
          { title: "Projet : Application météo interactive", dur: 40, free: false, content: "Créez une app météo qui utilise une vraie API." },
        ]},
      ]},
    { title: "Développeur Full-Stack en 16 semaines", cat: "DEVELOPPEMENT" as Category, lvl: "INTERMEDIATE" as Level, price: 45000, free: false, inst: yasmine.id, desc: "Parcours complet : HTML/CSS, JavaScript, React, Node.js, bases de données. Sortez avec un portfolio de 5 projets.",
      chapters: [
        { title: "Frontend : React", lessons: [
          { title: "Introduction à React et JSX", dur: 25, free: true, content: "Composants, props et JSX : les bases de React." },
          { title: "State, hooks et événements", dur: 30, free: false, content: "Gérez l'état de vos composants avec useState et useEffect." },
          { title: "Routing et navigation (Next.js)", dur: 25, free: false, content: "Créez des applications multi-pages avec Next.js." },
        ]},
        { title: "Backend : Node.js", lessons: [
          { title: "Serveur Express.js", dur: 25, free: false, content: "Créez une API REST avec Node.js et Express." },
          { title: "Base de données avec Prisma", dur: 30, free: false, content: "Modélisez et interrogez votre base de données avec Prisma ORM." },
          { title: "Authentification et déploiement", dur: 30, free: false, content: "Sécurisez votre app et déployez-la en production." },
        ]},
        { title: "Projets portfolio", lessons: [
          { title: "Projet : Clone de Twitter", dur: 60, free: false, content: "Construisez un réseau social fonctionnel avec feed et likes." },
          { title: "Projet : E-commerce complet", dur: 60, free: false, content: "Boutique en ligne avec panier, paiement et tableau de bord." },
        ]},
      ]},
    { title: "WordPress sans coder", cat: "DEVELOPPEMENT" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Créez un site web professionnel avec WordPress, sans écrire une ligne de code.",
      chapters: [
        { title: "Installation et configuration", lessons: [
          { title: "Héberger et installer WordPress", dur: 20, free: true, content: "Choisir un hébergeur, installer WordPress et configurer les bases." },
          { title: "Thèmes et personnalisation", dur: 20, free: true, content: "Choisir et personnaliser un thème professionnel." },
        ]},
        { title: "Créer du contenu", lessons: [
          { title: "Pages, articles et menus", dur: 20, free: true, content: "Structurez votre site avec des pages et un menu de navigation." },
          { title: "Plugins essentiels", dur: 15, free: true, content: "SEO, sécurité, formulaires : les plugins indispensables." },
        ]},
      ]},
    // ── COMMUNICATION ──
    { title: "Prise de parole en public : vaincre le trac", cat: "COMMUNICATION" as Category, lvl: "BEGINNER" as Level, price: 18000, free: false, inst: oumou.id, desc: "Apprenez à parler en public avec confiance, structurer vos discours et captiver votre auditoire.",
      chapters: [
        { title: "Fondamentaux de l'oral", lessons: [
          { title: "Comprendre et gérer le trac", dur: 20, free: true, content: "Le stress est normal : techniques pour le transformer en énergie positive." },
          { title: "Posture, voix et regard", dur: 20, free: false, content: "Le langage corporel qui inspire confiance et autorité." },
          { title: "Structurer un discours impactant", dur: 25, free: false, content: "Introduction, développement, conclusion : la structure en 3 temps." },
        ]},
        { title: "Techniques avancées", lessons: [
          { title: "Le storytelling pour convaincre", dur: 25, free: false, content: "Racontez des histoires qui marquent les esprits et touchent les émotions." },
          { title: "Gérer les questions et objections", dur: 20, free: false, content: "Techniques pour répondre avec assurance, même aux questions pièges." },
          { title: "Exercice filmé : votre pitch en 3 minutes", dur: 30, free: false, content: "Préparez et enregistrez un pitch de 3 minutes avec feedback structuré." },
        ]},
      ]},
    { title: "Techniques de persuasion et négociation", cat: "COMMUNICATION" as Category, lvl: "INTERMEDIATE" as Level, price: 16000, free: false, inst: oumou.id, desc: "Maîtrisez l'art de convaincre et négocier dans un contexte professionnel.",
      chapters: [
        { title: "Principes de persuasion", lessons: [
          { title: "Les 6 leviers de la persuasion", dur: 20, free: true, content: "Réciprocité, engagement, preuve sociale : les principes de Cialdini." },
          { title: "Communication non-violente", dur: 20, free: false, content: "Exprimer ses besoins sans agressivité et obtenir l'adhésion." },
        ]},
        { title: "Négociation professionnelle", lessons: [
          { title: "Préparer une négociation", dur: 20, free: false, content: "BATNA, zone d'accord, arguments : préparez-vous avant de négocier." },
          { title: "Techniques de négociation gagnant-gagnant", dur: 25, free: false, content: "Créer de la valeur pour les deux parties dans une négociation." },
        ]},
      ]},
    { title: "Écrire avec impact : emails, rapports, messages pro", cat: "COMMUNICATION" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: oumou.id, desc: "Améliorez votre communication écrite professionnelle au quotidien.",
      chapters: [
        { title: "Les règles de l'écriture professionnelle", lessons: [
          { title: "Un email, un message clair", dur: 15, free: true, content: "Structure, objet, ton : les règles d'or de l'email professionnel." },
          { title: "Rédiger un rapport structuré", dur: 20, free: true, content: "Introduction, corps, conclusion, recommandations : le rapport efficace." },
          { title: "Messages courts et percutants (Slack, WhatsApp)", dur: 10, free: true, content: "Communiquer clairement en quelques lignes sur les messageries." },
        ]},
      ]},
    { title: "Leadership et intelligence émotionnelle", cat: "COMMUNICATION" as Category, lvl: "INTERMEDIATE" as Level, price: 20000, free: false, inst: oumou.id, desc: "Développez votre leadership et apprenez à gérer vos émotions et celles des autres.",
      chapters: [
        { title: "Intelligence émotionnelle", lessons: [
          { title: "Comprendre ses émotions", dur: 20, free: true, content: "Auto-conscience, auto-régulation : les bases de l'IE." },
          { title: "Empathie et relations interpersonnelles", dur: 20, free: false, content: "Développez votre capacité à comprendre les autres." },
        ]},
        { title: "Leadership", lessons: [
          { title: "Les styles de leadership", dur: 20, free: false, content: "Directif, participatif, délégatif : quel leader êtes-vous ?" },
          { title: "Motiver et inspirer une équipe", dur: 25, free: false, content: "Techniques concrètes pour engager et motiver vos collaborateurs." },
          { title: "Gestion des conflits", dur: 20, free: false, content: "Désamorcer les tensions et transformer les conflits en opportunités." },
        ]},
      ]},
    // ── EMPLOYABILITÉ ──
    { title: "Rédiger un CV et une lettre de motivation qui attirent", cat: "EMPLOYABILITE" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: oumou.id, desc: "Créez un CV et une lettre de motivation qui vous démarquent des autres candidats.",
      chapters: [
        { title: "Le CV parfait", lessons: [
          { title: "Structure et contenu d'un CV efficace", dur: 20, free: true, content: "Les rubriques essentielles, l'ordre chronologique inverse et les mots-clés." },
          { title: "Adapter son CV à chaque offre", dur: 15, free: true, content: "Personnalisez votre CV pour chaque candidature en 10 minutes." },
          { title: "Les erreurs fatales à éviter", dur: 10, free: true, content: "Les erreurs qui font jeter un CV en 6 secondes." },
        ]},
        { title: "La lettre de motivation", lessons: [
          { title: "Structure en 3 paragraphes", dur: 15, free: true, content: "Vous-Moi-Nous : la structure qui fonctionne à chaque fois." },
          { title: "Projet : Rédiger votre CV et votre lettre", dur: 30, free: true, content: "Mettez en pratique tout ce que vous avez appris." },
        ]},
      ]},
    { title: "Réussir ses entretiens d'embauche", cat: "EMPLOYABILITE" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: oumou.id, desc: "Préparez-vous aux entretiens d'embauche et marquez les recruteurs positivement.",
      chapters: [
        { title: "Avant l'entretien", lessons: [
          { title: "Rechercher l'entreprise et le poste", dur: 15, free: true, content: "Les informations clés à collecter avant chaque entretien." },
          { title: "Préparer ses réponses aux questions classiques", dur: 20, free: true, content: "Parlez-moi de vous, qualités/défauts, motivation : préparez tout." },
        ]},
        { title: "Pendant et après l'entretien", lessons: [
          { title: "Gérer le stress et faire bonne impression", dur: 15, free: true, content: "Les 30 premières secondes comptent : soignez votre entrée." },
          { title: "Négocier son salaire avec confiance", dur: 20, free: true, content: "Techniques pour aborder la question du salaire sereinement." },
          { title: "Le suivi post-entretien", dur: 10, free: true, content: "L'email de remerciement et la relance au bon moment." },
        ]},
      ]},
    { title: "LinkedIn : optimiser son profil et décrocher des opportunités", cat: "EMPLOYABILITE" as Category, lvl: "BEGINNER" as Level, price: 10000, free: false, inst: oumou.id, desc: "Transformez votre profil LinkedIn en aimant à opportunités professionnelles.",
      chapters: [
        { title: "Optimiser son profil", lessons: [
          { title: "Photo, bannière et titre percutant", dur: 15, free: true, content: "Les 3 éléments qui font cliquer un recruteur sur votre profil." },
          { title: "Résumé et expériences", dur: 20, free: false, content: "Racontez votre parcours avec des mots-clés et des chiffres." },
          { title: "Compétences et recommandations", dur: 15, free: false, content: "Choisissez les bonnes compétences et obtenez des recommandations." },
        ]},
        { title: "Stratégie LinkedIn", lessons: [
          { title: "Publier du contenu qui attire", dur: 20, free: false, content: "Types de posts, fréquence, hashtags : la stratégie éditoriale." },
          { title: "Réseau et messages de prospection", dur: 20, free: false, content: "Élargissez votre réseau et approchez les recruteurs efficacement." },
        ]},
      ]},
    { title: "Lancer son activité en Côte d'Ivoire", cat: "EMPLOYABILITE" as Category, lvl: "INTERMEDIATE" as Level, price: 20000, free: false, inst: oumou.id, desc: "Guide complet pour créer et lancer son entreprise en Côte d'Ivoire : statuts, financement, premiers clients.",
      chapters: [
        { title: "Préparer son projet", lessons: [
          { title: "Trouver son idée et valider son marché", dur: 25, free: true, content: "Techniques de validation : enquêtes, MVP et tests terrain." },
          { title: "Business plan simplifié", dur: 25, free: false, content: "Créez un business plan convaincant en une page." },
        ]},
        { title: "Créer officiellement", lessons: [
          { title: "Statuts juridiques en CI (SARL, SAS, EI)", dur: 20, free: false, content: "Choisir le bon statut juridique selon votre situation." },
          { title: "Démarches administratives (CEPICI, impôts)", dur: 20, free: false, content: "Les étapes concrètes pour immatriculer son entreprise." },
          { title: "Trouver ses premiers clients", dur: 25, free: false, content: "Stratégies gratuites et payantes pour décrocher vos premiers clients." },
        ]},
      ]},
    // ── MARKETING ──
    { title: "Marketing digital pour débutants", cat: "MARKETING" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: oumou.id, desc: "Les fondamentaux du marketing digital : réseaux sociaux, SEO, publicité, email marketing.",
      chapters: [
        { title: "Les canaux du marketing digital", lessons: [
          { title: "Vue d'ensemble du marketing digital", dur: 15, free: true, content: "SEO, SEA, social media, email : comprendre l'écosystème digital." },
          { title: "Créer une stratégie digitale", dur: 20, free: true, content: "Définir ses objectifs, sa cible et ses canaux prioritaires." },
          { title: "Mesurer ses résultats (KPIs)", dur: 15, free: true, content: "Les métriques essentielles pour évaluer vos actions marketing." },
        ]},
      ]},
    { title: "Réseaux sociaux & community management", cat: "MARKETING" as Category, lvl: "INTERMEDIATE" as Level, price: 15000, free: false, inst: oumou.id, desc: "Gérez des communautés et créez du contenu qui engage sur les réseaux sociaux.",
      chapters: [
        { title: "Stratégie social media", lessons: [
          { title: "Choisir ses plateformes (Facebook, Instagram, TikTok)", dur: 15, free: true, content: "Chaque réseau a son audience : choisissez les bons." },
          { title: "Créer un calendrier éditorial", dur: 20, free: false, content: "Planifiez vos publications sur un mois avec des outils gratuits." },
          { title: "Créer du contenu qui engage", dur: 25, free: false, content: "Les formats qui fonctionnent : vidéo, carrousel, story, live." },
        ]},
        { title: "Community management", lessons: [
          { title: "Gérer une communauté en ligne", dur: 20, free: false, content: "Répondre aux commentaires, gérer les crises et fidéliser." },
          { title: "Publicité sur les réseaux sociaux", dur: 25, free: false, content: "Créer votre première campagne publicitaire sur Meta Ads." },
        ]},
      ]},
    { title: "E-commerce et vente en ligne", cat: "MARKETING" as Category, lvl: "INTERMEDIATE" as Level, price: 18000, free: false, inst: oumou.id, desc: "Lancez votre boutique en ligne et vendez vos produits sur internet.",
      chapters: [
        { title: "Créer sa boutique", lessons: [
          { title: "Choisir sa plateforme (Shopify, WooCommerce)", dur: 15, free: true, content: "Comparaison des plateformes e-commerce pour démarrer." },
          { title: "Créer ses fiches produits", dur: 20, free: false, content: "Photos, descriptions, prix : les fiches qui convertissent." },
          { title: "Paiement et livraison en Afrique de l'Ouest", dur: 20, free: false, content: "Mobile Money, Wave, livraison locale : solutions adaptées au marché." },
        ]},
      ]},
    // ── DESIGN ──
    { title: "Canva pour tous", cat: "DESIGN" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: yasmine.id, desc: "Créez des visuels professionnels avec Canva, même sans compétences en design.",
      chapters: [
        { title: "Bases de Canva", lessons: [
          { title: "Interface et premiers pas", dur: 10, free: true, content: "Créez votre premier design en 5 minutes avec Canva." },
          { title: "Templates et personnalisation", dur: 15, free: true, content: "Utilisez et modifiez des modèles professionnels." },
          { title: "Posts réseaux sociaux", dur: 15, free: true, content: "Créez des visuels Instagram, Facebook et LinkedIn percutants." },
        ]},
        { title: "Projets Canva", lessons: [
          { title: "Créer un logo et une identité visuelle", dur: 20, free: true, content: "Concevez un logo et une charte graphique simple." },
          { title: "Créer une présentation professionnelle", dur: 20, free: true, content: "Alternative gratuite à PowerPoint pour des présentations design." },
        ]},
      ]},
    { title: "Design graphique avec Figma", cat: "DESIGN" as Category, lvl: "INTERMEDIATE" as Level, price: 20000, free: false, inst: yasmine.id, desc: "Maîtrisez Figma pour créer des interfaces web et mobile professionnelles.",
      chapters: [
        { title: "Fondamentaux de Figma", lessons: [
          { title: "Interface et outils de base", dur: 15, free: true, content: "Frames, composants, styles et navigation dans Figma." },
          { title: "Composants et Design System", dur: 25, free: false, content: "Créez des composants réutilisables pour un design cohérent." },
        ]},
        { title: "Prototypage", lessons: [
          { title: "Prototypes interactifs", dur: 25, free: false, content: "Ajoutez des interactions et transitions à vos maquettes." },
          { title: "Projet : Maquette d'application mobile", dur: 40, free: false, content: "Concevez l'interface complète d'une app mobile." },
        ]},
      ]},
    // ── LANGUES ──
    { title: "Anglais des affaires", cat: "LANGUES" as Category, lvl: "INTERMEDIATE" as Level, price: 20000, free: false, inst: oumou.id, desc: "Maîtrisez l'anglais professionnel pour les réunions, emails et présentations.",
      chapters: [
        { title: "Business Communication", lessons: [
          { title: "Writing professional emails", dur: 20, free: true, content: "Structures, formules de politesse et tons adaptés en anglais." },
          { title: "Phone calls and video meetings", dur: 20, free: false, content: "Vocabulaire et expressions pour les appels et visioconférences." },
          { title: "Presentations in English", dur: 25, free: false, content: "Structurer et délivrer une présentation en anglais avec confiance." },
        ]},
        { title: "Business Vocabulary", lessons: [
          { title: "Finance and accounting vocabulary", dur: 15, free: false, content: "Les termes essentiels de la finance en anglais." },
          { title: "Marketing and sales vocabulary", dur: 15, free: false, content: "Le vocabulaire du marketing et de la vente en anglais." },
          { title: "Job interviews in English", dur: 25, free: false, content: "Préparez votre entretien d'embauche en anglais." },
        ]},
      ]},
    { title: "Français renforcé : écrire et parler avec assurance", cat: "LANGUES" as Category, lvl: "BEGINNER" as Level, price: 0, free: true, inst: oumou.id, desc: "Améliorez votre orthographe, grammaire et expression orale en français.",
      chapters: [
        { title: "Orthographe et grammaire", lessons: [
          { title: "Les fautes les plus courantes", dur: 15, free: true, content: "Les 20 erreurs que 80% des gens font — et comment les corriger." },
          { title: "Accords, conjugaisons et pièges", dur: 20, free: true, content: "Participes passés, subjonctif, homophones : les points clés." },
        ]},
        { title: "Expression orale", lessons: [
          { title: "Enrichir son vocabulaire", dur: 15, free: true, content: "Techniques pour apprendre et retenir de nouveaux mots chaque jour." },
          { title: "S'exprimer clairement à l'oral", dur: 15, free: true, content: "Articuler, structurer ses idées et éviter les tics de langage." },
        ]},
      ]},
  ]

  // ══ CRÉATION DES COURS ══
  for (const c of coursesData) {
    console.log("📘 Création : " + c.title)

    const existing = await db.course.findUnique({ where: { slug: slug(c.title) } })
    if (existing) {
      console.log("   → Déjà existant, ignoré.")
      continue
    }

    const course = await db.course.create({
      data: {
        title: c.title,
        slug: slug(c.title),
        description: c.desc,
        category: c.cat,
        level: c.lvl,
        price: c.price,
        isFree: c.free,
        status: "PUBLISHED" as CourseStatus,
        instructorId: c.inst,
      },
    })

    for (let ci = 0; ci < c.chapters.length; ci++) {
      const ch = c.chapters[ci]
      const chapter = await db.chapter.create({
        data: { title: ch.title, order: ci + 1, courseId: course.id },
      })

      for (let li = 0; li < ch.lessons.length; li++) {
        const les = ch.lessons[li]
        await db.lesson.create({
          data: {
            title: les.title,
            content: les.content,
            duration: les.dur,
            order: li + 1,
            isFree: les.free,
            chapterId: chapter.id,
          },
        })
      }
    }
  }

  console.log("✅ Seed terminé !")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
