import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyC_tk-FTfQgj-WS1l8qb78t0VPTyE2I5Gs",
  authDomain: "mts-investment-tracker.firebaseapp.com",
  projectId: "mts-investment-tracker",
  storageBucket: "mts-investment-tracker.firebasestorage.app",
  messagingSenderId: "788683523128",
  appId: "1:788683523128:web:fd08f6f77e0066d772d2cd",
  measurementId: "G-HJXS24XKPJ"
}

// 初始化Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedFirestore() {
  console.log('開始Firestore種子數據初始化...')

  try {
    // 創建測試用戶資料（需要先在Firebase Authentication中創建用戶）
    const testUserId = 'test-user-id' // 替換為實際的用戶ID
    
    const testUserData = {
      uid: testUserId,
      email: 'test@example.com',
      displayName: '測試用戶',
      timezone: 'Asia/Taipei',
      preferredCurrency: 'TWD',
      emailVerified: true,
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

    await setDoc(doc(db, 'users', testUserId), testUserData)
    console.log('創建測試用戶資料')

    // 創建測試資本配置
    const allocationId = `${testUserId}_default`
    const testAllocationData = {
      userId: testUserId,
      name: '主要投資組合',
      description: '用於長期投資的主要資金配置',
      totalAmount: 100000,
      availableAmount: 100000,
      currency: 'TWD',
      riskLevel: 'moderate',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(doc(db, 'capitalAllocations', allocationId), testAllocationData)
    console.log('創建測試資本配置')

    // 創建示例交易記錄
    const transactionData = {
      userId: testUserId,
      allocationId: allocationId,
      market: 'tw',
      symbol: '2330',
      stockName: '台積電',
      transactionType: 'buy',
      shares: 100,
      price: 500.0,
      totalAmount: 50000,
      fee: 100,
      currency: 'TWD',
      exchangeRate: 1.0,
      transactionDate: serverTimestamp(),
      notes: '初始投資台積電',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(doc(db, 'transactions', `${testUserId}_tx_001`), transactionData)
    console.log('創建示例交易記錄')

    // 創建對應的持股記錄
    const holdingId = `${testUserId}_${allocationId}_tw_2330`
    const holdingData = {
      userId: testUserId,
      allocationId: allocationId,
      market: 'tw',
      symbol: '2330',
      stockName: '台積電',
      totalShares: 100,
      averageCost: 500.0,
      totalCost: 50000,
      currency: 'TWD',
      firstPurchaseDate: serverTimestamp(),
      lastTransactionDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(doc(db, 'holdings', holdingId), holdingData)
    console.log('創建持股記錄')

    // 創建基礎風險設定
    const riskSettingData = {
      userId: testUserId,
      allocationId: allocationId,
      settingType: 'position_limit',
      settingScope: 'allocation',
      maxLossPercentage: 2.0,
      stopLossPercentage: 5.0,
      positionSizeLimit: 10.0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(doc(db, 'riskSettings', `${testUserId}_risk_001`), riskSettingData)
    console.log('創建基礎風險設定')

    console.log('Firestore種子數據初始化完成!')
    console.log('')
    console.log('注意事項：')
    console.log('1. 請先在Firebase Authentication中創建測試用戶')
    console.log('2. 將上面的 testUserId 替換為實際的用戶ID')
    console.log('3. 確保Firestore安全規則已正確設置')
    console.log('4. 在生產環境中請移除此種子數據')

  } catch (error) {
    console.error('Firestore種子數據初始化失敗:', error)
    process.exit(1)
  }
}

// 執行種子數據初始化
seedFirestore().then(() => {
  console.log('種子數據腳本執行完成')
  process.exit(0)
})

