// 投資項目類型
export interface Investment {
  id: string
  name: string
  type: 'stock' | 'etf' | 'fund' | 'bond' | 'crypto' | 'other'
  amount: number
  currentValue: number
  purchaseDate: string
  notes?: string
  symbol?: string
  quantity?: number
  pricePerUnit?: number
}

// 投資組合類型
export interface Portfolio {
  id: string
  name: string
  description?: string
  investments: Investment[]
  createdAt: string
  updatedAt: string
}

// 投資績效類型
export interface PerformanceData {
  date: string
  value: number
  gainLoss: number
  gainLossPercentage: number
}

// 投資分析類型
export interface AnalysisData {
  totalInvestment: number
  totalCurrentValue: number
  totalGainLoss: number
  totalGainLossPercentage: number
  bestPerformer: Investment | null
  worstPerformer: Investment | null
  assetAllocation: {
    type: string
    value: number
    percentage: number
  }[]
}

// 通知類型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// API 響應類型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 表單類型
export interface InvestmentFormData {
  name: string
  type: Investment['type']
  amount: number
  purchaseDate: string
  notes?: string
  symbol?: string
  quantity?: number
  pricePerUnit?: number
}

// 搜索和篩選類型
export interface SearchFilters {
  query?: string
  type?: Investment['type']
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

// 排序類型
export interface SortOptions {
  field: keyof Investment
  direction: 'asc' | 'desc'
}

// 分頁類型
export interface PaginationOptions {
  page: number
  limit: number
  total: number
}

