// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import ThemeToggle from '../components/ThemeToggle'

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// interface Resume {
//   id: string
//   resume_text: string
//   created_at: string
// }

// export default function Dashboard() {
//   const router = useRouter()
//   const [resumes, setResumes] = useState<Resume[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchResumes()
//   }, [])

//   const fetchResumes = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/resumes`)
//       if (response.ok) {
//         const data = await response.json()
//         setResumes(data || [])
//       }
//     } catch (err) {
//       console.error('Error fetching resumes:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })
//   }

//   const cards = [
//     {
//       title: 'Upload Resume',
//       description: 'Upload and save your resume for analysis',
//       link: '/upload',
//       icon: '📄',
//       color: '#2563eb'
//     },
//     {
//       title: 'Resume List',
//       description: 'View all your saved resumes',
//       link: '/resumes',
//       icon: '📋',
//       color: '#059669'
//     },
//     {
//       title: 'Skill Gap Analysis',
//       description: 'Analyze gaps in your skills using AI',
//       link: '/skill-gap',
//       icon: '🔍',
//       color: '#dc2626'
//     },
//     {
//       title: 'Career Recommendations',
//       description: 'Get personalized career path recommendations',
//       link: '/career',
//       icon: '💼',
//       color: '#7c3aed'
//     },
//     {
//       title: 'Learning Roadmap',
//       description: 'Get a customized learning roadmap for your career',
//       link: '/roadmap',
//       icon: '🗺️',
//       color: '#ea580c'
//     }
//   ]

//   const lastResume = resumes.length > 0 ? resumes[0] : null

//   return (
//     <div>
//       <header className="header">
//         <div className="container flex justify-between items-center">
//           <h1>AI Career Intelligence Platform</h1>
//           <nav className="nav">
//             <Link href="/">Dashboard</Link>
//             <Link href="/upload">Upload Resume</Link>
//             <Link href="/resumes">Resumes</Link>
//             <ThemeToggle />
//           </nav>
//         </div>
//       </header>

//       <main className="container">
//         <div className="card" style={{ marginBottom: '2rem' }}>
//           <h2 style={{ marginBottom: '0.5rem', color: 'var(--heading-color)', fontSize: '1.875rem', fontWeight: 700 }}>
//             Welcome to Your Career Dashboard
//           </h2>
//           <p style={{ color: 'var(--muted-text-color)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
//             Upload your resume and leverage AI to analyze skill gaps, get career recommendations, and create personalized learning roadmaps.
//           </p>

//           {!loading && (
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <div className="stat-value">{resumes.length}</div>
//                 <div className="stat-label">Total Resumes</div>
//               </div>
//               {lastResume && (
//                 <div className="stat-card">
//                   <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--text-color)' }}>
//                     {formatDate(lastResume.created_at)}
//                   </div>
//                   <div className="stat-label">Last Upload</div>
//                 </div>
//               )}
//               <div className="stat-card">
//                 <div className="stat-value" style={{ fontSize: '1.5rem' }}>✨</div>
//                 <div className="stat-label">AI-Powered</div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '1rem' }}>
//           <h3 style={{ color: 'var(--heading-color)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
//             Quick Actions
//           </h3>
//         </div>

//         <div className="card-grid">
//           {cards.map((card) => (
//             <div
//               key={card.title}
//               className="card-item"
//               onClick={() => router.push(card.link)}
//             >
//               <div style={{ 
//                 fontSize: '3rem', 
//                 marginBottom: '1rem',
//                 filter: 'grayscale(0.2)'
//               }}>
//                 {card.icon}
//               </div>
//               <h2 style={{ color: card.color }}>{card.title}</h2>
//               <p style={{ color: 'var(--muted-text-color)', lineHeight: 1.6 }}>{card.description}</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from '../components/ThemeToggle'
import { getClientId } from '@/lib/clientId'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface Resume {
  id: string
  resume_text: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const clientId = getClientId()
      const response = await fetch(
        `${BACKEND_URL}/resumes?client_id=${clientId}`
      )
      if (response.ok) {
        const data = await response.json()
        setResumes(data || [])
      }
    } catch (err) {
      console.error('Error fetching resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const cards = [
    { title: 'Upload Resume', link: '/upload', icon: '📄', desc: 'Upload and save your resume' },
    { title: 'Resume List', link: '/resumes', icon: '📋', desc: 'View saved resumes' },
    { title: 'Skill Gap Analysis', link: '/skill-gap', icon: '🔍', desc: 'Analyze missing skills' },
    { title: 'Career Recommendations', link: '/career', icon: '💼', desc: 'Explore career paths' },
    { title: 'Learning Roadmap', link: '/roadmap', icon: '🗺️', desc: 'Build your learning plan' },
  ]

  const lastResume = resumes[0]

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <h1 className="header-title">AI Career Intelligence Platform</h1>
          <nav className="nav">
            <Link href="/">Dashboard</Link>
            <Link href="/upload">Upload</Link>
            <Link href="/resumes">Resumes</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">
        {/* HERO CARD */}
        <section className="card dashboard-hero">
          <h2>Welcome back 👋</h2>
          <p>
            Upload your resume and use AI to analyze skill gaps, get career
            recommendations, and create personalized learning roadmaps.
          </p>

          {!loading && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{resumes.length}</div>
                <div className="stat-label">Total Resumes</div>
              </div>

              {lastResume && (
                <div className="stat-card">
                  <div className="stat-value small">
                    {formatDate(lastResume.created_at)}
                  </div>
                  <div className="stat-label">Last Upload</div>
                </div>
              )}

              <div className="stat-card">
                <div className="stat-value">✨</div>
                <div className="stat-label">AI Powered</div>
              </div>
            </div>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h3 className="section-title">Quick Actions</h3>

          <div className="card-grid">
            {cards.map(card => (
              <button
                key={card.title}
                className="card-item"
                onClick={() => router.push(card.link)}
                aria-label={card.title}
              >
                <span className="card-icon">{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
