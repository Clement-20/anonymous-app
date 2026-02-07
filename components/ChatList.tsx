'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  isGroup: boolean
}

interface ChatListProps {
  onSelectChat: (chat: Chat) => void
  selectedChatId?: string
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      const chatMap = new Map<string, Chat>()

      messages?.forEach((msg) => {
        const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
        if (otherId && !chatMap.has(otherId)) {
          chatMap.set(otherId, {
            id: otherId,
            name: `User ${otherId.slice(0, 8)}`,
            lastMessage: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isGroup: false,
          })
        }
      })

      setChats(Array.from(chatMap.values()))
      setLoading(false)
    }

    loadChats()
  }, [])

  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="p-4 text-center text-foreground/50">Loading chats...</div>

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm">+</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-foreground/50 text-sm">
            No chats yet. Share your link to get started!
          </div>
        ) : (
          filtered.map(chat => (
            <Card
              key={chat.id}
              className={`mx-2 my-2 p-4 cursor-pointer transition-colors ${
                selectedChatId === chat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{chat.name}</p>
                  <p className="text-xs opacity-70 truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs opacity-60 whitespace-nowrap">{chat.timestamp}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
