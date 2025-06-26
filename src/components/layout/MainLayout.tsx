import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User,
  Shield,
  BarChart3
} from 'lucide-react'
import { signOutUser } from '@/lib/firebase/auth'
import { useUserStore } from '@/stores/userStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'

interface MainLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: '儀表板', href: '/dashboard', icon: LayoutDashboard },
  { name: '投資組合', href: '/portfolio', icon: PieChart },
  { name: '交易記錄', href: '/transactions', icon: TrendingUp },
  { name: '風險控制', href: '/risk', icon: Shield },
  { name: '報表分析', href: '/reports', icon: BarChart3 },
  { name: '設定', href: '/settings', icon: Settings },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const { userProfile, firebaseUser } = useUserStore()
  const { sidebarOpen, setSidebarOpen, addNotification } = useUIStore()

  const handleSignOut = async () => {
    try {
      await signOutUser()
      addNotification({
        type: 'success',
        title: '登出成功',
        message: '您已成功登出系統'
      })
      router.push('/auth/signin')
    } catch (error) {
      addNotification({
        type: 'error',
        title: '登出失敗',
        message: '登出時發生錯誤，請重試'
      })
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* 側邊欄 */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-2">
              <h1 className="text-lg font-semibold text-gray-900">MTS</h1>
              <p className="text-xs text-gray-500">投資追蹤</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 用戶資訊 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {firebaseUser?.photoURL ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={firebaseUser.photoURL}
                  alt={userProfile?.displayName || '用戶頭像'}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.displayName || firebaseUser?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {firebaseUser?.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* 頂部導航 */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <Button
            variant="ghost"
            size="icon"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    {/* 可以在這裡添加搜索圖標 */}
                  </div>
                  <div className="flex items-center h-full">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {navigation.find(item => item.href === router.pathname)?.name || '儀表板'}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {userProfile?.displayName || firebaseUser?.displayName}
                </span>
                {firebaseUser?.photoURL ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={firebaseUser.photoURL}
                    alt="用戶頭像"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* 側邊欄遮罩 (移動設備) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}
    </div>
  )
}

