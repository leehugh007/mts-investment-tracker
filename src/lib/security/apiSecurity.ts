import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { z } from 'zod'

// API響應類型
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

// 錯誤代碼
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const

// API處理器類型
export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  context?: { userId?: string }
) => Promise<void>

/**
 * API安全中間件
 */
export function withAPISecurity(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // CORS設置
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
      )
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
      )

      // 處理OPTIONS請求
      if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
      }

      // 速率限制（簡單實現）
      const userAgent = req.headers['user-agent'] || ''
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
      
      // 這裡可以實現更複雜的速率限制邏輯
      
      await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Internal server error'
        }
      })
    }
  }
}

/**
 * 需要認證的API中間件
 */
export function withAuth(handler: ApiHandler) {
  return withAPISecurity(async (req, res) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.id) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: 'Authentication required'
        }
      })
    }

    await handler(req, res, { userId: session.user.id })
  })
}

/**
 * 請求體驗證中間件
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return (handler: ApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
      try {
        const validatedData = schema.parse(req.body)
        req.body = validatedData
        await handler(req, res, context)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: {
              code: ErrorCodes.VALIDATION_ERROR,
              message: 'Validation failed',
              details: error.errors
            }
          })
        }
        throw error
      }
    }
  }
}

/**
 * 方法驗證中間件
 */
export function allowMethods(methods: string[]) {
  return (handler: ApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
      if (!methods.includes(req.method || '')) {
        return res.status(405).json({
          success: false,
          error: {
            code: ErrorCodes.METHOD_NOT_ALLOWED,
            message: `Method ${req.method} not allowed`
          }
        })
      }
      await handler(req, res, context)
    }
  }
}

/**
 * 記錄安全事件
 */
export function logSecurityEvent(event: {
  type: string
  userId?: string
  ip?: string
  userAgent?: string
  details?: any
}) {
  // 這裡可以實現日誌記錄邏輯
  console.log('Security Event:', {
    timestamp: new Date().toISOString(),
    ...event
  })
}

