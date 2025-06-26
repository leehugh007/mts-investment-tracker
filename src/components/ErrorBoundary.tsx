import React, { Component, ErrorInfo, ReactNode } from 'react'
import { TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 錯誤邊界組件
 * 基於第一性原理：任何應用都應該能優雅地處理錯誤
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新state以顯示錯誤UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤詳情
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 這裡可以將錯誤發送到錯誤報告服務
    // 例如：Sentry, LogRocket 等
  }

  handleReload = () => {
    // 重新載入頁面
    window.location.reload()
  }

  handleReset = () => {
    // 重置錯誤狀態
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* 錯誤圖標 */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            {/* 標題 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              應用程式發生錯誤
            </h1>

            {/* 描述 */}
            <p className="text-gray-600 mb-6">
              很抱歉，應用程式遇到了意外錯誤。請嘗試重新載入頁面，或聯繫技術支援。
            </p>

            {/* 錯誤詳情（開發環境） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold text-gray-900 mb-2">錯誤詳情：</h3>
                <pre className="text-sm text-gray-700 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReload}
                className="flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重新載入頁面
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex items-center justify-center"
              >
                嘗試恢復
              </Button>
            </div>

            {/* 品牌標識 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-gray-500">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="text-sm">MTS投資追蹤系統</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

