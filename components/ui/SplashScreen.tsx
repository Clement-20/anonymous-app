"use client"

import { useEffect, useState } from "react"
import { Ghost } from "lucide-react" // We'll use an icon if you don't have an image

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Wait for 2.5 seconds, then hide the splash screen
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-1000 animate-out fade-out">
            <div className="flex flex-col items-center animate-bounce">
                {/* The Big Ghost Logo */}
                <span className="text-6xl mb-4">👻</span>

                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                    Ghost Note
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                    Loading Secrets...
                </p>
            </div>
        </div>
    )
}
