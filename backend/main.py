"""
AI Career Intelligence Platform - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from typing import List, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime
import PyPDF2
import docx
import io

from services.supabase_client import get_supabase_client
from services.gemini_client import GeminiClient

# Load environment variables
# Get the directory where this file is located
import pathlib
env_path = pathlib.Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Also try loading from current directory as fallback
    load_dotenv(override=True)

# Initialize FastAPI app
app = FastAPI(title="AI Career Intelligence Platform API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
supabase = get_supabase_client()
gemini_client = GeminiClient()

# Pydantic models for request/response
class ResumeCreate(BaseModel):
    resume_text: str

class ResumeResponse(BaseModel):
    id: str
    resume_text: str
    created_at: str

class SkillGapAnalysisResponse(BaseModel):
    id: str
    resume_id: str
    analysis: str
    created_at: str

class CareerRecommendationResponse(BaseModel):
    id: str
    resume_id: str
    recommendations: str
    created_at: str

class LearningRoadmapResponse(BaseModel):
    id: str
    resume_id: str
    roadmap: str
    created_at: str


# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "AI Career Intelligence Platform API", "status": "running"}


def extract_text_from_file(file_content: bytes, file_type: str) -> str:
    """Extract text from uploaded file"""
    text_content = ""
    print(f"DEBUG: Entering extract_text_from_file for type: {file_type}")
    try:
        if file_type == "application/pdf":
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            print(f"DEBUG: PDF has {len(pdf_reader.pages)} pages.")
            for i, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                print(f"DEBUG: Page {i+1} extracted text length: {len(page_text) if page_text else 0}")
                if page_text:
                    text_content += page_text + "\n"
                else:
                    print(f"DEBUG: Page {i+1} returned empty text.")
        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = docx.Document(io.BytesIO(file_content))
            text_content = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        elif file_type == "text/plain":
            text_content = file_content.decode('utf-8')
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    except Exception as e:
        print(f"DEBUG: CRITICAL ERROR in extract_text_from_file for type {file_type}: {e}")
        return "" # Return empty string if extraction fails
    print(f"DEBUG: Exiting extract_text_from_file. Total extracted text length: {len(text_content.strip())}")
    return text_content.strip()


@app.post("/resumes", response_model=ResumeResponse)
async def create_resume(
    resume_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Create a new resume from text or file upload"""
    try:
        print(f"DEBUG: create_resume called. resume_text: {resume_text!r}, file_is_present: {file is not None}")
        if file:
            print(f"DEBUG: Uploaded file details - filename: {file.filename}, content_type: {file.content_type}")

        resume_content = None

        # IF resume_text exists and resume_text.strip() is not empty:
        if resume_text and resume_text.strip():
            resume_content = resume_text.strip()
            print(f"DEBUG: Using resume_text. Content length: {len(resume_content)}")

        # ELSE IF file exists:
        elif file:
            print(f"DEBUG: Attempting to process file: {file.filename}")
            # Validate file type (existing logic, moved for clarity)
            allowed_types = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain"
            ]
            file_name_lower = file.filename.lower() if file.filename else ""
            is_valid_type = (
                file.content_type in allowed_types or
                file_name_lower.endswith('.pdf') or
                file_name_lower.endswith('.docx') or
                file_name_lower.endswith('.txt')
            )

            print(f"DEBUG: is_valid_type: {is_valid_type}")
            if not is_valid_type:
                print(f"DEBUG: Invalid file type: {file.content_type} / {file.filename}")
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file type. Allowed types: PDF, DOCX, TXT"
                )

            # Determine file type for extraction
            file_type = file.content_type
            if not file_type or file_type not in allowed_types: # Fallback to extension if content_type is generic or missing
                if file_name_lower.endswith('.pdf'):
                    file_type = "application/pdf"
                elif file_name_lower.endswith('.docx'):
                    file_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                elif file_name_lower.endswith('.txt'):
                    file_type = "text/plain"
            print(f"DEBUG: Determined file_type for extraction: {file_type}")
            extracted_text = ""
            try:
                file_content = await file.read()
                print(f"DEBUG: File content read, size: {len(file_content)} bytes")
                extracted_text = extract_text_from_file(file_content, file_type)
                print(f"DEBUG: Extracted text length: {len(extracted_text)}")
            except Exception as e:
                print(f"DEBUG: Error during text extraction for type {file_type} from file {file.filename}: {e}")
                # Do not raise HTTPException here, let the final_text check handle it.
            
            # IF extracted_text exists and extracted_text.strip() is not empty:
            if extracted_text and extracted_text.strip():
                resume_content = extracted_text.strip()
                print(f"DEBUG: Using extracted file text. Content length: {len(resume_content)}")

        # IF resume_content is None:
        print(f"DEBUG: Final resume_content before last check: {resume_content is not None}, value: {resume_content!r}")
        if resume_content is None:
            raise HTTPException(
                status_code=400,
                detail="Please upload a resume file or paste resume text"
            )
        
        # Now, proceed with saving the resume_content to Supabase
        resume_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        result = supabase.table("resumes").insert({
            "id": resume_id,
            "resume_text": resume_content,
            "created_at": created_at
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create resume")
        
        return ResumeResponse(
            id=resume_id,
            resume_text=resume_content,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating resume: {str(e)}")


@app.get("/resumes", response_model=List[ResumeResponse])
async def get_resumes():
    """Get all resumes"""
    try:
        result = supabase.table("resumes").select("*").order("created_at", desc=True).execute()
        
        if not result.data:
            return []
        
        return [
            ResumeResponse(
                id=str(resume["id"]),
                resume_text=resume["resume_text"],
                created_at=resume["created_at"]
            )
            for resume in result.data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resumes: {str(e)}")


@app.post("/analyze/skill-gap/{resume_id}", response_model=SkillGapAnalysisResponse)
async def analyze_skill_gap(resume_id: str):
    """Analyze skill gaps for a resume using Gemini AI"""
    try:
        # Fetch resume
        resume_result = supabase.table("resumes").select("*").eq("id", resume_id).execute()
        
        if not resume_result.data or len(resume_result.data) == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        resume_text = resume_result.data[0]["resume_text"]
        
        # Generate skill gap analysis using Gemini
        prompt = f"""Analyze the following resume and identify skill gaps for a software engineering career path.

Resume:
{resume_text}

Provide the response in the following Markdown format. Use clear section headings, bullet points, and emojis sparingly for engagement. Keep the language simple, encouraging, and focus on actionable insights.

### 🎯 Profile Summary
- 2–3 short lines summarizing the user’s current stage and goal

### ✅ Strengths Identified
- Bullet list of existing skills. Keep points concise.

### ⚠️ Skill Gaps
- Bullet list of missing or weak skills. Explain each in one short line.

### 🚀 Recommended Next Skills to Learn
- Prioritized list (Top 5). Focus on practical, industry-relevant skills.

### 📌 Suggested Actions (Next 30–60 Days)
- Clear, actionable steps. Example: “Build 1 mini project using Python”"""

        analysis_text = gemini_client.generate_text(prompt)
        
        # Save analysis
        analysis_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        result = supabase.table("skill_gap_analyses").insert({
            "id": analysis_id,
            "resume_id": resume_id,
            "analysis": analysis_text,
            "created_at": created_at
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save skill gap analysis")
        
        return SkillGapAnalysisResponse(
            id=analysis_id,
            resume_id=resume_id,
            analysis=analysis_text,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing skill gaps: {str(e)}")


@app.post("/analyze/career/{resume_id}", response_model=CareerRecommendationResponse)
async def analyze_career(resume_id: str):
    """Generate career recommendations for a resume using Gemini AI"""
    try:
        # Fetch resume
        resume_result = supabase.table("resumes").select("*").eq("id", resume_id).execute()
        
        if not resume_result.data or len(resume_result.data) == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        resume_text = resume_result.data[0]["resume_text"]
        
        # Generate career recommendations using Gemini
        prompt = f"""Based on the following resume, provide career recommendations.

Resume:
{resume_text}

Provide the response in the following Markdown format. Use clear section headings, bullet points, and emojis sparingly for engagement. Keep the language simple, encouraging, and focus on actionable insights.

### 💼 Suitable Career Paths
- 2–4 roles with short explanations

### 🎓 Why These Roles Fit You
- Bullet points connecting resume → role

### 🛠 Skills to Focus On for These Roles
- Skill → Why it matters

### 🚀 How to Start (Beginner-Friendly)
- Step-by-step guidance. Avoid overwhelming advice.
"""

        recommendations_text = gemini_client.generate_text(prompt)
        
        # Save recommendations
        recommendation_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        result = supabase.table("career_recommendations").insert({
            "id": recommendation_id,
            "resume_id": resume_id,
            "recommendations": recommendations_text,
            "created_at": created_at
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save career recommendations")
        
        return CareerRecommendationResponse(
            id=recommendation_id,
            resume_id=resume_id,
            recommendations=recommendations_text,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating career recommendations: {str(e)}")


@app.post("/analyze/roadmap/{resume_id}", response_model=LearningRoadmapResponse)
async def analyze_roadmap(resume_id: str):
    """Generate learning roadmap for a resume using Gemini AI"""
    try:
        # Fetch resume
        resume_result = supabase.table("resumes").select("*").eq("id", resume_id).execute()
        
        if not resume_result.data or len(resume_result.data) == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        resume_text = resume_result.data[0]["resume_text"]
        
        # Generate learning roadmap using Gemini
        prompt = f"""Based on the following resume, create a comprehensive learning roadmap for career advancement.

Resume:
{resume_text}

Provide the response in the following Markdown format. Use clear section headings, bullet points, and emojis sparingly for engagement. Keep the language simple, encouraging, and focus on actionable insights.

### 🗺️ Learning Roadmap Overview
- One short motivating paragraph summarizing the roadmap.

### 📅 Phase 1: Foundations (0–2 Months)
- Bullet list of key topics and foundational skills.

### 📅 Phase 2: Intermediate Skills (2–4 Months)
- Bullet list of intermediate topics and deeper dives.

### 📅 Phase 3: Practical Experience (4–6 Months)
- Ideas for projects, internships, or hands-on practice.

### ✅ Outcome After Completion
- Clear statement of expected improvements and achievements after completing the roadmap.
"""

        roadmap_text = gemini_client.generate_text(prompt)
        
        # Save roadmap
        roadmap_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        result = supabase.table("learning_roadmaps").insert({
            "id": roadmap_id,
            "resume_id": resume_id,
            "roadmap": roadmap_text,
            "created_at": created_at
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save learning roadmap")
        
        return LearningRoadmapResponse(
            id=roadmap_id,
            resume_id=resume_id,
            roadmap=roadmap_text,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating learning roadmap: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
