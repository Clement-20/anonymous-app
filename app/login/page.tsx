"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      alert("Error: " + error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
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
              <Input 
                type="email" 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg p-6"
              />
              <Button 
                className="w-full text-lg py-6" 
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Sending Link..." : "Send Login Link 🪄"}
              </Button>
            </>
          ) : (
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
              <h3 className="text-green-800 font-bold text-lg mb-2">Check your Email! 📧</h3>
              <p className="text-green-700">We sent you a Magic Link to sign in.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
