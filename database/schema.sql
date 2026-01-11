-- AI Career Intelligence Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create skill_gap_analyses table
CREATE TABLE IF NOT EXISTS skill_gap_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    recommendations TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_roadmaps table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    roadmap TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for development
-- These allow all operations for anonymous users (dev mode)

-- Resumes policies
CREATE POLICY "Allow all operations on resumes" ON resumes
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Skill gap analyses policies
CREATE POLICY "Allow all operations on skill_gap_analyses" ON skill_gap_analyses
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Career recommendations policies
CREATE POLICY "Allow all operations on career_recommendations" ON career_recommendations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Learning roadmaps policies
CREATE POLICY "Allow all operations on learning_roadmaps" ON learning_roadmaps
    FOR ALL
    USING (true)
    WITH CHECK (true);
