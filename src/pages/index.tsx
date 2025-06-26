import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useFirebaseAuth } from '@/hooks/useAuth'
import { isFirebaseAvailable } from '@/lib/firebase/config'
import { TrendingUp, Shield, BarChart3, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

// Firebase不可用時的警告組件
function FirebaseWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            認證服務暫時不可用
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Firebase認證服務目前無法連接。您仍可以瀏覽網站，但登入和註冊功能暫時無法使用。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 載入組件
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在初始化...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const authState = useFirebaseAuth()

  // 已登入用戶的重定向（在適當的時機）
  useEffect(() => {
    if (authState.isInitialized && !authState.loading && authState.user) {
      // 使用setTimeout確保狀態穩定
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [authState.user, authState.loading, authState.isInitialized, router])

  // 如果還在初始化，顯示載入畫面
  if (!authState.isInitialized || authState.loading) {
    return <LoadingSpinner />
  }

  // 如果用戶已登入，顯示重定向訊息
  if (authState.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">歡迎回來！正在重定向到儀表板...</p>
        </div>
      </div>
    )
  }

  // 檢查Firebase是否可用
  const firebaseAvailable = isFirebaseAvailable()

  // 用戶未登入，顯示首頁
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 導航欄 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MTS投資追蹤系統
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {firebaseAvailable ? (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost">登入</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>開始使用</Button>
                  </Link>
                </>
              ) : (
                <Button disabled variant="ghost">
                  認證服務不可用
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Firebase警告 */}
          {!firebaseAvailable && <FirebaseWarning />}

          {/* 英雄區域 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">智能投資</span>{' '}
              <span className="block text-blue-600 xl:inline">追蹤管理</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              MTS投資追蹤系統幫助您輕鬆管理投資組合，追蹤股票表現，控制投資風險，讓您的投資決策更加明智。
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {firebaseAvailable ? (
                <>
                  <div className="rounded-md shadow">
                    <Link href="/auth/signup">
                      <Button size="lg" className="w-full">
                        免費開始使用
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/auth/signin">
                      <Button variant="outline" size="lg" className="w-full">
                        已有帳號？登入
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <Button disabled size="lg" className="w-full">
                  認證服務暫時不可用
                </Button>
              )}
            </div>
          </div>

          {/* 功能特色 */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                核心功能
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                全方位投資管理解決方案
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                從投資組合管理到風險控制，MTS為您提供專業級的投資追蹤工具。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">投資組合管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    輕鬆管理多個投資組合，追蹤每筆投資的表現和收益。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">即時數據分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    獲取即時股價數據，深入分析投資表現和市場趨勢。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">風險控制</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    設置止損點和風險警報，保護您的投資資本。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">多市場支援</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    支援台股、美股等多個市場，滿足不同投資需求。
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA區域 */}
          <div className="bg-blue-600 rounded-lg">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">準備開始您的投資之旅？</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-blue-200">
                立即註冊MTS投資追蹤系統，開始管理您的投資組合。
              </p>
              {firebaseAvailable ? (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="mt-8 bg-white text-blue-600 hover:bg-gray-50"
                  >
                    免費註冊
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  size="lg"
                  variant="secondary"
                  className="mt-8 bg-white text-blue-600"
                >
                  認證服務暫時不可用
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 頁腳 */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-gray-400 text-sm">
              © 2024 MTS投資追蹤系統. 保留所有權利.
            </span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <div className="flex items-center justify-center md:justify-start">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">
                MTS投資追蹤系統
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

