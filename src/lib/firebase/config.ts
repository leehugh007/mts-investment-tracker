import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyC_tk-FTfQgj-WS1l8qb78t0VPTyE2I5Gs",
  authDomain: "mts-investment-tracker.firebaseapp.com",
  projectId: "mts-investment-tracker",
  storageBucket: "mts-investment-tracker.firebasestorage.app",
  messagingSenderId: "788683523128",
  appId: "1:788683523128:web:fd08f6f77e0066d772d2cd",
  measurementId: "G-HJXS24XKPJ"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only connect to emulators if not already connected
  try {
    // Auth emulator - check if already connected
    const authConfig = auth.config as any
    if (!authConfig.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }
    
    // Firestore emulator - check if already connected
    const dbConfig = (db as any)._delegate._databaseId
    if (!dbConfig.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
  } catch (error) {
    // Emulators might already be connected
    console.log('Firebase emulators connection info:', error)
  }
}

export default app

