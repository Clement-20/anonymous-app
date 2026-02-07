"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTheme } from '@/lib/ThemeContext'

type AccountType = 'anonymous' | 'normal'
type Step = 'account-type' | 'email' | 'code'

export default function LoginPage() {
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>('account-type')
  const [error, setError] = useState('')
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSelectAccountType = (type: AccountType) => {
    setAccountType(type)
    setStep('email')
  }

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError('')

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email,
    })

    if (sendError) {
      setError(sendError.message)
      setLoading(false)
    } else {
      setStep('code')
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!code || code.length < 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    setError('')

    const { error: verifyError, data } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email',
    })

    if (verifyError) {
      setError("Invalid code. Please try again.")
      setLoading(false)
    } else {
      const user = data?.user
      if (user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            account_type: accountType,
            display_name: accountType === 'normal' ? email.split('@')[0] : undefined,
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }
      router.push('/dashboard')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => Promise<void>) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-primary text-primary-foreground' : ''}
        >
          Light
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-primary text-primary-foreground' : ''}
        >
          Dark
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme('lite')}
          className={theme === 'lite' ? 'bg-primary text-primary-foreground' : ''}
        >
          Lite
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Ghost Note - Anonymous Messaging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {step === 'account-type' && (
            <>
              <p className="text-center text-sm text-foreground/70 mb-6">Choose account type:</p>
              <Button
                variant="outline"
                className="w-full py-6 text-lg"
                onClick={() => handleSelectAccountType('anonymous')}
              >
                Anonymous
              </Button>
              <Button
                className="w-full py-6 text-lg"
                onClick={() => handleSelectAccountType('normal')}
              >
                Normal Account
              </Button>
              <p className="text-xs text-center text-foreground/50 mt-6">
                Anonymous: Stay private and send views-once messages
              </p>
              <p className="text-xs text-center text-foreground/50">
                Normal: Keep your identity with your username
              </p>
            </>
          )}

          {step === 'email' && (
            <>
              {error && (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg text-center border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}
              <Input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSendOtp)}
                className="text-lg p-6"
                disabled={loading}
              />
              <Button
                className="w-full text-lg py-6"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending Code..." : "Send Code"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep('account-type')}
                disabled={loading}
              >
                Back
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              {error && (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg text-center border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-800 mb-2">
                <p className="text-blue-700 dark:text-blue-200 text-sm font-medium">Check your email for a 6-digit code</p>
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={(e) => handleKeyPress(e, handleVerifyOtp)}
                className="text-lg p-6 text-center tracking-widest"
                maxLength={6}
                disabled={loading}
              />
              <Button
                className="w-full text-lg py-6"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep('email')}
                disabled={loading}
              >
                Back
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
