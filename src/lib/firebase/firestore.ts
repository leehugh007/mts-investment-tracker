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
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { 
  CapitalAllocation, 
  Transaction, 
  Holding, 
  RiskSetting, 
  RiskEvent,
  PaginationParams 
} from '@/types'

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
        const data = docSnap.data()
        return { 
          id: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as CapitalAllocation
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }) as CapitalAllocation[]
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
        const data = docSnap.data()
        return { 
          id: docSnap.id, 
          ...data,
          executedAt: data.executedAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Transaction
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
        orderBy(pagination?.sortBy || 'executedAt', pagination?.sortOrder || 'desc')
      ]

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit))
      }

      const q = query(collection(db, this.collection), ...constraints)
      const querySnapshot = await getDocs(q)
      
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          ...docData,
          executedAt: docData.executedAt?.toDate() || new Date(),
          createdAt: docData.createdAt?.toDate() || new Date(),
          updatedAt: docData.updatedAt?.toDate() || new Date()
        }
      }) as Transaction[]

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
        orderBy('executedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          executedAt: data.executedAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }) as Transaction[]
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }) as Holding[]
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }) as Holding[]
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }) as RiskSetting[]
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          resolvedAt: data.resolvedAt?.toDate()
        }
      }) as RiskEvent[]
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

