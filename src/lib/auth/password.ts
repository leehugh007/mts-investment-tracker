import { hash, compare } from 'bcryptjs'

export class PasswordService {
  private static readonly SALT_ROUNDS = 12

  /**
   * 哈希密碼
   */
  static async hashPassword(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS)
  }

  /**
   * 驗證密碼
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }

  /**
   * 驗證密碼強度
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('密碼至少需要8個字符')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('密碼必須包含至少一個小寫字母')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('密碼必須包含至少一個大寫字母')
    }

    if (!/\d/.test(password)) {
      errors.push('密碼必須包含至少一個數字')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('密碼必須包含至少一個特殊字符')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export const passwordService = PasswordService

