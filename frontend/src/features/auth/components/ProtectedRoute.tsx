import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppLoadingScreen } from '../../../shared/ui/AppLoadingScreen'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <AppLoadingScreen />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
  }

  return <Outlet />
}
