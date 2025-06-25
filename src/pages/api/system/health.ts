import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAPISecurity, allowMethods } from '@/lib/security/apiSecurity'

async function healthHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 檢查數據庫連接
    await prisma.$queryRaw`SELECT 1`
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'healthy',
        api: 'healthy'
      },
      uptime: process.uptime()
    }

    res.status(200).json({
      success: true,
      data: health
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'unhealthy',
        api: 'healthy'
      },
      uptime: process.uptime(),
      error: 'Database connection failed'
    }

    res.status(503).json({
      success: false,
      data: health
    })
  }
}

export default allowMethods(['GET'])(withAPISecurity(healthHandler))

