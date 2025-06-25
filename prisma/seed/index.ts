import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('開始種子數據初始化...')

  // 創建測試用戶
  const hashedPassword = await hash('Test123!@#', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: hashedPassword,
      name: '測試用戶',
      timezone: 'Asia/Taipei',
      preferredCurrency: 'TWD',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  console.log('創建測試用戶:', testUser.email)

  // 創建測試資本配置
  const testAllocation = await prisma.capitalAllocation.create({
    data: {
      userId: testUser.id,
      name: '主要投資組合',
      description: '用於長期投資的主要資金配置',
      totalAmount: 100000,
      availableAmount: 100000,
      currency: 'TWD',
      riskLevel: 'moderate',
    },
  })

  console.log('創建測試資本配置:', testAllocation.name)

  // 創建用戶偏好設定
  await prisma.userPreference.createMany({
    data: [
      {
        userId: testUser.id,
        preferenceKey: 'dashboard_layout',
        preferenceValue: { layout: 'grid', columns: 2 },
      },
      {
        userId: testUser.id,
        preferenceKey: 'default_market',
        preferenceValue: { market: 'tw' },
      },
      {
        userId: testUser.id,
        preferenceKey: 'notification_settings',
        preferenceValue: { 
          email: true, 
          push: false, 
          riskAlerts: true 
        },
      },
    ],
  })

  console.log('創建用戶偏好設定')

  // 創建基礎風險設定
  await prisma.riskSetting.create({
    data: {
      userId: testUser.id,
      allocationId: testAllocation.id,
      settingType: 'position_limit',
      settingScope: 'allocation',
      maxLossPercentage: 2.0,
      stopLossPercentage: 5.0,
      positionSizeLimit: 10.0,
    },
  })

  console.log('創建基礎風險設定')

  // 創建示例交易記錄
  const sampleTransaction = await prisma.transaction.create({
    data: {
      userId: testUser.id,
      allocationId: testAllocation.id,
      market: 'tw',
      symbol: '2330',
      stockName: '台積電',
      transactionType: 'buy',
      shares: 100,
      price: 500.0,
      totalAmount: 50000,
      fee: 100,
      currency: 'TWD',
      transactionDate: new Date('2024-01-15'),
      notes: '初始投資台積電',
    },
  })

  console.log('創建示例交易記錄:', sampleTransaction.symbol)

  // 創建對應的持股記錄
  await prisma.holding.create({
    data: {
      userId: testUser.id,
      allocationId: testAllocation.id,
      market: 'tw',
      symbol: '2330',
      stockName: '台積電',
      totalShares: 100,
      averageCost: 500.0,
      totalCost: 50000,
      currency: 'TWD',
      firstPurchaseDate: new Date('2024-01-15'),
      lastTransactionDate: new Date('2024-01-15'),
    },
  })

  console.log('創建持股記錄')

  // 更新資本配置的可用金額
  await prisma.capitalAllocation.update({
    where: { id: testAllocation.id },
    data: {
      availableAmount: 50000, // 100000 - 50000
    },
  })

  console.log('更新資本配置')

  console.log('種子數據初始化完成!')
}

main()
  .catch((e) => {
    console.error('種子數據初始化失敗:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

