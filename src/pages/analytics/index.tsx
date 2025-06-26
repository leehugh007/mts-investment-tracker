import { NextPage } from 'next'
import Link from 'next/link'
import { TrendingUp, PieChart, BarChart3, Target, ArrowUp, ArrowDown } from 'lucide-react'

const AnalyticsPage: NextPage = () => {
  // 模擬分析數據
  const analysisData = {
    totalInvestment: 180000,
    totalCurrentValue: 192000,
    totalGainLoss: 12000,
    totalGainLossPercentage: 6.67,
    monthlyPerformance: [
      { month: '1月', value: 180000, gainLoss: 0 },
      { month: '2月', value: 185000, gainLoss: 5000 },
      { month: '3月', value: 182000, gainLoss: 2000 },
      { month: '4月', value: 188000, gainLoss: 8000 },
      { month: '5月', value: 190000, gainLoss: 10000 },
      { month: '6月', value: 192000, gainLoss: 12000 }
    ],
    assetAllocation: [
      { type: '股票', value: 110000, percentage: 57.3 },
      { type: 'ETF', value: 52500, percentage: 27.3 },
      { type: '基金', value: 29500, percentage: 15.4 }
    ],
    topPerformers: [
      { name: '台積電 (2330)', gainLoss: 10000, percentage: 10.0 },
      { name: '元大台灣50 (0050)', gainLoss: 2500, percentage: 5.0 },
      { name: '美國公債基金', gainLoss: -500, percentage: -1.7 }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MTS 投資追蹤</span>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                投資組合
              </Link>
              <Link href="/analytics" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                分析報告
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">投資分析報告</h1>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">總投資</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analysisData.totalInvestment)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">當前價值</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analysisData.totalCurrentValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">總損益</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analysisData.totalGainLoss)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">報酬率</p>
                <p className="text-2xl font-bold text-green-600">+{analysisData.totalGainLossPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Asset Allocation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">資產配置</h2>
            <div className="space-y-4">
              {analysisData.assetAllocation.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded mr-3 ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{asset.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(asset.value)}</div>
                    <div className="text-xs text-gray-500">{asset.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">績效排行</h2>
            <div className="space-y-4">
              {analysisData.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {performer.gainLoss >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      performer.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(performer.gainLoss)}
                    </div>
                    <div className={`text-xs ${
                      performer.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {performer.percentage >= 0 ? '+' : ''}{performer.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance Chart */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">月度績效趨勢</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analysisData.monthlyPerformance.map((month, index) => {
              const maxValue = Math.max(...analysisData.monthlyPerformance.map(m => m.value))
              const height = (month.value / maxValue) * 100
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">{formatCurrency(month.value)}</div>
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-700 mt-2">{month.month}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            返回投資組合
          </Link>
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            匯出報告
          </button>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsPage

