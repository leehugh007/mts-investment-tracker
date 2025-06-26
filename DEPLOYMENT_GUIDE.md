# MTS投資追蹤系統 - Vercel部署指引

## 🚀 **自動部署步驟**

### **第一步：連接GitHub到Vercel**
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇 "Import Git Repository"
4. 找到並選擇 `mts-investment-tracker` 儲存庫
5. 點擊 "Import"

### **第二步：設置環境變數**
在Vercel專案設置中，添加以下環境變數：

```bash
# Firebase配置 (從您的Firebase專案獲取)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_tk-FTfQgj-WS1l8qb78t0VPTyE2I5Gs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mts-investment-tracker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mts-investment-tracker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mts-investment-tracker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=788683523128
NEXT_PUBLIC_FIREBASE_APP_ID=1:788683523128:web:fd08f6f77e0066d772d2cd
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HJXS24XKPJ

# 應用程式配置
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
NODE_ENV=production
```

### **第三步：部署設置**
1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Install Command**: `npm install`
5. **Development Command**: `npm run dev`

### **第四步：域名設置**
1. 在Vercel專案設置中，前往 "Domains"
2. 添加您的自定義域名（可選）
3. 或使用Vercel提供的免費域名

## 🔧 **Firebase設置**

### **更新Firebase授權域名**
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案 `mts-investment-tracker`
3. 前往 "Authentication" → "Settings" → "Authorized domains"
4. 添加您的Vercel域名：
   - `your-app-name.vercel.app`
   - 如果有自定義域名也要添加

### **Firestore安全規則部署**
1. 在Firebase Console中，前往 "Firestore Database" → "Rules"
2. 複製專案中的 `firestore.rules` 內容
3. 貼上並點擊 "Publish"

## 📋 **部署檢查清單**

### **部署前檢查**
- [ ] 所有環境變數已正確設置
- [ ] Firebase授權域名已更新
- [ ] Firestore安全規則已部署
- [ ] GitHub儲存庫已連接到Vercel

### **部署後測試**
- [ ] 網站可以正常訪問
- [ ] 主頁顯示正常
- [ ] 註冊功能正常
- [ ] 登入功能正常
- [ ] Google登入功能正常
- [ ] 儀表板可以訪問
- [ ] 用戶資料正確顯示

## 🐛 **常見問題解決**

### **問題1：Firebase連接失敗**
**解決方案**：
- 檢查環境變數是否正確設置
- 確認Firebase專案ID正確
- 檢查Firebase授權域名設置

### **問題2：認證失敗**
**解決方案**：
- 確認Firebase Authentication已啟用
- 檢查授權域名包含Vercel域名
- 確認Google登入設置正確

### **問題3：頁面載入錯誤**
**解決方案**：
- 檢查Vercel部署日誌
- 確認所有依賴包正確安裝
- 檢查Next.js配置

### **問題4：API路由錯誤**
**解決方案**：
- 確認API路由檔案路徑正確
- 檢查環境變數設置
- 查看Vercel Functions日誌

## 📞 **支援資源**

- [Vercel文件](https://vercel.com/docs)
- [Next.js部署指南](https://nextjs.org/docs/deployment)
- [Firebase託管設置](https://firebase.google.com/docs/hosting)

## 🔄 **持續部署**

每次推送到GitHub的main分支時，Vercel會自動：
1. 拉取最新程式碼
2. 安裝依賴
3. 建置專案
4. 部署到生產環境

這確保您的應用程式始終是最新版本！

---

**注意**：首次部署可能需要5-10分鐘，請耐心等待。部署完成後，您會收到部署成功的通知和網站URL。

