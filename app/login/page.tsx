"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email') // 'email' or 'verify'
  const [loading, setLoading] = useState(false)

  // Send the 6-digit code
const handleSendCode = async () => {
  console.log("Connecting to:", process.env.NEXT_PUBLIC_SUPABASE_URL); // ADD THIS LINE
  setLoading(true)
  // ... rest of your code

  const handleSendCode = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else setStep('verify')
    setLoading(false)
  }

  // Verify the 6-digit code
  const handleVerifyCode = async () => {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })
    if (error) alert(error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  return (
    // Matching your Figma dark background
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white">
      
      {/* Container card matching your dark theme */}
      <div className="w-full max-w-md p-8 space-y-8 bg-[#16161a] rounded-3xl shadow-2xl border border-gray-800">
        
        <div className="text-center space-y-3">
          <div className="mx-auto text-6xl mb-4 drop-shadow-lg">👻</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ghost Note</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Anonymous Identity</p>
        </div>

        <div className="space-y-5">
          {step === 'email' ? (
            <>
              <Input 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="py-7 bg-[#22222a] border-0 text-white placeholder:text-gray-500 rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-[#9333ea]"
              />
              <Button 
                className="w-full py-7 bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-purple-900/50" 
                onClick={handleSendCode} 
                disabled={loading}
              >
                {loading ? "Summoning code..." : "Get Access Code"}
              </Button>
            </>
          ) : (
            <>
              <Input 
                placeholder="Enter 6-digit code" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                className="py-7 bg-[#22222a] border-0 text-white placeholder:text-gray-500 rounded-2xl text-center text-2xl tracking-[0.5em] focus-visible:ring-1 focus-visible:ring-[#9333ea]"
                maxLength={6}
              />
              <Button 
                className="w-full py-7 bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-purple-900/50" 
                onClick={handleVerifyCode} 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Enter Ghost Note"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setStep('email')}
                className="w-full text-gray-400 hover:text-white"
              >
                Wrong email? Go back
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
