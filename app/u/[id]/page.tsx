"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'

export default function PublicProfile() {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const params = useParams()
    const recipientId = params.id

    const MAX_LENGTH = 500

    const handleSend = async () => {
        if (!message.trim()) {
            setError("Message cannot be empty")
            return
        }

        if (message.length > MAX_LENGTH) {
            setError(`Message is too long (max ${MAX_LENGTH} characters)`)
            return
        }

        setLoading(true)
        setError('')

        const { error: sendError } = await supabase
            .from('messages')
            .insert({
                content: message.trim(),
                recipient_id: recipientId,
            })

        if (sendError) {
            setError("Failed to send message. Please try again.")
            setLoading(false)
        } else {
            setSent(true)
            setMessage('')
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white text-center animate-in fade-in zoom-in">
                <div className="space-y-6">
                    <div className="text-6xl">🚀</div>
                    <h1 className="text-4xl font-bold">Message Sent!</h1>
                    <p className="text-slate-400">Your secret is safe with us.</p>
                    <Button
                        onClick={() => setSent(false)}
                        variant="secondary"
                        className="mt-4"
                    >
                        Send Another
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="w-full max-w-md space-y-6 mt-10">

                <div className="text-center text-white space-y-2">
                    <h1 className="text-3xl font-bold">Send me a message</h1>
                    <p className="text-slate-300">I won't know it's you. 🤫</p>
                </div>

                <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-lg">
                    <CardContent className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-lg border border-red-400/30">
                                <p className="text-red-200 text-sm text-center">{error}</p>
                            </div>
                        )}
                        <Textarea
                            placeholder="Type your secret message here..."
                            className="min-h-[150px] text-lg p-4 bg-white/20 border-0 text-white placeholder:text-slate-400 focus-visible:ring-offset-0"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={MAX_LENGTH}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">
                                {message.length} / {MAX_LENGTH}
                            </span>
                        </div>
                        <Button
                            className="w-full text-lg py-6 bg-white text-black hover:bg-slate-200"
                            onClick={handleSend}
                            disabled={loading || !message.trim()}
                        >
                            {loading ? "Sending..." : "Send Anonymously"}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

