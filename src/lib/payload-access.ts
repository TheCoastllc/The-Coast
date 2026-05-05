import type { Access } from 'payload'

/** True only for users with role === 'admin' */
export const isAdmin: Access = ({ req: { user } }) =>
  (user as any)?.role === 'admin'

/** Admins can do anything; users can act on their own document */
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if ((user as any)?.role === 'admin') return true
  if (user?.id && id) return String(user.id) === String(id)
  return false
}

/** Any logged-in user */
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)
