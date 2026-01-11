"""
Quick script to verify .env file is set up correctly and list available Gemini models
"""
import os
import pathlib
from dotenv import load_dotenv
import google.generativeai as genai

env_path = pathlib.Path(__file__).parent / '.env'

print(f"Checking .env file at: {env_path}")
print(f"File exists: {env_path.exists()}")
print(f"File size: {env_path.stat().st_size if env_path.exists() else 0} bytes")
print()

if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
    
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    supabase_key = os.getenv("SUPABASE_ANON_KEY", "").strip()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    placeholder_values = ["your_supabase_project_url", "your_supabase_anon_key", "your_gemini_api_key"]
    
    print("Environment Variables Status:")
    print(f"  SUPABASE_URL: {'[OK] Set' if supabase_url and supabase_url not in placeholder_values else '[FAIL] Missing or placeholder'}")
    if supabase_url:
        print(f"    Value: {supabase_url[:30]}..." if len(supabase_url) > 30 else f"    Value: {supabase_url}")
    
    print(f"  SUPABASE_ANON_KEY: {'[OK] Set' if supabase_key and supabase_key not in placeholder_values else '[FAIL] Missing or placeholder'}")
    if supabase_key:
        print(f"    Value: {supabase_key[:30]}..." if len(supabase_key) > 30 else f"    Value: {supabase_key}")
    
    print(f"  GEMINI_API_KEY: {'[OK] Set' if gemini_key and gemini_key not in placeholder_values else '[FAIL] Missing or placeholder'}")
    if gemini_key:
        print(f"    Value: {gemini_key[:20]}..." if len(gemini_key) > 20 else f"    Value: {gemini_key}")
    
    print()
    if (supabase_url and supabase_key and gemini_key and 
        supabase_url not in placeholder_values and 
        supabase_key not in placeholder_values and 
        gemini_key not in placeholder_values):
        print("[OK] All environment variables are set correctly!")
        print("\n--- Checking Gemini Models ---")
        try:
            genai.configure(api_key=gemini_key)
            print("Available Gemini Models:")
            found_flash_model = False
            for model in genai.list_models():
                if 'generateContent' in model.supported_generation_methods:
                    print(f"  - {model.name}")
                    if model.name == "gemini-1.5-flash":
                        found_flash_model = True
            if not found_flash_model:
                print("[WARNING] 'gemini-1.5-flash' model not found in the list above. Please ensure your API key has access.")
        except Exception as e:
            print(f"[FAIL] Error listing Gemini models: {e}")
            print("  Please ensure your GEMINI_API_KEY is correct and has access.")
    else:
        print("[FAIL] Please update your .env file with actual credentials.")
        print("\nExpected format:")
        print("SUPABASE_URL=https://your-project.supabase.co")
        print("SUPABASE_ANON_KEY=your_actual_anon_key")
        print("GEMINI_API_KEY=your_actual_gemini_key")
else:
    print("[FAIL] .env file not found!")
    print(f"Please create .env file at: {env_path}")
