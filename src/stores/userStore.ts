import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserProfile, CapitalAllocation } from '@/lib/firebase/firestore'

interface UserState {
  // Firebase用戶
  firebaseUser: User | null
  setFirebaseUser: (user: User | null) => void

  // 用戶資料
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void

  // 資本配置
  allocations: CapitalAllocation[]
  setAllocations: (allocations: CapitalAllocation[]) => void
  addAllocation: (allocation: CapitalAllocation) => void
  updateAllocation: (id: string, updates: Partial<CapitalAllocation>) => void
  removeAllocation: (id: string) => void

  // 認證狀態
  isAuthenticated: boolean
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // 初始化狀態
  isInitialized: boolean
  setInitialized: (initialized: boolean) => void

  // 重置狀態
  reset: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Firebase用戶
      firebaseUser: null,
      setFirebaseUser: (user) => 
        set({ 
          firebaseUser: user,
          isAuthenticated: !!user
        }),

      // 用戶資料
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (updates) =>
        set((state) => ({
          userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null
        })),

      // 資本配置
      allocations: [],
      setAllocations: (allocations) => set({ allocations }),
      addAllocation: (allocation) =>
        set((state) => ({
          allocations: [...state.allocations, allocation]
        })),
      updateAllocation: (id, updates) =>
        set((state) => ({
          allocations: state.allocations.map((allocation) =>
            allocation.id === id ? { ...allocation, ...updates } : allocation
          )
        })),
      removeAllocation: (id) =>
        set((state) => ({
          allocations: state.allocations.filter((allocation) => allocation.id !== id)
        })),

      // 認證狀態
      isAuthenticated: false,
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),

      // 初始化狀態
      isInitialized: false,
      setInitialized: (initialized) => set({ isInitialized: initialized }),

      // 重置狀態
      reset: () =>
        set({
          firebaseUser: null,
          userProfile: null,
          allocations: [],
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false,
        }),
    }),
    { name: 'user-store' }
  )
)

