'use client'

import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect runs only on the client, so we can safely access localStorage here
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Render nothing on the server side
  }

  const toggleTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as 'light' | 'dark' | 'accent')
  }

  return (
    <div className="theme-toggle">
      <label htmlFor="theme-select" className="sr-only">Choose theme</label>
      <select
        id="theme-select"
        value={theme}
        onChange={toggleTheme}
        className="theme-select-dropdown"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="accent">Accent</option>
      </select>
    </div>
  )
}

export default ThemeToggle
