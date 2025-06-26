import { useEffect, useState, useCallback } from 'react'
import { User } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, isFirebaseAvailable } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/firebase/auth'
import { useUserStore } from '@/stores/userStore'
import { useUIStore } from '@/stores/uiStore'
import { UserProfile } from '@/types'

// 認證狀態類型
interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  isInitialized: boolean
}

/**
 * Firebase認證狀態管理Hook
 * 基於第一性原理設計：
 * 1. 分離Firebase狀態和UI狀態
 * 2. 避免無限循環
 * 3. 優雅處理錯誤
 */
export function useFirebaseAuth(): AuthState {
  // 本地狀態管理（避免直接操作全局store）
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
    isInitialized: false
  })

  // Firebase認證狀態（只有在Firebase可用時才使用）
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(
    isFirebaseAvailable() ? auth! : undefined
  )

  // Store引用（穩定引用）
  const userStore = useUserStore()
  const uiStore = useUIStore()

  // 獲取用戶資料的穩定函數
  const fetchUserProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    try {
      return await getUserProfile(uid)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }, [])

  // 處理認證狀態變化
  useEffect(() => {
    async function handleAuthChange() {
      // Firebase不可用時的處理
      if (!isFirebaseAvailable()) {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: 'Firebase服務不可用',
          isInitialized: true
        })
        return
      }

      // Firebase載入中
      if (firebaseLoading) {
        setAuthState(prev => ({ ...prev, loading: true }))
        return
      }

      // Firebase錯誤處理
      if (firebaseError) {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: firebaseError.message,
          isInitialized: true
        })
        return
      }

      // 用戶已登入
      if (firebaseUser) {
        setAuthState(prev => ({ ...prev, loading: true }))
        
        const profile = await fetchUserProfile(firebaseUser.uid)
        
        setAuthState({
          user: firebaseUser,
          profile,
          loading: false,
          error: null,
          isInitialized: true
        })
      } else {
        // 用戶未登入
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null,
          isInitialized: true
        })
      }
    }

    handleAuthChange()
  }, [firebaseUser, firebaseLoading, firebaseError, fetchUserProfile])

  // 同步到全局store（在適當的時機）
  useEffect(() => {
    if (authState.isInitialized) {
      userStore.setFirebaseUser(authState.user)
      userStore.setUserProfile(authState.profile)
      userStore.setLoading(authState.loading)
      userStore.setInitialized(true)

      // 顯示錯誤通知
      if (authState.error) {
        uiStore.addNotification({
          type: 'error',
          title: '認證錯誤',
          message: authState.error
        })
      }
    }
  }, [authState, userStore, uiStore])

  return authState
}

/**
 * 需要認證的頁面保護Hook
 */
export function useRequireAuth() {
  const authState = useFirebaseAuth()
  const uiStore = useUIStore()

  useEffect(() => {
    if (authState.isInitialized && !authState.loading && !authState.user) {
      uiStore.addNotification({
        type: 'warning',
        title: '需要登入',
        message: '請先登入以訪問此頁面'
      })
    }
  }, [authState.user, authState.loading, authState.isInitialized, uiStore])

  return {
    user: authState.user,
    loading: authState.loading || !authState.isInitialized,
    isAuthenticated: !!authState.user,
    error: authState.error
  }
}

/**
 * 用戶資料Hook
 */
export function useUserProfile() {
  const authState = useFirebaseAuth()

  return {
    profile: authState.profile,
    user: authState.user,
    loading: authState.loading,
    isComplete: !!(authState.profile?.displayName && 
                   authState.profile?.timezone && 
                   authState.profile?.preferredCurrency)
  }
}

