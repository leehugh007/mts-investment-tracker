import { useEffect } from 'react'
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
  const {
    setFirebaseUser,
    setUserProfile,
    setLoading,
    setInitialized,
    isInitialized,
    reset
  } = useUserStore()
  const { addNotification } = useUIStore()

  useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  useEffect(() => {
    if (error) {
      console.error('Firebase auth error:', error)
      addNotification({
        type: 'error',
        title: '認證錯誤',
        message: '認證服務發生錯誤，請重新整理頁面'
      })
    }
  }, [error, addNotification])

  useEffect(() => {
    async function handleAuthStateChange() {
      if (loading) return

      try {
        if (firebaseUser) {
          // 用戶已登入
          setFirebaseUser(firebaseUser)
          
          // 獲取用戶資料
          try {
            const userProfile = await getUserProfile(firebaseUser.uid)
            setUserProfile(userProfile)
          } catch (profileError) {
            console.error('Failed to get user profile:', profileError)
            // 如果獲取用戶資料失敗，可能是新用戶或資料不完整
            // 這裡可以導向到設定頁面或顯示錯誤訊息
          }
        } else {
          // 用戶未登入
          reset()
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        addNotification({
          type: 'error',
          title: '認證錯誤',
          message: '處理認證狀態時發生錯誤'
        })
      } finally {
        if (!isInitialized) {
          setInitialized(true)
        }
      }
    }

    handleAuthStateChange()
  }, [firebaseUser, loading, setFirebaseUser, setUserProfile, reset, addNotification, isInitialized, setInitialized])

  return {
    user: firebaseUser,
    loading,
    error,
    isInitialized
  }
}

/**
 * 需要認證的頁面保護Hook
 */
export function useRequireAuth() {
  const { user, loading, isInitialized } = useFirebaseAuth()
  const { addNotification } = useUIStore()

  useEffect(() => {
    if (isInitialized && !loading && !user) {
      addNotification({
        type: 'warning',
        title: '需要登入',
        message: '請先登入以訪問此頁面'
      })
      // 這裡可以重定向到登入頁面
      // router.push('/auth/signin')
    }
  }, [user, loading, isInitialized, addNotification])

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
  const { userProfile, firebaseUser } = useUserStore()
  const { loading } = useFirebaseAuth()

  return {
    profile: userProfile,
    user: firebaseUser,
    loading,
    isComplete: !!(userProfile?.displayName && userProfile?.timezone && userProfile?.preferredCurrency)
  }
}

