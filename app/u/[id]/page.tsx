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

    // Get the User ID from the URL (the [id] folder)
    const params = useParams()
    const recipientId = params.id

    const handleSend = async () => {
        if (!message) return
        setLoading(true)

        // SEND MESSAGE TO SUPABASE
        const { error } = await supabase
            .from('messages')
            .insert({
                content: message,
                recipient_id: recipientId,
            })

        if (error) {
            alert("Error sending: " + error.message)
        } else {
            setSent(true)
            setMessage('')
        }
        setLoading(false)
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
                        <Textarea
                            placeholder="Type your secret message here..."
                            className="min-h-[150px] text-lg p-4 bg-white/20 border-0 text-white placeholder:text-slate-400 focus-visible:ring-offset-0"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            className="w-full text-lg py-6 bg-white text-black hover:bg-slate-200"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Anonymously 👻"}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

