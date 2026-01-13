// import type { Metadata } from 'next'
// import './globals.css'
// import { ThemeProvider } from '../context/ThemeContext'

// export const metadata: Metadata = {
//   title: 'AI Career Intelligence Platform',
//   description: 'Analyze your resume and get personalized career recommendations',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <ThemeProvider>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }


import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../context/ThemeContext'

export const metadata: Metadata = {
  title: 'AI Career Intelligence Platform',
  description: 'Analyze your resume and get personalized career recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div id="app-root">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
