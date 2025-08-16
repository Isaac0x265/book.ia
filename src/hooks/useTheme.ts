import { useState, useEffect } from 'react'
import type { Theme } from '../types'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}

// i could have used a simpler approach to toggle the theme
// however i wanted to feel like im building something from "scratch"
// not that thats absurd logic but thats what i did