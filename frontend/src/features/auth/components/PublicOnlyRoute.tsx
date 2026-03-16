import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppLoadingScreen } from '../../../shared/ui/AppLoadingScreen'

export function PublicOnlyRoute() {
  const { status, getDefaultRoute } = useAuth()

  if (status === 'checking') {
    return <AppLoadingScreen />
  }

  if (status === 'authenticated') {
    return <Navigate to={getDefaultRoute()} replace />
  }

  return <Outlet />
}
