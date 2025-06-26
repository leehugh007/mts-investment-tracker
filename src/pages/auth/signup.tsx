import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react'
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const signUpSchema = z.object({
  displayName: z.string().min(1, '請輸入姓名').max(100, '姓名過長'),
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string()
    .min(8, '密碼至少需要8個字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
      '密碼必須包含大小寫字母、數字和特殊字符'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, '請同意服務條款')
}).refine(data => data.password === data.confirmPassword, {
  message: '密碼確認不匹配',
  path: ['confirmPassword']
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { addNotification } = useUIStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    try {
      await registerWithEmail(
        data.email,
        data.password,
        data.displayName
      )
      addNotification({
        type: 'success',
        title: '註冊成功',
        message: '歡迎加入MTS投資追蹤系統！請檢查您的電子郵件以驗證帳號。'
      })
      router.push('/dashboard')
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: '註冊失敗',
        message: error.message || '註冊時發生錯誤，請重試'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      const { isNewUser } = await signInWithGoogle()
      addNotification({
        type: 'success',
        title: isNewUser ? '註冊成功' : '登入成功',
        message: isNewUser ? '歡迎加入MTS投資追蹤系統！' : '歡迎回到MTS投資追蹤系統！'
      })
      router.push('/dashboard')
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Google註冊失敗',
        message: error.message || 'Google註冊時發生錯誤，請重試'
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MTS投資追蹤系統
          </h1>
          <p className="text-gray-600">
            創建您的帳號以開始管理投資組合
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>註冊</CardTitle>
            <CardDescription>
              填寫以下資訊以創建您的帳號
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('displayName')}
                  type="text"
                  placeholder="姓名"
                  className="pl-10"
                  error={errors.displayName?.message}
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="電子郵件地址"
                  className="pl-10"
                  error={errors.email?.message}
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="密碼"
                  className="pl-10 pr-10"
                  error={errors.password?.message}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="確認密碼"
                  className="pl-10 pr-10"
                  error={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label className="text-sm text-gray-700">
                  我同意{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    服務條款
                  </Link>{' '}
                  和{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    隱私政策
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading || isGoogleLoading}
              >
                註冊
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或者
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
              loading={isGoogleLoading}
              disabled={isLoading || isGoogleLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              使用Google註冊
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                已經有帳號？{' '}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  立即登入
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

