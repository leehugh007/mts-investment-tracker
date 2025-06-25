import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 通知狀態
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  actions?: {
    label: string
    action: () => void
  }[]
}

interface UIState {
  // 通知
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // 載入狀態
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // 側邊欄
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // 主題
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // 模態框
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // 通知
        notifications: [],
        addNotification: (notification) => {
          const id = Math.random().toString(36).substr(2, 9)
          const newNotification = { ...notification, id }
          
          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }))

          // 自動移除通知
          if (notification.duration !== 0) {
            setTimeout(() => {
              get().removeNotification(id)
            }, notification.duration || 5000)
          }
        },
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
          })),
        clearNotifications: () => set({ notifications: [] }),

        // 載入狀態
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),

        // 側邊欄
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // 主題
        theme: 'system',
        setTheme: (theme) => set({ theme }),

        // 模態框
        modals: {},
        openModal: (modalId) =>
          set((state) => ({
            modals: { ...state.modals, [modalId]: true }
          })),
        closeModal: (modalId) =>
          set((state) => ({
            modals: { ...state.modals, [modalId]: false }
          })),
        toggleModal: (modalId) =>
          set((state) => ({
            modals: { ...state.modals, [modalId]: !state.modals[modalId] }
          })),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'ui-store' }
  )
)

