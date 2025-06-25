import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { passwordService } from '@/lib/auth/password'
import { withAPISecurity, validateRequestBody, allowMethods, ErrorCodes } from '@/lib/security/apiSecurity'
import { registerSchema } from '@/lib/validation/schemas'

async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, name, timezone, preferredCurrency } = req.body

  try {
    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { 
          code: 'USER_EXISTS', 
          message: '該電子郵件已被註冊' 
        }
      })
    }

    // 驗證密碼強度
    const passwordValidation = passwordService.validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: '密碼不符合安全要求',
          details: passwordValidation.errors
        }
      })
    }

    // 哈希密碼
    const passwordHash = await passwordService.hashPassword(password)

    // 創建用戶
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        timezone,
        preferredCurrency,
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        preferredCurrency: true,
        createdAt: true
      }
    })

    // 創建默認資本配置
    await prisma.capitalAllocation.create({
      data: {
        userId: user.id,
        name: '主要投資組合',
        description: '默認的投資資金配置',
        totalAmount: 0,
        availableAmount: 0,
        currency: preferredCurrency,
        riskLevel: 'moderate',
      }
    })

    // 創建默認用戶偏好
    await prisma.userPreference.createMany({
      data: [
        {
          userId: user.id,
          preferenceKey: 'dashboard_layout',
          preferenceValue: { layout: 'grid', columns: 2 }
        },
        {
          userId: user.id,
          preferenceKey: 'default_market',
          preferenceValue: { market: 'tw' }
        },
        {
          userId: user.id,
          preferenceKey: 'notification_settings',
          preferenceValue: { 
            email: true, 
            push: false, 
            riskAlerts: true 
          }
        }
      ]
    })

    res.status(201).json({
      success: true,
      data: { user }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: { 
        code: ErrorCodes.INTERNAL_ERROR, 
        message: '註冊失敗，請重試' 
      }
    })
  }
}

export default allowMethods(['POST'])(
  validateRequestBody(registerSchema)(
    withAPISecurity(registerHandler)
  )
)

