"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase" // Ensure this path matches your project

export default function GhostNoteDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        setProfile(data)
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  // 🛡️ SHIELD: This stops the white screen crash
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-purple-500 animate-pulse text-xl font-bold">
          Ghost Note Loading...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-500">Ghost Note</h1>
        {/* The ?. prevents crashing if ghost_id is missing */}
        <span className="bg-zinc-900 px-4 py-1 rounded-full text-sm border border-zinc-800">
          {profile?.ghost_id || "Anonymous Ghost"}
        </span>
      </header>

      <section className="space-y-4">
        <p className="text-zinc-400">Welcome to your secure ghost space.</p>
        <div className="border border-dashed border-zinc-800 p-10 rounded-xl text-center">
           <p className="text-zinc-600 italic">No secret chats yet...</p>
        </div>
      </section>
    </main>
  )
}