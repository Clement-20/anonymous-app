"use client"

import Link from 'next/link'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function GhostNoteDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (data) setProfile(data)
        }
      } catch (err) {
        console.error("Profile fetch failed", err)
      } finally {
        // This ensures the loading screen ALWAYS disappears after 2 seconds
        setTimeout(() => setLoading(false), 2000)
      }
    }
    getProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-purple-500 animate-pulse text-2xl font-bold tracking-tighter">
          GHOST NOTE
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Ghost Note</h1>
        <div className="bg-zinc-900 px-4 py-1 rounded-full text-xs border border-zinc-800 text-zinc-400">
          {profile?.ghost_id || "Ghost #????"}
        </div>
      </header>

      {/* This is your new "Welcome" area */}
      <div className="mt-20 text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight">WELCOME GHOST</h2>
        <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">
          Your messages are encrypted and set to self-destruct.
        </p>
        <Link href="/chat">
         <button className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-900/20">
    Start Secret Chat
         </button>
        </Link>
      </div>
    </main>
  )
}