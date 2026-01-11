# Quick Setup Guide

## 1. Supabase Database Setup

1. Go to https://supabase.com and create a new project
2. Once your project is ready:
   - Go to **Settings** > **API**
   - Copy your **Project URL** and **anon public** key
3. Go to **SQL Editor** in the Supabase dashboard
4. Open the file `database/schema.sql`
5. Copy and paste the entire SQL script into the SQL Editor
6. Click **Run** to create all tables and policies

## 2. Google Gemini API Setup

1. Go to https://makersuite.google.com/app/apikey (or https://ai.google.dev/)
2. Create a new API key
3. Copy the API key (you'll need it for the backend `.env` file)

## 3. Backend Setup

```bash
# Navigate to backend directory
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

# Create .env file
# Copy env.example.txt to .env, or create .env manually with:
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# GEMINI_API_KEY=your_gemini_api_key

# Run the backend server
uvicorn main:app --reload
```

The backend should now be running on `http://localhost:8000`

## 4. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Copy env.local.example.txt to .env.local, or create .env.local manually with:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Run the frontend development server
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## 5. Test the Application

1. Open `http://localhost:3000` in your browser
2. Click "Upload Resume" and paste some resume text
3. Go to "Resume List" to see your uploaded resume
4. Click "Analyze Skill Gap", "Get Career Recommendations", or "Get Learning Roadmap" to test the AI features

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in `backend/.env`
- Verify Python virtual environment is activated
- Make sure port 8000 is not already in use

### Frontend won't start
- Check that all environment variables are set in `frontend/.env.local`
- Verify Node.js version is 18+
- Make sure port 3000 is not already in use

### "Failed to load resumes" error
- Ensure backend is running on `http://localhost:8000`
- Check that `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local` matches backend URL
- Verify backend CORS settings allow `http://localhost:3000`

### Gemini API errors
- Verify your `GEMINI_API_KEY` is correct
- Check API quota/limits in Google AI Studio
- Make sure the API key has proper permissions

### Database connection errors
- Verify Supabase URL and anon key are correct
- Ensure SQL schema has been run in Supabase SQL Editor
- Check that RLS policies are enabled (they should be permissive for dev)
