// Route guard: shows its children only to logged-in users, sends everyone else to /login.
import { Navigate } from 'react-router-dom'
import { useSession } from '../hooks'

export function RequireAuth({ children }) {
  const { session, isLoading } = useSession()
  if (isLoading) return <p className="p-8 text-center text-stone-500">Loading…</p>
  if (!session) return <Navigate to="/login" replace />
  return children
}
