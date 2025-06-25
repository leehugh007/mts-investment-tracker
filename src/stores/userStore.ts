import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UserProfile, CapitalAllocation } from '@/types'

interface UserState {
  // 用戶資料
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUser: (updates: Partial<UserProfile>) => void

  // 資本配置
  allocations: CapitalAllocation[]
  setAllocations: (allocations: CapitalAllocation[]) => void
  addAllocation: (allocation: CapitalAllocation) => void
  updateAllocation: (id: string, updates: Partial<CapitalAllocation>) => void
  removeAllocation: (id: string) => void

  // 偏好設定
  preferences: Record<string, any>
  setPreferences: (preferences: Record<string, any>) => void
  updatePreference: (key: string, value: any) => void

  // 載入狀態
  isLoadingUser: boolean
  isLoadingAllocations: boolean
  setLoadingUser: (loading: boolean) => void
  setLoadingAllocations: (loading: boolean) => void

  // 重置狀態
  reset: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // 用戶資料
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
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

      // 偏好設定
      preferences: {},
      setPreferences: (preferences) => set({ preferences }),
      updatePreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        })),

      // 載入狀態
      isLoadingUser: false,
      isLoadingAllocations: false,
      setLoadingUser: (loading) => set({ isLoadingUser: loading }),
      setLoadingAllocations: (loading) => set({ isLoadingAllocations: loading }),

      // 重置狀態
      reset: () =>
        set({
          user: null,
          allocations: [],
          preferences: {},
          isLoadingUser: false,
          isLoadingAllocations: false,
        }),
    }),
    { name: 'user-store' }
  )
)

