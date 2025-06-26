# MTS投資追蹤系統

一個現代化的投資組合管理和追蹤系統，使用Next.js 14、TypeScript、Firebase和Tailwind CSS構建。

## ✨ **功能特色**

- 🔐 **安全認證**：Firebase Authentication支援郵件密碼和Google登入
- 📊 **投資追蹤**：完整的投資組合管理和績效追蹤
- 📱 **響應式設計**：完美支援桌面和移動設備
- 🔄 **即時同步**：Firestore即時數據同步
- 🛡️ **風險控制**：智能風險管理和警報系統
- 📈 **數據分析**：深入的投資分析和報表

## 🚀 **快速開始**

### **環境要求**
- Node.js 18.0 或更高版本
- npm 或 yarn
- Firebase專案

### **安裝步驟**

1. **克隆專案**
```bash
git clone https://github.com/leehugh007/mts-investment-tracker.git
cd mts-investment-tracker
```

2. **安裝依賴**
```bash
npm install
```

3. **環境配置**
```bash
cp .env.local.example .env.local
```

編輯 `.env.local` 文件，填入您的Firebase配置：
```bash
# Firebase配置
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

4. **啟動開發伺服器**
```bash
npm run dev
```

5. **訪問應用程式**
打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 🏗️ **技術架構**

### **前端技術棧**
- **Next.js 14**: React框架，支援SSR和SSG
- **TypeScript**: 類型安全的JavaScript
- **Tailwind CSS**: 實用優先的CSS框架
- **Zustand**: 輕量級狀態管理
- **React Hook Form**: 高效能表單處理
- **Lucide Icons**: 現代化圖標庫

### **後端服務**
- **Firebase Authentication**: 用戶認證服務
- **Firestore**: NoSQL雲端數據庫
- **Firebase Analytics**: 使用分析
- **Next.js API Routes**: 伺服器端API

### **開發工具**
- **ESLint**: 程式碼品質檢查
- **Prettier**: 程式碼格式化
- **TypeScript**: 靜態類型檢查

## 📁 **專案結構**

```
mts-investment-tracker/
├── src/
│   ├── components/          # React組件
│   │   ├── auth/           # 認證相關組件
│   │   ├── layout/         # 佈局組件
│   │   └── ui/             # UI基礎組件
│   ├── hooks/              # 自定義React Hooks
│   ├── lib/                # 工具函數和配置
│   │   ├── firebase/       # Firebase配置和服務
│   │   └── utils.ts        # 通用工具函數
│   ├── pages/              # Next.js頁面
│   │   ├── api/            # API路由
│   │   ├── auth/           # 認證頁面
│   │   └── dashboard/      # 儀表板頁面
│   ├── stores/             # Zustand狀態管理
│   ├── styles/             # 全域樣式
│   └── types/              # TypeScript類型定義
├── public/                 # 靜態資源
├── firestore.rules         # Firestore安全規則
└── vercel.json            # Vercel部署配置
```

## 🔧 **可用腳本**

```bash
# 開發
npm run dev          # 啟動開發伺服器
npm run build        # 建置生產版本
npm run start        # 啟動生產伺服器
npm run lint         # 執行ESLint檢查
npm run type-check   # 執行TypeScript類型檢查
```

## 🚀 **部署**

### **Vercel部署（推薦）**
1. 將專案推送到GitHub
2. 在Vercel中導入GitHub儲存庫
3. 設置環境變數
4. 自動部署完成

詳細部署指引請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### **其他部署選項**
- Netlify
- AWS Amplify
- 自託管

## 🔒 **安全性**

- Firebase Authentication提供企業級安全性
- Firestore安全規則保護數據訪問
- 環境變數保護敏感配置
- HTTPS加密所有通信

## 📊 **功能模組**

### **已完成功能**
- ✅ 用戶註冊和登入
- ✅ Google OAuth登入
- ✅ 用戶資料管理
- ✅ 響應式儀表板
- ✅ 資本配置管理

### **開發中功能**
- 🔄 股票數據API整合
- 🔄 投資組合管理
- 🔄 交易記錄追蹤
- 🔄 風險控制系統
- 🔄 報表和分析

## 🤝 **貢獻指南**

1. Fork專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

## 📄 **授權**

本專案採用MIT授權 - 詳見 [LICENSE](LICENSE) 文件

## 📞 **支援**

如果您遇到任何問題或有建議，請：
- 開啟GitHub Issue
- 聯繫開發團隊

---

**MTS投資追蹤系統** - 讓投資管理更智能、更簡單！

