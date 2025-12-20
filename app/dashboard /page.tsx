"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [publicLink, setPublicLink] = useState('') // <--- We store the link here now
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 2. CREATE LINK SAFELY (Only happens in browser)
      setPublicLink(`${window.location.origin}/u/${user.id}`)

      // 3. Get Messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setMessages(data)
      if (error) console.error("Error fetching messages:", error)

      setLoading(false)
    }
    getData()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading secrets...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inbox 📬</h1>
          <Button variant="ghost" onClick={() => {
            supabase.auth.signOut()
            router.push('/')
          }}>
            Sign Out
          </Button>
        </div>

        {/* The Link Card */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Your Anonymous Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-500">
              Share this link to receive anonymous messages.
            </p>
            <div className="p-3 bg-slate-100 rounded border font-mono text-xs break-all select-all">
              {publicLink}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(publicLink)
                alert("Link copied!")
              }}
            >
              Copy Link 📋
            </Button>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Messages ({messages.length})</h2>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-lg border border-dashed">
              <p>No messages yet.</p>
              <p className="text-sm mt-1">They will appear here automatically.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <Card key={msg.id} className="animate-in slide-in-from-bottom-2 duration-500">
                <CardContent className="p-5">
                  <p className="text-lg font-medium text-slate-800">{msg.content}</p>
                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
