'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import ActionItem from '../../components/ActionItem'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

function SkillGapAnalysisContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resume_id')
  
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please select a resume from the Resume List page')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis('')

    try {
      const response = await fetch(`${BACKEND_URL}/analyze/skill-gap/${resumeId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to analyze skill gaps')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing skill gaps')
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
            Skill Gap Analysis
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Identify skill gaps in your resume and get recommendations for career advancement
          </p>
          
          {!resumeId && (
            <div className="error">
              No resume selected. Please go to the <Link href="/resumes" style={{ color: '#c33', textDecoration: 'underline' }}>Resume List</Link> page to select a resume.
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {resumeId && !analysis && !loading && (
            <div>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Click the button below to analyze skill gaps for your resume using AI.
              </p>
              <button className="btn" onClick={handleAnalyze}>
                Analyze Skill Gaps
              </button>
            </div>
          )}

          {loading && <div className="loading">Analyzing your resume... This may take a moment.</div>}

          {analysis && (
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--heading-color)' }}>Analysis Results</h3>
              <div className="analysis-content">
                <ReactMarkdown
                  components={{
                    li: ({ node, ...props }) => {
                      const parent = node.parent as any; // Access parent node
                      // Check if the parent is an ordered list (ol) and has a title that indicates suggested actions
                      if (parent && parent.tagName === 'ul' && parent.children[0]?.children[0]?.value.includes('Suggested Actions')) {
                          return <ActionItem>{props.children}</ActionItem>;
                      }
                      // Default li rendering for other lists
                      return <li {...props} />;
                    },
                  }}
                >{analysis}</ReactMarkdown>
              </div>
              {resumeId && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link href={`/career?resume_id=${resumeId}`} className="btn btn-secondary">
                    View Career Recommendations
                  </Link>
                  <Link href={`/roadmap?resume_id=${resumeId}`} className="btn btn-secondary">
                    Generate Learning Roadmap
                  </Link>
                  <button 
                    onClick={() => handleAnalyze()} 
                    className="btn"
                    disabled={loading}
                  >
                    {loading ? 'Re-running...' : 'Re-run Skill Gap Analysis'}
                  </button>
                </div>
              )}
              <button
                className="btn"
                onClick={handleAnalyze}
                style={{ marginTop: '1.5rem' }}
              >
                Re-analyze
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SkillGapAnalysis() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SkillGapAnalysisContent />
    </Suspense>
  )
}
