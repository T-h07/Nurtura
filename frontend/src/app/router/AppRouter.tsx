import { Navigate, Route, Routes } from 'react-router-dom'
import { ClassroomShellPage } from '../../features/classroom/pages/ClassroomShellPage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { ManagementShellPage } from '../../features/management/pages/ManagementShellPage'
import { UnsupportedRolePage } from '../../features/auth/pages/UnsupportedRolePage'
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute'
import { PublicOnlyRoute } from '../../features/auth/components/PublicOnlyRoute'
import { RoleGuard } from '../../features/auth/components/RoleGuard'
import {
  CLASSROOM_SURFACE_ROLES,
  MANAGEMENT_SURFACE_ROLES,
} from '../../features/auth/model/AppRole'
import { useAuth } from '../../features/auth/hooks/useAuth'

function WorkspaceEntryRedirect() {
  const { getDefaultRoute } = useAuth()
  return <Navigate to={getDefaultRoute()} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<WorkspaceEntryRedirect />} />
        <Route path="/app/unsupported" element={<UnsupportedRolePage />} />

        <Route element={<RoleGuard allowedRoles={MANAGEMENT_SURFACE_ROLES} />}>
          <Route path="/app/management">
            <Route index element={<Navigate to="/app/management/overview" replace />} />
            <Route path=":section" element={<ManagementShellPage />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={CLASSROOM_SURFACE_ROLES} />}>
          <Route path="/app/classroom">
            <Route index element={<Navigate to="/app/classroom/overview" replace />} />
            <Route path=":section" element={<ClassroomShellPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}
