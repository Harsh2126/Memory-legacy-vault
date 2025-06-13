"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function DarkModeScript() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Check if theme is already set in localStorage
    const storedTheme = localStorage.getItem("theme")

    if (!storedTheme) {
      // If no theme is set, use system preference
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [setTheme])

  return null
}
