export type Role = 'admin' | 'staff' | 'any'

export interface VerifiedToken {
  email: string
  role: Role
  userId: number
}
