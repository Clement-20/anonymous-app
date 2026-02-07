"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

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
      setSent(true)
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

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email',
    })

    if (verifyError) {
      setError("Invalid code. Please try again.")
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => Promise<void>) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to check your anonymous messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {!sent ? (
            <>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-700 text-sm">{error}</p>
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
            </>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200 mb-2">
                <p className="text-blue-700 text-sm font-medium">Check your email for a 6-digit code</p>
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
                className="w-full text-sm"
                onClick={() => {
                  setSent(false)
                  setCode('')
                  setError('')
                }}
                disabled={loading}
              >
                Back to Email
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
