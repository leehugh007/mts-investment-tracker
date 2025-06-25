import { User, CapitalAllocation, Transaction, Holding, RiskSetting, RiskEvent } from '@prisma/client'

// 基礎API響應類型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// 用戶相關類型
export interface UserProfile extends Omit<User, 'passwordHash'> {
  // 排除敏感信息的用戶資料
}

export interface UserPreferences {
  dashboardLayout: {
    layout: 'grid' | 'list'
    columns: number
  }
  defaultMarket: {
    market: string
  }
  notificationSettings: {
    email: boolean
    push: boolean
    riskAlerts: boolean
  }
}

// 認證相關類型
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  timezone?: string
  preferredCurrency?: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    image?: string
  }
  expires: string
}

// 投資組合相關類型
export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercentage: number
  availableCash: number
  allocatedCash: number
  currency: string
}

export interface HoldingWithCurrentPrice extends Holding {
  currentPrice?: number
  currentValue?: number
  gainLoss?: number
  gainLossPercentage?: number
  lastUpdated?: Date
}

export interface TransactionWithDetails extends Transaction {
  allocation: CapitalAllocation
}

// 股票數據相關類型
export interface StockQuote {
  symbol: string
  market: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  dividend?: number
  currency: string
  lastUpdated: Date
}

export interface StockHistoricalData {
  symbol: string
  market: string
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose?: number
}

export interface MarketData {
  quotes: StockQuote[]
  lastUpdated: Date
}

// 風險管理相關類型
export interface RiskAlert {
  id: string
  type: 'position_limit' | 'stop_loss' | 'daily_loss' | 'portfolio_risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  symbol?: string
  market?: string
  triggerValue?: number
  thresholdValue?: number
  createdAt: Date
  isResolved: boolean
}

export interface RiskMetrics {
  portfolioRisk: number
  maxDrawdown: number
  sharpeRatio: number
  volatility: number
  beta: number
  var: number // Value at Risk
}

// 報表相關類型
export interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: Date
  endDate: Date
  totalReturn: number
  totalReturnPercentage: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
}

export interface AllocationReport {
  allocationId: string
  name: string
  totalValue: number
  totalCost: number
  gainLoss: number
  gainLossPercentage: number
  holdings: HoldingWithCurrentPrice[]
  riskMetrics: RiskMetrics
}

// 圖表數據類型
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface PortfolioChartData {
  performance: ChartDataPoint[]
  allocation: {
    symbol: string
    name: string
    value: number
    percentage: number
    color: string
  }[]
}

// 搜索和篩選類型
export interface SearchFilters {
  market?: string
  symbol?: string
  dateFrom?: Date
  dateTo?: Date
  transactionType?: 'buy' | 'sell'
  allocationId?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 表單驗證類型
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isSubmitting: boolean
  isValid: boolean
}

// 通知類型
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

// 市場類型
export type MarketType = 'tw' | 'us' | 'hk' | 'jp' | 'kr'

export interface Market {
  code: MarketType
  name: string
  currency: string
  timezone: string
  tradingHours: {
    open: string
    close: string
  }
  isOpen: boolean
}

// 貨幣類型
export type CurrencyType = 'TWD' | 'USD' | 'HKD' | 'JPY' | 'KRW'

export interface ExchangeRate {
  from: CurrencyType
  to: CurrencyType
  rate: number
  lastUpdated: Date
}

// 導出所有Prisma模型類型
export type {
  User,
  CapitalAllocation,
  Transaction,
  Holding,
  RiskSetting,
  RiskEvent,
} from '@prisma/client'

