"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// This acts as a "Client-Side Shield" for your theme
export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}