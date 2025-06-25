import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// 數據模型類型
export interface CapitalAllocation {
  id: string
  userId: string
  name: string
  description?: string
  totalAmount: number
  availableAmount: number
  currency: string
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Transaction {
  id: string
  userId: string
  allocationId: string
  market: string
  symbol: string
  stockName?: string
  transactionType: 'buy' | 'sell'
  shares: number
  price: number
  totalAmount: number
  fee: number
  currency: string
  exchangeRate: number
  baseCurrencyAmount?: number
  transactionDate: Timestamp
  settlementDate?: Timestamp
  notes?: string
  externalTransactionId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Holding {
  id: string
  userId: string
  allocationId: string
  market: string
  symbol: string
  stockName?: string
  totalShares: number
  averageCost: number
  totalCost: number
  currency: string
  firstPurchaseDate: Timestamp
  lastTransactionDate: Timestamp
  updatedAt: Timestamp
}

export interface RiskSetting {
  id: string
  userId: string
  allocationId?: string
  settingType: 'position_limit' | 'stop_loss' | 'daily_loss'
  settingScope: 'allocation' | 'position' | 'global'
  targetSymbol?: string
  targetMarket?: string
  maxLossPercentage?: number
  stopLossPercentage?: number
  positionSizeLimit?: number
  maxPositionValue?: number
  dailyLossLimit?: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface RiskEvent {
  id: string
  userId: string
  allocationId?: string
  eventType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  symbol?: string
  market?: string
  triggerValue?: number
  thresholdValue?: number
  message: string
  isResolved: boolean
  resolvedAt?: Timestamp
  createdAt: Timestamp
}

// 分頁參數
export interface PaginationParams {
  limit: number
  lastDoc?: DocumentSnapshot
  orderByField?: string
  orderDirection?: 'asc' | 'desc'
}

// 分頁結果
export interface PaginatedResult<T> {
  data: T[]
  lastDoc?: DocumentSnapshot
  hasMore: boolean
  total?: number
}

/**
 * 資本配置服務
 */
export class CapitalAllocationService {
  private static collection = 'capitalAllocations'

  static async create(data: Omit<CapitalAllocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Create allocation error:', error)
      throw new Error('創建資本配置失敗')
    }
  }

  static async getById(id: string): Promise<CapitalAllocation | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collection, id))
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CapitalAllocation
      }
      return null
    } catch (error) {
      console.error('Get allocation error:', error)
      throw new Error('獲取資本配置失敗')
    }
  }

  static async getByUserId(userId: string): Promise<CapitalAllocation[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CapitalAllocation[]
    } catch (error) {
      console.error('Get user allocations error:', error)
      throw new Error('獲取用戶資本配置失敗')
    }
  }

  static async update(id: string, data: Partial<CapitalAllocation>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Update allocation error:', error)
      throw new Error('更新資本配置失敗')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        isActive: false,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Delete allocation error:', error)
      throw new Error('刪除資本配置失敗')
    }
  }
}

/**
 * 交易記錄服務
 */
export class TransactionService {
  private static collection = 'transactions'

  static async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Create transaction error:', error)
      throw new Error('創建交易記錄失敗')
    }
  }

  static async getById(id: string): Promise<Transaction | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collection, id))
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Transaction
      }
      return null
    } catch (error) {
      console.error('Get transaction error:', error)
      throw new Error('獲取交易記錄失敗')
    }
  }

  static async getByUserId(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Transaction>> {
    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy(pagination?.orderByField || 'transactionDate', pagination?.orderDirection || 'desc')
      ]

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit))
      }

      if (pagination?.lastDoc) {
        constraints.push(startAfter(pagination.lastDoc))
      }

      const q = query(collection(db, this.collection), ...constraints)
      const querySnapshot = await getDocs(q)
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]

      return {
        data,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === (pagination?.limit || 20)
      }
    } catch (error) {
      console.error('Get user transactions error:', error)
      throw new Error('獲取用戶交易記錄失敗')
    }
  }

  static async getByAllocationId(allocationId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('allocationId', '==', allocationId),
        orderBy('transactionDate', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
    } catch (error) {
      console.error('Get allocation transactions error:', error)
      throw new Error('獲取配置交易記錄失敗')
    }
  }

  static async update(id: string, data: Partial<Transaction>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Update transaction error:', error)
      throw new Error('更新交易記錄失敗')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, id))
    } catch (error) {
      console.error('Delete transaction error:', error)
      throw new Error('刪除交易記錄失敗')
    }
  }
}

/**
 * 持股記錄服務
 */
export class HoldingService {
  private static collection = 'holdings'

  static async upsert(data: Omit<Holding, 'id' | 'updatedAt'>): Promise<string> {
    try {
      const holdingId = `${data.userId}_${data.allocationId}_${data.market}_${data.symbol}`
      await setDoc(doc(db, this.collection, holdingId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return holdingId
    } catch (error) {
      console.error('Upsert holding error:', error)
      throw new Error('更新持股記錄失敗')
    }
  }

  static async getByUserId(userId: string): Promise<Holding[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Holding[]
    } catch (error) {
      console.error('Get user holdings error:', error)
      throw new Error('獲取用戶持股記錄失敗')
    }
  }

  static async getByAllocationId(allocationId: string): Promise<Holding[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('allocationId', '==', allocationId),
        orderBy('updatedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Holding[]
    } catch (error) {
      console.error('Get allocation holdings error:', error)
      throw new Error('獲取配置持股記錄失敗')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, id))
    } catch (error) {
      console.error('Delete holding error:', error)
      throw new Error('刪除持股記錄失敗')
    }
  }
}

/**
 * 風險設定服務
 */
export class RiskSettingService {
  private static collection = 'riskSettings'

  static async create(data: Omit<RiskSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Create risk setting error:', error)
      throw new Error('創建風險設定失敗')
    }
  }

  static async getByUserId(userId: string): Promise<RiskSetting[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RiskSetting[]
    } catch (error) {
      console.error('Get user risk settings error:', error)
      throw new Error('獲取用戶風險設定失敗')
    }
  }

  static async update(id: string, data: Partial<RiskSetting>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Update risk setting error:', error)
      throw new Error('更新風險設定失敗')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        isActive: false,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Delete risk setting error:', error)
      throw new Error('刪除風險設定失敗')
    }
  }
}

/**
 * 風險事件服務
 */
export class RiskEventService {
  private static collection = 'riskEvents'

  static async create(data: Omit<RiskEvent, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Create risk event error:', error)
      throw new Error('創建風險事件失敗')
    }
  }

  static async getByUserId(userId: string, resolved?: boolean): Promise<RiskEvent[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ]

      if (typeof resolved === 'boolean') {
        constraints.push(where('isResolved', '==', resolved))
      }

      const q = query(collection(db, this.collection), ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RiskEvent[]
    } catch (error) {
      console.error('Get user risk events error:', error)
      throw new Error('獲取用戶風險事件失敗')
    }
  }

  static async resolve(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        isResolved: true,
        resolvedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Resolve risk event error:', error)
      throw new Error('解決風險事件失敗')
    }
  }
}

