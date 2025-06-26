import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { TrendingUp, Plus, Edit, Trash2, PieChart, BarChart3 } from 'lucide-react'

// 投資項目介面
interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  purchaseDate: string
  notes?: string
}

const DashboardPage: NextPage = () => {
  // 模擬投資數據
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: '台積電 (2330)',
      type: '股票',
      amount: 100000,
      currentValue: 110000,
      purchaseDate: '2024-01-15',
      notes: '半導體龍頭股'
    },
    {
      id: '2',
      name: '元大台灣50 (0050)',
      type: 'ETF',
      amount: 50000,
      currentValue: 52500,
      purchaseDate: '2024-02-01',
      notes: '台股大盤ETF'
    },
    {
      id: '3',
      name: '美國公債基金',
      type: '基金',
      amount: 30000,
      currentValue: 29500,
      purchaseDate: '2024-03-10',
      notes: '穩健型投資'
    }
  ])

  // 計算總投資金額和當前價值
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGainLoss = totalCurrentValue - totalInvestment
  const totalGainLossPercentage = ((totalGainLoss / totalInvestment) * 100).toFixed(2)

  // 格式化金額
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
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                投資組合
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                分析報告
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">投資組合總覽</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PieChart className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">總投資金額</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">當前價值</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className={`h-8 w-8 ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">損益</p>
                  <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalGainLoss)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-sm font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>%</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">報酬率</p>
                  <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">投資項目</h2>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新增投資
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投資項目
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投資金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    當前價值
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    損益
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    購買日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => {
                  const gainLoss = investment.currentValue - investment.amount
                  const gainLossPercentage = ((gainLoss / investment.amount) * 100).toFixed(2)
                  
                  return (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                          {investment.notes && (
                            <div className="text-sm text-gray-500">{investment.notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {investment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(investment.currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(gainLoss)}
                          <div className="text-xs">
                            ({gainLoss >= 0 ? '+' : ''}{gainLossPercentage}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investment.purchaseDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage

