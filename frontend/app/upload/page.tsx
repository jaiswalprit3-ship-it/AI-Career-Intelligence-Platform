// 'use client'

// import { useState, useRef, DragEvent } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
// const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt']

// export default function UploadResume() {
//   const router = useRouter()
//   const fileInputRef = useRef<HTMLInputElement>(null)
  
//   const [resumeText, setResumeText] = useState('')
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [isDragging, setIsDragging] = useState(false)

//   const validateFile = (file: File): boolean => {
//     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//       // Check by extension as fallback
//       const fileName = file.name.toLowerCase()
//       const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))
//       if (!hasValidExtension) {
//         setError(`Invalid file type. Please upload a PDF, DOCX, or TXT file.`)
//         return false
//       }
//     }
//     return true
//   }

//   const handleFileSelect = (file: File) => {
//     if (!validateFile(file)) {
//       return
//     }
//     setSelectedFile(file)
//     setError('')
//     setResumeText('') // Clear text when file is selected
//   }

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       handleFileSelect(file)
//     }
//   }

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(true)
//   }

//   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(false)
//   }

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(false)

//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       handleFileSelect(file)
//       setUploadMethod('file')
//     }
//   }

//   const handleRemoveFile = () => {
//     setSelectedFile(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     try {
//       const formData = new FormData()

//       // Allow either file OR text OR both
//       // Backend will prioritize file if both are provided
//       if (selectedFile) {
//         formData.append('file', selectedFile)
//       }
      
//       if (resumeText.trim()) {
//         formData.append('resume_text', resumeText.trim())
//       }

//       // Validate that at least one is provided
//       if (!selectedFile && !resumeText.trim()) {
//         setError('Please upload a resume file or paste resume text')
//         setLoading(false)
//         return
//       }

//       const response = await fetch(`${BACKEND_URL}/resumes`, {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) {
//         const data = await response.json()
//         throw new Error(data.detail || 'Failed to upload resume')
//       }

//       const data = await response.json()
//       setSuccess('Resume uploaded successfully!')
//       setResumeText('')
//       setSelectedFile(null)
//       setUploadMethod('text') // Reset to default
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
      
//       // Redirect to resume list after 1.5 seconds
//       setTimeout(() => {
//         router.push('/resumes')
//       }, 1500)
//     } catch (err: any) {
//       setError(err.message || 'An error occurred while uploading the resume')
//     } finally {
//       setLoading(false)
//     }
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
//           <h2 style={{ marginBottom: '0.5rem', color: '#1f2937', fontSize: '1.875rem', fontWeight: 700 }}>
//             Upload Resume
//           </h2>
//           <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
//             Upload your resume as a file, paste the text directly, or both. Supported formats: PDF, DOCX, TXT
//           </p>
          
//           {error && <div className="error">{error}</div>}
//           {success && <div className="success">{success}</div>}

//           <form onSubmit={handleSubmit}>
//             {/* File Upload Option */}
//             <div className="upload-option">
//               <div className="upload-option-title">
//                 <span>📁</span>
//                 Upload Resume File
//               </div>
//               <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
//                 Drag and drop your resume file here, or click to browse
//               </p>
              
//               <div
//                 className={`file-upload-area ${isDragging ? 'dragover' : ''}`}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <div className="file-upload-icon">📄</div>
//                 <p style={{ color: '#374151', marginBottom: '0.5rem', fontWeight: 500 }}>
//                   {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
//                 </p>
//                 <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
//                   PDF, DOCX, or TXT (Max 10MB)
//                 </p>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".pdf,.docx,.txt"
//                   onChange={handleFileInputChange}
//                   style={{ display: 'none' }}
//                 />
//               </div>

//               {selectedFile && (
//                 <div className="file-info">
//                   <span className="file-info-name">📎 {selectedFile.name}</span>
//                   <button
//                     type="button"
//                     className="file-info-remove"
//                     onClick={handleRemoveFile}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="divider">
//               <div style={{ textAlign: 'center', marginTop: '-0.75rem' }}>
//                 <span style={{ background: 'white', padding: '0 1rem', color: '#9ca3af' }}>OR</span>
//               </div>
//             </div>

//             {/* Text Paste Option */}
//             <div className="upload-option">
//               <div className="upload-option-title">
//                 <span>📝</span>
//                 Paste Resume Text
//               </div>
//               <div className="form-group">
//                 <label htmlFor="resume" style={{ marginBottom: '0.75rem' }}>
//                   Resume Text
//                 </label>
//                 <textarea
//                   id="resume"
//                   value={resumeText}
//                   onChange={(e) => {
//                     setResumeText(e.target.value)
//                     setUploadMethod('text')
//                   }}
//                   placeholder="Paste your resume text here... (optional if you uploaded a file)"
//                   required={!selectedFile}
//                   disabled={loading}
//                   style={{ minHeight: '250px' }}
//                 />
//                 {selectedFile && resumeText.trim() && (
//                   <p style={{ color: '#2563eb', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 500 }}>
//                     ℹ️ Both file and text provided. File will be prioritized.
//                   </p>
//                 )}
//               </div>
//             </div>

//             <button 
//               type="submit" 
//               className="btn" 
//               disabled={loading || (!resumeText.trim() && !selectedFile)}
//               style={{ width: '100%', marginTop: '1rem' }}
//             >
//               {loading ? 'Uploading...' : 'Upload Resume'}
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'

import { useState, useRef, DragEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getClientId } from '@/lib/clientId'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt']

export default function UploadResume() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      const fileName = file.name.toLowerCase()
      const hasValidExtension = ALLOWED_EXTENSIONS.some(ext =>
        fileName.endsWith(ext)
      )
      if (!hasValidExtension) {
        setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.')
        return false
      }
    }
    return true
  }

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return
    setSelectedFile(file)
    setResumeText('')
    setError('')
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('client_id', getClientId())

      if (selectedFile) formData.append('file', selectedFile)
      if (resumeText.trim()) formData.append('resume_text', resumeText.trim())

      if (!selectedFile && !resumeText.trim()) {
        setError('Please upload a file or paste resume text')
        setLoading(false)
        return
      }

      const res = await fetch(`${BACKEND_URL}/resumes`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Upload failed')
      }

      setSuccess('Resume uploaded successfully!')
      setResumeText('')
      setSelectedFile(null)

      setTimeout(() => router.push('/resumes'), 1200)
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
        <Link href="/" className="back-link">← Back to Dashboard</Link>

        <div className="card">
          <h2>Upload Resume</h2>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* FILE UPLOAD */}
            <div
              className={`file-upload-area ${isDragging ? 'dragover' : ''}`}
              onDragOver={e => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <p>
                {selectedFile
                  ? selectedFile.name
                  : 'Click or drag & drop resume (PDF, DOCX, TXT)'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                hidden
                onChange={e =>
                  e.target.files && handleFileSelect(e.target.files[0])
                }
              />
            </div>

            {/* TEXT AREA */}
            <textarea
              placeholder="Or paste resume text here"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              style={{ minHeight: 200, marginTop: '1rem' }}
            />

            <button className="btn" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
