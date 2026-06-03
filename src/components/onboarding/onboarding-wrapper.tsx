"use client"

import { useSession } from "next-auth/react"
import OnboardingModal from "./onboarding-modal"

export default function OnboardingWrapper() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const role = (session.user as any).role
  if (role !== "STUDENT") return null

  const firstName = session.user.name?.split(" ")[0] || ""

  return <OnboardingModal userName={firstName} />
}
