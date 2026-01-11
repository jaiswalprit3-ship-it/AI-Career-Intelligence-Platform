"""
Google Gemini AI client
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv
import pathlib

# Load environment variables from backend directory
env_path = pathlib.Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Also try loading from current directory as fallback
    load_dotenv(override=True)


class GeminiClient:
    """Client for interacting with Google Gemini AI"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY", "").strip()
        
        # Check for placeholder values
        if not api_key or api_key in ["your_gemini_api_key"]:
            env_file = pathlib.Path(__file__).parent.parent / '.env'
            error_msg = (
                f"GEMINI_API_KEY must be set in environment variables.\n"
                f"Expected .env file location: {env_file}\n"
                f"File exists: {env_file.exists()}\n"
                f"Please update your .env file with actual Gemini API key."
            )
            raise ValueError(error_msg)
        
        # Configure Gemini API
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash (replaces deprecated gemini-pro)
        # Initialize model with the correct name from available models
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")
    
    def generate_text(self, prompt: str) -> str:
        """Generate text using Gemini AI"""
        try:
            response = self.model.generate_content(prompt)
            # Handle response - text may be in different attributes depending on SDK version
            if hasattr(response, 'text'):
                return response.text
            elif hasattr(response, 'candidates') and response.candidates:
                # Check if candidates exist and have content
                if response.candidates[0] and response.candidates[0].content and response.candidates[0].content.parts:
                    return response.candidates[0].content.parts[0].text
                else:
                    print(f"DEBUG: Gemini response candidates found, but content is empty: {response}")
                    return "No AI output generated (empty content in candidates)."
            else:
                print(f"DEBUG: Unexpected Gemini response structure: {response}")
                return str(response) # Fallback to string representation of response
        except Exception as e:
            error_msg = str(e)
            print(f"DEBUG: Raw Gemini API error: {error_msg}") # Log the raw error
            # Provide more helpful error for 404 or resource not found
            if "404" in error_msg or "not found" in error_msg.lower() or "Resource Not Found" in error_msg:
                raise Exception(
                    f"Gemini model 'gemini-1.5-flash' not found or unauthorized. "
                    f"Please check your API key, ensure it has access to 'gemini-1.5-flash', "
                    f"and make sure 'google-generativeai' is up-to-date (`pip install --upgrade google-generativeai`). "
                    f"Raw Error: {error_msg}"
                )
            raise Exception(f"Error generating text with Gemini: {error_msg}")
