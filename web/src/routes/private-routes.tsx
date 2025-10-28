import { Navigate } from 'react-router-dom'
import type { JSX } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PrivateRouteProps {
  children: JSX.Element
}

export function PrivateRoutes({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div>
     
        <span>Verificando autenticação...</span>
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }
  return children
}
