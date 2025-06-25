import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth, allowMethods, validateRequestBody, ErrorCodes } from '@/lib/security/apiSecurity'
import { capitalAllocationSchema } from '@/lib/validation/schemas'

async function allocationsHandler(req: NextApiRequest, res: NextApiResponse, context: { userId: string }) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        return await getAllocations(req, res, context.userId)
      case 'POST':
        return await createAllocation(req, res, context.userId)
      default:
        return res.status(405).json({
          success: false,
          error: { 
            code: ErrorCodes.METHOD_NOT_ALLOWED, 
            message: `Method ${method} not allowed` 
          }
        })
    }
  } catch (error) {
    console.error('Allocations API error:', error)
    res.status(500).json({
      success: false,
      error: { 
        code: ErrorCodes.INTERNAL_ERROR, 
        message: 'Internal server error' 
      }
    })
  }
}

async function getAllocations(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const allocations = await prisma.capitalAllocation.findMany({
    where: { 
      userId,
      isActive: true 
    },
    include: {
      _count: {
        select: {
          transactions: true,
          holdings: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // 計算每個配置的統計信息
  const allocationsWithStats = await Promise.all(
    allocations.map(async (allocation) => {
      const holdings = await prisma.holding.findMany({
        where: { allocationId: allocation.id }
      })

      const totalInvested = holdings.reduce((sum, holding) => sum + Number(holding.totalCost), 0)
      const availableAmount = Number(allocation.availableAmount)
      const totalAmount = Number(allocation.totalAmount)

      return {
        ...allocation,
        totalAmount: Number(allocation.totalAmount),
        availableAmount: Number(allocation.availableAmount),
        stats: {
          totalInvested,
          availableAmount,
          utilizationRate: totalAmount > 0 ? ((totalAmount - availableAmount) / totalAmount) * 100 : 0,
          holdingsCount: holdings.length,
          transactionsCount: allocation._count.transactions
        }
      }
    })
  )

  res.status(200).json({
    success: true,
    data: { allocations: allocationsWithStats }
  })
}

async function createAllocation(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { name, description, totalAmount, currency, riskLevel } = req.body

  const allocation = await prisma.capitalAllocation.create({
    data: {
      userId,
      name,
      description,
      totalAmount,
      availableAmount: totalAmount,
      currency,
      riskLevel,
    },
    include: {
      _count: {
        select: {
          transactions: true,
          holdings: true
        }
      }
    }
  })

  // 記錄配置歷史
  await prisma.capitalAllocationHistory.create({
    data: {
      allocationId: allocation.id,
      actionType: 'create',
      amount: totalAmount,
      previousAvailable: 0,
      newAvailable: totalAmount,
      description: `創建資本配置: ${name}`
    }
  })

  res.status(201).json({
    success: true,
    data: { 
      allocation: {
        ...allocation,
        totalAmount: Number(allocation.totalAmount),
        availableAmount: Number(allocation.availableAmount),
        stats: {
          totalInvested: 0,
          availableAmount: Number(allocation.availableAmount),
          utilizationRate: 0,
          holdingsCount: 0,
          transactionsCount: 0
        }
      }
    }
  })
}

export default allowMethods(['GET', 'POST'])(
  (req: NextApiRequest, res: NextApiResponse, context?: any) => {
    if (req.method === 'POST') {
      return validateRequestBody(capitalAllocationSchema)(withAuth(allocationsHandler))(req, res, context)
    }
    return withAuth(allocationsHandler)(req, res, context)
  }
)

