"use client"
import { useState } from "react"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [viewOnce, setViewOnce] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 border-b border-zinc-900 flex justify-between">
        <span className="text-purple-500 font-bold">Ghost Chat</span>
        <button 
          onClick={() => setViewOnce(!viewOnce)}
          className={`text-xs px-3 py-1 rounded-full border ${viewOnce ? 'bg-purple-600 border-purple-600' : 'border-zinc-700'}`}
        >
          {viewOnce ? "👁️ View Once ON" : "View Once OFF"}
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="bg-zinc-900 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto">
          <p className="text-sm">Welcome! Try typing *bold* or _italic_.</p>
        </div>
      </div>

      <footer className="p-4 bg-zinc-900/50 backdrop-blur-lg">
        <input 
          className="w-full bg-zinc-800 p-3 rounded-xl outline-none"
          placeholder="Send a ghost message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </footer>
    </div>
  )
}