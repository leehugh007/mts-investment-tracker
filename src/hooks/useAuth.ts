import { useEffect, useCallback } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/firebase/auth'
import { useUserStore } from '@/stores/userStore'
import { useUIStore } from '@/stores/uiStore'

/**
 * Firebase認證狀態管理Hook
 */
export function useFirebaseAuth() {
  const [firebaseUser, loading, error] = useAuthState(auth)
  const userStore = useUserStore()
  const uiStore = useUIStore()

  // 使用useCallback來穩定函數引用
  const handleAuthStateChange = useCallback(async () => {
    if (loading) return

    try {
      if (firebaseUser) {
        // 用戶已登入
        userStore.setFirebaseUser(firebaseUser)
        
        // 獲取用戶資料
        try {
          const userProfile = await getUserProfile(firebaseUser.uid)
          userStore.setUserProfile(userProfile)
        } catch (profileError) {
          console.error('Failed to get user profile:', profileError)
          // 如果獲取用戶資料失敗，可能是新用戶
          // 這是正常情況，不需要顯示錯誤
        }
      } else {
        // 用戶未登入
        userStore.reset()
      }
    } catch (error) {
      console.error('Auth state change error:', error)
      uiStore.addNotification({
        type: 'error',
        title: '認證錯誤',
        message: '處理認證狀態時發生錯誤'
      })
    } finally {
      if (!userStore.isInitialized) {
        userStore.setInitialized(true)
      }
    }
  }, [firebaseUser, loading, userStore, uiStore])

  // 處理載入狀態
  useEffect(() => {
    userStore.setLoading(loading)
  }, [loading, userStore])

  // 處理錯誤
  useEffect(() => {
    if (error) {
      console.error('Firebase auth error:', error)
      uiStore.addNotification({
        type: 'error',
        title: '認證錯誤',
        message: '認證服務發生錯誤，請重新整理頁面'
      })
    }
  }, [error, uiStore])

  // 處理認證狀態變化
  useEffect(() => {
    handleAuthStateChange()
  }, [handleAuthStateChange])

  return {
    user: firebaseUser,
    loading,
    error,
    isInitialized: userStore.isInitialized
  }
}

/**
 * 需要認證的頁面保護Hook
 */
export function useRequireAuth() {
  const { user, loading, isInitialized } = useFirebaseAuth()
  const uiStore = useUIStore()

  useEffect(() => {
    if (isInitialized && !loading && !user) {
      uiStore.addNotification({
        type: 'warning',
        title: '需要登入',
        message: '請先登入以訪問此頁面'
      })
    }
  }, [user, loading, isInitialized, uiStore])

  return {
    user,
    loading: loading || !isInitialized,
    isAuthenticated: !!user
  }
}

/**
 * 用戶資料Hook
 */
export function useUserProfile() {
  const userStore = useUserStore()
  const { loading } = useFirebaseAuth()

  return {
    profile: userStore.userProfile,
    user: userStore.firebaseUser,
    loading,
    isComplete: !!(userStore.userProfile?.displayName && 
                   userStore.userProfile?.timezone && 
                   userStore.userProfile?.preferredCurrency)
  }
}

