'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

function LearningRoadmapContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resume_id')

  const [roadmap, setRoadmap] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please select a resume first.')
      return
    }

    setLoading(true)
    setError('')
    setRoadmap('')

    try {
      const response = await fetch(
        `${BACKEND_URL}/analyze/roadmap/${resumeId}`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to generate roadmap')
      }

      const data = await response.json()
      setRoadmap(data.roadmap)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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

        <div
          className="card"
          style={{ maxWidth: 900, margin: '0 auto' }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Learning Roadmap
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            A structured learning plan tailored to your profile and career goals.
          </p>

          {!resumeId && (
            <div className="error">
              No resume selected. Go to{' '}
              <Link href="/resumes" style={{ textDecoration: 'underline' }}>
                Resume List
              </Link>
              .
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {/* CTA */}
          {resumeId && !roadmap && !loading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn" onClick={handleAnalyze}>
                Generate Learning Roadmap
              </button>
            </div>
          )}

          {loading && (
            <div className="loading" style={{ marginTop: '2rem' }}>
              Generating roadmap… please wait.
            </div>
          )}

          {/* OUTPUT */}
          {roadmap && (
            <div style={{ marginTop: '2.5rem' }}>
              <div
                style={{
                  background: '#f9fafb',
                  padding: '2rem',
                  borderRadius: 14,
                  border: '1px solid #e5e7eb',
                }}
                className="analysis-content"
              >
                <ReactMarkdown>{roadmap}</ReactMarkdown>
              </div>

              {/* ACTIONS */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '2rem',
                }}
              >
                <Link
                  href={`/skill-gap?resume_id=${resumeId}`}
                  className="btn btn-secondary"
                >
                  View Skill Gap
                </Link>

                <Link
                  href={`/career?resume_id=${resumeId}`}
                  className="btn btn-secondary"
                >
                  Career Recommendations
                </Link>

                <button
                  onClick={handleAnalyze}
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Re-running…' : 'Regenerate Roadmap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function LearningRoadmap() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <LearningRoadmapContent />
    </Suspense>
  )
}
