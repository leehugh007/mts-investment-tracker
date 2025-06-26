import React, { useEffect, useState } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUserStore } from '@/stores/userStore'
import { CapitalAllocationService } from '@/lib/firebase/firestore'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Plus,
  Activity
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function DashboardPage() {
  const { user, loading } = useRequireAuth()
  const { allocations, setAllocations, userProfile } = useUserStore()
  const [isLoadingAllocations, setIsLoadingAllocations] = useState(true)

  useEffect(() => {
    if (user && !loading) {
      loadAllocations()
    }
  }, [user, loading])

  const loadAllocations = async () => {
    try {
      setIsLoadingAllocations(true)
      const userAllocations = await CapitalAllocationService.getByUserId(user!.uid)
      setAllocations(userAllocations)
    } catch (error) {
      console.error('Failed to load allocations:', error)
    } finally {
      setIsLoadingAllocations(false)
    }
  }

  // 計算總覽統計
  const totalAmount = allocations.reduce((sum, allocation) => sum + allocation.totalAmount, 0)
  const totalAvailable = allocations.reduce((sum, allocation) => sum + allocation.availableAmount, 0)
  const totalInvested = totalAmount - totalAvailable
  const utilizationRate = totalAmount > 0 ? (totalInvested / totalAmount) * 100 : 0

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 歡迎區域 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            歡迎回來，{userProfile?.displayName || user.displayName}！
          </h1>
          <p className="text-blue-100">
            這是您的投資組合總覽，讓我們一起追蹤您的投資表現。
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總資本</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalAmount, userProfile?.preferredCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                來自 {allocations.length} 個配置
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已投資金額</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalInvested, userProfile?.preferredCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                資金使用率 {formatPercentage(utilizationRate)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用資金</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalAvailable, userProfile?.preferredCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                可用於新投資
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">投資組合</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allocations.length}</div>
              <p className="text-xs text-muted-foreground">
                個活躍配置
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 資本配置列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>資本配置</CardTitle>
                  <CardDescription>
                    管理您的投資資金分配
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  新增配置
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAllocations ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : allocations.length === 0 ? (
                <div className="text-center py-6">
                  <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    尚未建立資本配置
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    開始建立您的第一個投資配置
                  </p>
                  <div className="mt-6">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      建立配置
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {allocations.map((allocation) => (
                    <div
                      key={allocation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {allocation.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {allocation.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            總額: {formatCurrency(allocation.totalAmount, allocation.currency)}
                          </span>
                          <span>
                            可用: {formatCurrency(allocation.availableAmount, allocation.currency)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            allocation.riskLevel === 'conservative' 
                              ? 'bg-green-100 text-green-800'
                              : allocation.riskLevel === 'moderate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {allocation.riskLevel === 'conservative' ? '保守' :
                             allocation.riskLevel === 'moderate' ? '穩健' : '積極'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          查看
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>
                常用功能快速入口
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>新增交易</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>查看持股</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>風險設定</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <PieChart className="h-6 w-6 mb-2" />
                  <span>分析報表</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近活動 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活動</CardTitle>
            <CardDescription>
              您最近的投資活動記錄
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>尚無活動記錄</p>
              <p className="text-sm">開始您的第一筆投資交易吧！</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

