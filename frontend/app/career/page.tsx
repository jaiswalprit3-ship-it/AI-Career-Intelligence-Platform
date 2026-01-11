'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

function CareerRecommendationsContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resume_id')
  
  const [recommendations, setRecommendations] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please select a resume from the Resume List page')
      return
    }

    setLoading(true)
    setError('')
    setRecommendations('')

    try {
      const response = await fetch(`${BACKEND_URL}/analyze/career/${resumeId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to generate career recommendations')
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating career recommendations')
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
        <Link href="/" className="back-link">← Back to Dashboard</Link>

        <div className="card">
          <h2 style={{ marginBottom: '0.5rem', color: '#1f2937', fontSize: '1.875rem', fontWeight: 700 }}>
            Career Recommendations
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Get personalized career path recommendations based on your resume
          </p>
          
          {!resumeId && (
            <div className="error">
              No resume selected. Please go to the <Link href="/resumes" style={{ color: '#c33', textDecoration: 'underline' }}>Resume List</Link> page to select a resume.
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {resumeId && !recommendations && !loading && (
            <div>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Click the button below to get personalized career recommendations based on your resume.
              </p>
              <button className="btn" onClick={handleAnalyze}>
                Get Career Recommendations
              </button>
            </div>
          )}

          {loading && <div className="loading">Generating career recommendations... This may take a moment.</div>}

          {recommendations && (
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--heading-color)' }}>Your Career Recommendations</h3>
              <div className="analysis-content">
                <ReactMarkdown>{recommendations}</ReactMarkdown>
              </div>
              {resumeId && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link href={`/skill-gap?resume_id=${resumeId}`} className="btn btn-secondary">
                    View Skill Gap Analysis
                  </Link>
                  <Link href={`/roadmap?resume_id=${resumeId}`} className="btn btn-secondary">
                    Generate Learning Roadmap
                  </Link>
                  <button 
                    onClick={() => handleAnalyze()} 
                    className="btn"
                    disabled={loading}
                  >
                    {loading ? 'Re-running...' : 'Re-run Career Recommendations'}
                  </button>
                </div>
              )}
              <button
                className="btn"
                onClick={handleAnalyze}
                style={{ marginTop: '1.5rem' }}
              >
                Generate New Recommendations
              </button>
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
