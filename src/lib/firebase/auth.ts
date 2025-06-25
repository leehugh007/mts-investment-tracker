import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  timezone: string
  preferredCurrency: string
  emailVerified: boolean
  createdAt: any
  lastLoginAt: any
  preferences: {
    dashboardLayout: {
      layout: 'grid' | 'list'
      columns: number
    }
    defaultMarket: {
      market: string
    }
    notificationSettings: {
      email: boolean
      push: boolean
      riskAlerts: boolean
    }
  }
}

/**
 * 註冊新用戶（郵件密碼）
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  timezone: string = 'Asia/Taipei',
  preferredCurrency: string = 'TWD'
): Promise<{ user: User; profile: UserProfile }> {
  try {
    // 創建用戶
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 更新用戶顯示名稱
    await updateProfile(user, { displayName })

    // 發送郵件驗證
    await sendEmailVerification(user)

    // 創建用戶資料文檔
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || undefined,
      timezone,
      preferredCurrency,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      preferences: {
        dashboardLayout: {
          layout: 'grid',
          columns: 2
        },
        defaultMarket: {
          market: 'tw'
        },
        notificationSettings: {
          email: true,
          push: false,
          riskAlerts: true
        }
      }
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    // 創建默認資本配置
    await createDefaultAllocation(user.uid, preferredCurrency)

    return { user, profile: userProfile }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 登入（郵件密碼）
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 更新最後登入時間
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp()
    })

    // 獲取用戶資料
    const profile = await getUserProfile(user.uid)

    return { user, profile }
  } catch (error: any) {
    console.error('Sign in error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Google登入
 */
export async function signInWithGoogle(): Promise<{ user: User; profile: UserProfile; isNewUser: boolean }> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    const user = userCredential.user

    // 檢查是否為新用戶
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const isNewUser = !userDoc.exists()

    let profile: UserProfile

    if (isNewUser) {
      // 創建新用戶資料
      profile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        photoURL: user.photoURL || undefined,
        timezone: 'Asia/Taipei',
        preferredCurrency: 'TWD',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        preferences: {
          dashboardLayout: {
            layout: 'grid',
            columns: 2
          },
          defaultMarket: {
            market: 'tw'
          },
          notificationSettings: {
            email: true,
            push: false,
            riskAlerts: true
          }
        }
      }

      await setDoc(doc(db, 'users', user.uid), profile)
      await createDefaultAllocation(user.uid, 'TWD')
    } else {
      // 更新最後登入時間
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      })
      profile = userDoc.data() as UserProfile
    }

    return { user, profile, isNewUser }
  } catch (error: any) {
    console.error('Google sign in error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 登出
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw new Error('登出失敗')
  }
}

/**
 * 獲取用戶資料
 */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (!userDoc.exists()) {
      throw new Error('用戶資料不存在')
    }
    return userDoc.data() as UserProfile
  } catch (error) {
    console.error('Get user profile error:', error)
    throw new Error('獲取用戶資料失敗')
  }
}

/**
 * 更新用戶資料
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), updates)
  } catch (error) {
    console.error('Update user profile error:', error)
    throw new Error('更新用戶資料失敗')
  }
}

/**
 * 更改密碼
 */
export async function changePassword(newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('用戶未登入')
    }
    await updatePassword(user, newPassword)
  } catch (error: any) {
    console.error('Change password error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 發送密碼重設郵件
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error('Reset password error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 重新發送驗證郵件
 */
export async function resendVerificationEmail(): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('用戶未登入')
    }
    await sendEmailVerification(user)
  } catch (error: any) {
    console.error('Resend verification email error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 創建默認資本配置
 */
async function createDefaultAllocation(uid: string, currency: string): Promise<void> {
  try {
    const allocationData = {
      userId: uid,
      name: '主要投資組合',
      description: '默認的投資資金配置',
      totalAmount: 0,
      availableAmount: 0,
      currency,
      riskLevel: 'moderate',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(doc(db, 'capitalAllocations', `${uid}_default`), allocationData)
  } catch (error) {
    console.error('Create default allocation error:', error)
    // 不拋出錯誤，因為這不是關鍵功能
  }
}

/**
 * 獲取認證錯誤訊息
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return '找不到此電子郵件對應的帳號'
    case 'auth/wrong-password':
      return '密碼錯誤'
    case 'auth/email-already-in-use':
      return '此電子郵件已被註冊'
    case 'auth/weak-password':
      return '密碼強度不足，請使用至少6個字符'
    case 'auth/invalid-email':
      return '電子郵件格式無效'
    case 'auth/user-disabled':
      return '此帳號已被停用'
    case 'auth/too-many-requests':
      return '請求過於頻繁，請稍後再試'
    case 'auth/network-request-failed':
      return '網路連接失敗，請檢查網路連接'
    case 'auth/popup-closed-by-user':
      return '登入視窗被關閉'
    case 'auth/cancelled-popup-request':
      return '登入請求被取消'
    default:
      return '認證失敗，請重試'
  }
}

