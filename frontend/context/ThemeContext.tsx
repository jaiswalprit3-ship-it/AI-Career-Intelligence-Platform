// 'use client'

// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'

// type Theme = 'light' | 'dark' | 'accent'

// interface ThemeContextType {
//   theme: Theme
//   setTheme: (theme: Theme) => void
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [theme, setThemeState] = useState<Theme>('light')

//   useEffect(() => {
//     // Load theme from localStorage on mount
//     const savedTheme = localStorage.getItem('app-theme') as Theme | null
//     if (savedTheme) {
//       setThemeState(savedTheme)
//       document.documentElement.setAttribute('data-theme', savedTheme)
//     } else {
//       // Default to light theme and set attribute
//       document.documentElement.setAttribute('data-theme', 'light')
//     }
//   }, [])

//   const setTheme = (newTheme: Theme) => {
//     setThemeState(newTheme)
//     localStorage.setItem('app-theme', newTheme)
//     document.documentElement.setAttribute('data-theme', newTheme)
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext)
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider')
//   }
//   return context
// }


'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'accent'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ✅ CHANGE 1: default theme = 'accent'
  const [theme, setThemeState] = useState<Theme>('accent')

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('app-theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // ✅ CHANGE 2: default to accent theme
      document.documentElement.setAttribute('data-theme', 'accent')
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('app-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
