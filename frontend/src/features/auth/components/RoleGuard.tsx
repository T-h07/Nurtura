import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { type AppRole } from '../model/AppRole'
import { AppLoadingScreen } from '../../../shared/ui/AppLoadingScreen'

interface RoleGuardProps {
  allowedRoles: AppRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { status, hasAnyRole, getDefaultRoute } = useAuth()

  if (status === 'checking') {
    return <AppLoadingScreen />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  return <Outlet />
}
