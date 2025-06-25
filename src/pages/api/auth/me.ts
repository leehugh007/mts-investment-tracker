import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth, allowMethods, ErrorCodes } from '@/lib/security/apiSecurity'

async function meHandler(req: NextApiRequest, res: NextApiResponse, context: { userId: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        timezone: true,
        preferredCurrency: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        preferences: {
          select: {
            preferenceKey: true,
            preferenceValue: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { 
          code: ErrorCodes.NOT_FOUND, 
          message: 'User not found' 
        }
      })
    }

    // 轉換偏好設定為更易用的格式
    const preferences = user.preferences.reduce((acc, pref) => {
      acc[pref.preferenceKey] = pref.preferenceValue
      return acc
    }, {} as Record<string, any>)

    res.status(200).json({
      success: true,
      data: { 
        user: {
          ...user,
          preferences
        }
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: { 
        code: ErrorCodes.INTERNAL_ERROR, 
        message: 'Internal server error' 
      }
    })
  }
}

export default allowMethods(['GET'])(withAuth(meHandler))

