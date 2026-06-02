import { db } from "@/lib/db"

type NotifType =
  | "COURSE_APPROVED"
  | "COURSE_REJECTED"
  | "ASSIGNMENT_GRADED"
  | "NEW_ENROLLMENT"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "FORUM_REPLY"
  | "COURSE_SUBMITTED"

const notifConfig: Record<NotifType, { title: string; icon: string }> = {
  COURSE_APPROVED:      { title: "Cours approuvé",           icon: "✅" },
  COURSE_REJECTED:      { title: "Cours refusé",             icon: "❌" },
  ASSIGNMENT_GRADED:    { title: "Devoir corrigé",           icon: "📝" },
  NEW_ENROLLMENT:       { title: "Nouvel apprenant",         icon: "🎓" },
  APPLICATION_APPROVED: { title: "Candidature approuvée",    icon: "🎉" },
  APPLICATION_REJECTED: { title: "Candidature refusée",      icon: "😔" },
  FORUM_REPLY:          { title: "Nouvelle réponse",         icon: "💬" },
  COURSE_SUBMITTED:     { title: "Cours soumis à validation",icon: "📋" },
}

export async function createNotification({
  userId, type, message, link,
}: {
  userId: string
  type: NotifType
  message: string
  link?: string
}) {
  try {
    const config = notifConfig[type]
    await db.notification.create({
      data: {
        userId,
        type,
        title: config.title,
        message,
        link: link || null,
        read: false,
      },
    })
  } catch (e) {
    console.error("[CREATE_NOTIFICATION]", e)
  }
}
