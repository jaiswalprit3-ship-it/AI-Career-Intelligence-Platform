'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

function CareerRecommendationsContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resume_id')

  const [recommendations, setRecommendations] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please select a resume first.')
      return
    }

    setLoading(true)
    setError('')
    setRecommendations('')

    try {
      const response = await fetch(
        `${BACKEND_URL}/analyze/career/${resumeId}`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.detail || 'Failed to generate career recommendations'
        )
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
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
            Career Recommendations
          </h2>

          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Explore career paths that best match your skills and experience.
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
          {resumeId && !recommendations && !loading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn" onClick={handleAnalyze}>
                Get Career Recommendations
              </button>
            </div>
          )}

          {loading && (
            <div className="loading" style={{ marginTop: '2rem' }}>
              Generating career recommendations… please wait.
            </div>
          )}

          {/* OUTPUT */}
          {recommendations && (
            <div style={{ marginTop: '2.5rem' }}>
              <div
                className="analysis-content"
                style={{
                  background: '#f9fafb',
                  padding: '2rem',
                  borderRadius: 14,
                  border: '1px solid #e5e7eb',
                }}
              >
                <ReactMarkdown>{recommendations}</ReactMarkdown>
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
                  Skill Gap Analysis
                </Link>

                <Link
                  href={`/roadmap?resume_id=${resumeId}`}
                  className="btn btn-secondary"
                >
                  Learning Roadmap
                </Link>

                <button
                  onClick={handleAnalyze}
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Re-running…' : 'Re-run Recommendations'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function CareerRecommendations() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <CareerRecommendationsContent />
    </Suspense>
  )
}
