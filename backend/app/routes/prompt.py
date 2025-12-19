from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests


class PromptRequest(BaseModel):
    mode: str
    text: str


class PromptResponse(BaseModel):
    suggestion: str


router = APIRouter(prefix="/api", tags=["openai"])


@router.post("/prompt", response_model=PromptResponse)
async def generate_edit_suggestion(payload: PromptRequest) -> PromptResponse:
    """Use OpenAI to turn a free-form prompt into a concrete edit suggestion.

    The API key must be provided via the OPENAI_API_KEY environment variable
    (loaded from .env by pydantic-settings, see core/config.py).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured on server")

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4.1-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are an assistant that turns high-level wishes about "
                            "video or frame edits into short, concrete instructions. "
                            "Keep answers concise and practical."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Edit mode: {payload.mode}\n"
                            f"User description: {payload.text}\n\n"
                            "Return 2-3 sentences describing how the video should be edited."
                        ),
                    },
                ],
                "max_tokens": 150,
                "temperature": 0.7,
            },
            timeout=20,
        )
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Failed to contact OpenAI API")

    if response.status_code != 200:
        # Try to surface a helpful error message
        try:
            data = response.json()
            detail = data.get("error", {}).get("message", "Unexpected error from OpenAI API")
        except Exception:
            detail = "Unexpected error from OpenAI API"
        raise HTTPException(status_code=502, detail=detail)

    data = response.json()
    try:
        suggestion = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail="Malformed response from OpenAI API")

    return PromptResponse(suggestion=suggestion)
