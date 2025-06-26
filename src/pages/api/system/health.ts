import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/lib/firebase/config'

interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  services: {
    firebase: {
      status: 'healthy' | 'unhealthy'
      message?: string
    }
    api: {
      status: 'healthy' | 'unhealthy'
      message?: string
    }
  }
  version: string
  uptime: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        firebase: { status: 'unhealthy', message: 'Method not allowed' },
        api: { status: 'unhealthy', message: 'Method not allowed' }
      },
      version: '1.0.0',
      uptime: process.uptime()
    })
  }

  try {
    // 檢查Firebase連接
    let firebaseStatus: 'healthy' | 'unhealthy' = 'healthy'
    let firebaseMessage: string | undefined

    try {
      // 簡單檢查Firebase配置是否正確
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }
      firebaseStatus = 'healthy'
    } catch (error) {
      console.error('Firebase health check failed:', error)
      firebaseStatus = 'unhealthy'
      firebaseMessage = error instanceof Error ? error.message : 'Unknown error'
    }

    const overallStatus = firebaseStatus === 'healthy' ? 'healthy' : 'unhealthy'

    const healthResponse: HealthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        firebase: {
          status: firebaseStatus,
          message: firebaseMessage
        },
        api: {
          status: 'healthy'
        }
      },
      version: '1.0.0',
      uptime: process.uptime()
    }

    res.status(overallStatus === 'healthy' ? 200 : 503).json(healthResponse)
  } catch (error) {
    console.error('Health check error:', error)
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        firebase: { status: 'unhealthy', message: 'Service check failed' },
        api: { status: 'unhealthy', message: 'Service check failed' }
      },
      version: '1.0.0',
      uptime: process.uptime()
    })
  }
}

