'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'lite'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = stored || preferred
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (t: Theme) => {
    const html = document.documentElement
    html.classList.remove('light', 'dark', 'lite')
    html.classList.add(t)

    if (t === 'dark') {
      html.style.colorScheme = 'dark'
    } else {
      html.style.colorScheme = 'light'
    }
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
