"""
Supabase client configuration
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pathlib

# Load environment variables from backend directory
env_path = pathlib.Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Also try loading from current directory as fallback
    load_dotenv(override=True)


def get_supabase_client() -> Client:
    """Initialize and return Supabase client using anon key"""
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("SUPABASE_URL", "").strip()
    supabase_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY", "").strip()
    
    # Check for placeholder values
    placeholder_values = ["your_supabase_project_url", "your_supabase_anon_key", "your_gemini_api_key"]
    
    if (not supabase_url or not supabase_key or 
        supabase_url in placeholder_values or 
        supabase_key in placeholder_values):
        env_file = pathlib.Path(__file__).parent.parent / '.env'
        error_msg = (
            f"SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables.\n"
            f"Expected .env file location: {env_file}\n"
            f"File exists: {env_file.exists()}\n"
            f"Current values:\n"
            f"  SUPABASE_URL: {'(empty or placeholder)' if not supabase_url or supabase_url in placeholder_values else '***'}\n"
            f"  SUPABASE_ANON_KEY: {'(empty or placeholder)' if not supabase_key or supabase_key in placeholder_values else '***'}\n"
            f"Please update your .env file with actual credentials."
        )
        raise ValueError(error_msg)
    
    return create_client(supabase_url, supabase_key)
