'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Chat {
  id: string
  name: string
}

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn: boolean
  isViewOnce?: boolean
  mediaUrl?: string
}

interface ChatWindowProps {
  chat: Chat | null
  userId?: string
}

export function ChatWindow({ chat, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chat) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(recipient_id.eq.${userId},sender_id.eq.${chat.id}),and(recipient_id.eq.${chat.id},sender_id.eq.${userId})`)
        .order('created_at', { ascending: true })

      const formatted = data?.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: msg.sender_id === userId,
        isViewOnce: msg.is_view_once,
      })) || []

      setMessages(formatted)
    }

    loadMessages()
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, userId])

  const handleSend = async () => {
    if (!input.trim() || !chat || !userId) return

    setLoading(true)
    const { error } = await supabase.from('messages').insert({
      content: input.trim(),
      recipient_id: chat.id,
      sender_id: userId,
    })

    if (!error) {
      setInput('')
      setMessages([...messages, {
        id: Date.now().toString(),
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      }])
    }
    setLoading(false)
  }

  if (!chat) {
    return (
      <div className="hidden md:flex items-center justify-center h-full text-foreground/50">
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="font-bold text-lg">{chat.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-foreground/50 mt-8">No messages yet</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-xs px-4 py-2 ${
                msg.isOwn
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading}>
          Send
        </Button>
      </div>
    </div>
  )
}
