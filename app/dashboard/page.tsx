"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useTheme } from '@/lib/ThemeContext'
import { ChatList } from '@/components/ChatList'
import { ChatWindow } from '@/components/ChatWindow'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  isGroup: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [publicLink, setPublicLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [showLink, setShowLink] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setPublicLink(`${window.location.origin}/u/${user.id}`)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('user_profiles').insert({
          id: user.id,
          account_type: 'anonymous',
        })
      }

      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-card border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Ghost Note</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLink(!showLink)}
            className="text-sm"
          >
            Share Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'lite' : 'light')}
          >
            {theme === 'light' ? '🌙' : theme === 'dark' ? '💡' : '☀️'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              supabase.auth.signOut()
              router.push('/')
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {showLink && (
        <div className="bg-muted border-b border-border p-4">
          <p className="text-xs text-foreground/60 mb-2">Share this link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={publicLink}
              readOnly
              className="flex-1 px-3 py-2 bg-card border border-border rounded text-sm"
            />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(publicLink)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-80 border-r border-border overflow-hidden">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </div>

        <div className="hidden md:flex flex-1 overflow-hidden">
          <ChatWindow chat={selectedChat} userId={user?.id} />
        </div>
      </div>
    </div>
  )
}
