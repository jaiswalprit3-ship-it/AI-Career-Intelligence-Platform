// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// interface Resume {
//   id: string
//   resume_text: string
//   created_at: string
// }

// export default function ResumeList() {
//   const router = useRouter()
//   const [resumes, setResumes] = useState<Resume[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchResumes()
//   }, [])

//   const fetchResumes = async () => {
//     try {
//       setLoading(true)
//       setError('')
      
//       const response = await fetch(`${BACKEND_URL}/resumes`)
      
//       if (!response.ok) {
//         throw new Error('Failed to load resumes')
//       }
      
//       const data = await response.json()
//       setResumes(data || [])
//     } catch (err: any) {
//       setError(err.message || 'An error occurred while loading resumes')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const truncateText = (text: string, maxLength: number = 200) => {
//     if (text.length <= maxLength) return text
//     return text.substring(0, maxLength) + '...'
//   }

//   return (
//     <div>
//       <header className="header">
//         <div className="container">
//           <h1>AI Career Intelligence Platform</h1>
//           <nav className="nav">
//             <Link href="/">Dashboard</Link>
//             <Link href="/upload">Upload Resume</Link>
//             <Link href="/resumes">Resumes</Link>
//           </nav>
//         </div>
//       </header>

//       <main className="container">
//         <Link href="/" className="back-link">← Back to Dashboard</Link>

//         <div className="card">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
//             <div>
//               <h2 style={{ color: '#1f2937', fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Your Resumes</h2>
//               <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
//                 {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} saved
//               </p>
//             </div>
//             <Link href="/upload" className="btn" style={{ marginTop: 0 }}>Upload New Resume</Link>
//           </div>

//           {loading && <div className="loading">Loading resumes...</div>}
//           {error && <div className="error">{error}</div>}

//           {!loading && !error && resumes.length === 0 && (
//             <div className="loading">
//               <p>No resumes found. Upload your first resume to get started!</p>
//               <Link href="/upload" className="btn" style={{ marginTop: '1rem' }}>Upload Resume</Link>
//             </div>
//           )}

//           {!loading && !error && resumes.length > 0 && (
//             <ul className="resume-list">
//               {resumes.map((resume) => (
//                 <li key={resume.id} className="resume-item" style={{ 
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '12px',
//                   padding: '1.5rem',
//                   marginBottom: '1rem',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   transition: 'all 0.2s',
//                   background: 'white'
//                 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
//                     <div>
//                       <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
//                         Resume
//                       </h3>
//                       <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
//                         <strong>Uploaded:</strong> {formatDate(resume.created_at)}
//                       </p>
//                     </div>
//                   </div>
//                   <div style={{ 
//                     background: '#f9fafb', 
//                     padding: '1rem', 
//                     borderRadius: '8px', 
//                     marginBottom: '1rem',
//                     border: '1px solid #e5e7eb'
//                   }}>
//                     <p style={{ color: '#374151', lineHeight: 1.6, fontSize: '0.95rem' }}>
//                       {truncateText(resume.resume_text, 250)}
//                     </p>
//                   </div>
//                   <div className="resume-actions" style={{ flexWrap: 'wrap' }}>
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => router.push(`/skill-gap?resume_id=${resume.id}`)}
//                       style={{ marginTop: 0 }}
//                     >
//                       🔍 Analyze Skill Gap
//                     </button>
//                     <button
//                       className="btn"
//                       onClick={() => router.push(`/career?resume_id=${resume.id}`)}
//                       style={{ marginTop: 0 }}
//                     >
//                       💼 Career Recommendations
//                     </button>
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => router.push(`/roadmap?resume_id=${resume.id}`)}
//                       style={{ marginTop: 0 }}
//                     >
//                       🗺️ Learning Roadmap
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getClientId } from '@/lib/clientId'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface Resume {
  id: string
  resume_text: string
  created_at: string
}

export default function ResumeList() {
  const router = useRouter()
  const hasFetched = useRef(false)

  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      setError('')

      const clientId = getClientId()

      const response = await fetch(
        `${BACKEND_URL}/resumes?client_id=${clientId}`
      )

      if (!response.ok) {
        throw new Error('Failed to load resumes')
      }

      const data = await response.json()
      setResumes(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading resumes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const truncateText = (text: string, maxLength = 200) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>AI Career Intelligence Platform</h1>
          <nav className="nav">
            <Link href="/">Dashboard</Link>
            <Link href="/upload">Upload Resume</Link>
            <Link href="/resumes">Resumes</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Link href="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>
                Your Resumes
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {resumes.length}{' '}
                {resumes.length === 1 ? 'resume' : 'resumes'} saved
              </p>
            </div>

            <Link href="/upload" className="btn">
              Upload New Resume
            </Link>
          </div>

          {loading && <div className="loading">Loading resumes...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && resumes.length === 0 && (
            <div className="loading">
              <p>No resumes found yet.</p>
              <Link href="/upload" className="btn" style={{ marginTop: '1rem' }}>
                Upload Your First Resume
              </Link>
            </div>
          )}

          {!loading && !error && resumes.length > 0 && (
            <ul className="resume-list">
              {resumes.map(resume => (
                <li
                  key={resume.id}
                  className="resume-item"
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    background: 'white',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    Resume
                  </h3>

                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Uploaded: {formatDate(resume.created_at)}
                  </p>

                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '8px',
                      margin: '1rem 0',
                    }}
                  >
                    <p>{truncateText(resume.resume_text, 250)}</p>
                  </div>

                  <div className="resume-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        router.push(`/skill-gap?resume_id=${resume.id}`)
                      }
                    >
                      🔍 Skill Gap
                    </button>

                    <button
                      className="btn"
                      onClick={() =>
                        router.push(`/career?resume_id=${resume.id}`)
                      }
                    >
                      💼 Career
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        router.push(`/roadmap?resume_id=${resume.id}`)
                      }
                    >
                      🗺️ Roadmap
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
