import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const signInSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '請輸入密碼')
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { addNotification } = useUIStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    try {
      await signInWithEmail(data.email, data.password)
      addNotification({
        type: 'success',
        title: '登入成功',
        message: '歡迎回到MTS投資追蹤系統！'
      })
      router.push('/dashboard')
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: '登入失敗',
        message: error.message || '登入時發生錯誤，請重試'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
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
        title: 'Google登入失敗',
        message: error.message || 'Google登入時發生錯誤，請重試'
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
            登入您的帳號以開始管理投資組合
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登入</CardTitle>
            <CardDescription>
              使用您的電子郵件和密碼登入
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  忘記密碼？
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading || isGoogleLoading}
              >
                登入
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
              onClick={handleGoogleSignIn}
              loading={isGoogleLoading}
              disabled={isLoading || isGoogleLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              使用Google登入
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                還沒有帳號？{' '}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  立即註冊
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

