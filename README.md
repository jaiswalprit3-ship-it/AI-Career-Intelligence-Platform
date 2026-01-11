# AI Career Intelligence Platform

A full-stack AI-powered platform for analyzing resumes, identifying skill gaps, providing career recommendations, and generating personalized learning roadmaps.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React
- **Backend**: FastAPI (Python), uvicorn
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini (google-generativeai)

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- Google Gemini API key

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new Supabase project
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL script from `database/schema.sql`
4. Copy your Supabase project URL and anon key from Settings > API

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and add your credentials:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - GEMINI_API_KEY

# Run backend server
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and add your credentials:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_BACKEND_URL (default: http://localhost:8000)

# Run development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── services/
│   │   ├── supabase_client.py  # Supabase client
│   │   └── gemini_client.py    # Gemini AI client
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Dashboard
│   │   ├── upload/
│   │   │   └── page.tsx        # Upload Resume
│   │   ├── resumes/
│   │   │   └── page.tsx        # Resume List
│   │   ├── skill-gap/
│   │   │   └── page.tsx        # Skill Gap Analysis
│   │   ├── career/
│   │   │   └── page.tsx        # Career Recommendations
│   │   └── roadmap/
│   │       └── page.tsx        # Learning Roadmap
│   ├── package.json
│   └── .env.local.example
├── database/
│   └── schema.sql              # Database schema
└── README.md
```

## API Endpoints

### Backend API (http://localhost:8000)

- `GET /` - Health check
- `POST /resumes` - Create a new resume
- `GET /resumes` - Get all resumes
- `POST /analyze/skill-gap/{resume_id}` - Analyze skill gaps
- `POST /analyze/career/{resume_id}` - Get career recommendations
- `POST /analyze/roadmap/{resume_id}` - Generate learning roadmap

## Features

1. **Upload Resume**: Save resume text to the database
2. **Resume List**: View all saved resumes with options to analyze
3. **Skill Gap Analysis**: AI-powered analysis of missing skills
4. **Career Recommendations**: Personalized career path suggestions
5. **Learning Roadmap**: Customized learning plan for career advancement

## Database Schema

- `resumes` - Stores resume text
- `skill_gap_analyses` - Stores skill gap analysis results
- `career_recommendations` - Stores career recommendations
- `learning_roadmaps` - Stores learning roadmaps

## Notes

- The application uses permissive RLS policies for development
- All data flows through the backend API (no direct Supabase queries from frontend)
- The application does not include authentication (as per requirements)

## Troubleshooting

### "Failed to load resumes" error
- Ensure the backend is running on port 8000
- Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly in `.env.local`
- Verify CORS settings in `backend/main.py`

### Gemini API errors
- Verify your `GEMINI_API_KEY` is correct
- Check API quota and rate limits

### Database connection errors
- Verify Supabase URL and anon key are correct
- Ensure RLS policies are set up correctly (run `schema.sql`)
- Check network connectivity to Supabase

## License

This project is for educational purposes.
