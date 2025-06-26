import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase配置類型
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// 環境變數驗證
function validateEnvironmentVariables(): FirebaseConfig {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`)
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }
}

// Firebase應用初始化
function initializeFirebaseApp(): ReturnType<typeof initializeApp> | null {
  try {
    // 檢查是否已經初始化
    if (getApps().length > 0) {
      return getApp()
    }

    // 驗證環境變數
    const config = validateEnvironmentVariables()
    
    // 初始化Firebase應用
    const app = initializeApp(config)
    
    console.log('Firebase app initialized successfully')
    return app
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error)
    return null
  }
}

// 初始化Firebase應用
const app = initializeFirebaseApp()

// 導出服務實例（如果應用初始化成功）
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// 開發環境模擬器連接
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    if (auth && !auth.config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099')
    }
    if (db && !(db as any)._settings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
  } catch (error) {
    // 模擬器連接失敗不應該阻塞應用
    console.warn('Failed to connect to Firebase emulators:', error)
  }
}

// Firebase狀態檢查
export function isFirebaseAvailable(): boolean {
  return app !== null && auth !== null && db !== null
}

// 獲取Firebase錯誤訊息
export function getFirebaseErrorMessage(error: any): string {
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return '用戶不存在'
      case 'auth/wrong-password':
        return '密碼錯誤'
      case 'auth/email-already-in-use':
        return '電子郵件已被使用'
      case 'auth/weak-password':
        return '密碼強度不足'
      case 'auth/invalid-email':
        return '電子郵件格式無效'
      case 'auth/network-request-failed':
        return '網路連接失敗'
      default:
        return error.message || '發生未知錯誤'
    }
  }
  return '發生未知錯誤'
}

export default app

