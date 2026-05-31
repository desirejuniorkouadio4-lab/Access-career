import { Role } from "@prisma/client"

export type UserRole = Role

export interface SafeUser {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  image: string | null
  role: Role
  bio: string | null
  createdAt: Date
}
