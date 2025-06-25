import { z } from 'zod'

// 用戶註冊驗證
export const registerSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string()
    .min(8, '密碼至少需要8個字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
      '密碼必須包含大小寫字母、數字和特殊字符'),
  name: z.string().min(1, '姓名不能為空').max(100, '姓名過長'),
  timezone: z.string().default('Asia/Taipei'),
  preferredCurrency: z.string().default('TWD')
})

// 用戶登入驗證
export const loginSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '請輸入密碼')
})

// 資本配置驗證
export const capitalAllocationSchema = z.object({
  name: z.string().min(1, '配置名稱不能為空').max(100, '配置名稱過長'),
  description: z.string().optional(),
  totalAmount: z.number().min(0, '總金額不能為負數'),
  currency: z.string().min(1, '貨幣不能為空'),
  riskLevel: z.enum(['conservative', 'moderate', 'aggressive'], {
    errorMap: () => ({ message: '風險等級必須是 conservative、moderate 或 aggressive' })
  })
})

// 交易記錄驗證
export const transactionSchema = z.object({
  allocationId: z.string().min(1, '資本配置ID不能為空'),
  market: z.string().min(1, '市場不能為空'),
  symbol: z.string().min(1, '股票代碼不能為空'),
  stockName: z.string().optional(),
  transactionType: z.enum(['buy', 'sell'], {
    errorMap: () => ({ message: '交易類型必須是 buy 或 sell' })
  }),
  shares: z.number().int().min(1, '股數必須是正整數'),
  price: z.number().min(0, '價格不能為負數'),
  fee: z.number().min(0, '手續費不能為負數').default(0),
  currency: z.string().min(1, '貨幣不能為空'),
  transactionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '請輸入有效的日期格式'
  }),
  notes: z.string().optional()
})

// 風險設定驗證
export const riskSettingSchema = z.object({
  allocationId: z.string().optional(),
  settingType: z.enum(['position_limit', 'stop_loss', 'daily_loss'], {
    errorMap: () => ({ message: '設定類型必須是 position_limit、stop_loss 或 daily_loss' })
  }),
  settingScope: z.enum(['allocation', 'position', 'global']).default('allocation'),
  targetSymbol: z.string().optional(),
  targetMarket: z.string().optional(),
  maxLossPercentage: z.number().min(0).max(100).optional(),
  stopLossPercentage: z.number().min(0).max(100).optional(),
  positionSizeLimit: z.number().min(0).max(100).optional(),
  maxPositionValue: z.number().min(0).optional(),
  dailyLossLimit: z.number().min(0).optional()
})

// 用戶偏好設定驗證
export const userPreferenceSchema = z.object({
  preferenceKey: z.string().min(1, '偏好鍵不能為空'),
  preferenceValue: z.any()
})

// 分頁參數驗證
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// 搜索篩選驗證
export const searchFiltersSchema = z.object({
  market: z.string().optional(),
  symbol: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  transactionType: z.enum(['buy', 'sell']).optional(),
  allocationId: z.string().optional()
})

// 股票查詢驗證
export const stockQuerySchema = z.object({
  market: z.string().min(1, '市場不能為空'),
  symbol: z.string().min(1, '股票代碼不能為空')
})

// 批量股票查詢驗證
export const batchStockQuerySchema = z.object({
  stocks: z.array(stockQuerySchema).min(1, '至少需要一個股票').max(50, '最多支持50個股票')
})

// 密碼更改驗證
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入當前密碼'),
  newPassword: z.string()
    .min(8, '新密碼至少需要8個字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
      '新密碼必須包含大小寫字母、數字和特殊字符'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '新密碼確認不匹配',
  path: ['confirmPassword']
})

// 用戶資料更新驗證
export const updateUserProfileSchema = z.object({
  name: z.string().min(1, '姓名不能為空').max(100, '姓名過長').optional(),
  timezone: z.string().optional(),
  preferredCurrency: z.string().optional(),
  avatarUrl: z.string().url('請輸入有效的URL').optional()
})

// 導出類型
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type CapitalAllocationData = z.infer<typeof capitalAllocationSchema>
export type TransactionData = z.infer<typeof transactionSchema>
export type RiskSettingData = z.infer<typeof riskSettingSchema>
export type UserPreferenceData = z.infer<typeof userPreferenceSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
export type SearchFilters = z.infer<typeof searchFiltersSchema>
export type StockQuery = z.infer<typeof stockQuerySchema>
export type BatchStockQuery = z.infer<typeof batchStockQuerySchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type UpdateUserProfileData = z.infer<typeof updateUserProfileSchema>

