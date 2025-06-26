import React from 'react'
import { useRouter } from 'next/router'
import { useRequireAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useRequireAuth()
  const router = useRouter()

  // 顯示載入狀態
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    )
  }

  // 如果未認證，重定向到登入頁面
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/auth/signin')
    }
    return null
  }

  // 如果已認證，顯示子組件
  return <>{children}</>
}

