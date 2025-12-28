"""
Meal suggestion routes - AI-powered meal recommendations
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from google import genai
from google.genai import types
import json
import os
import re

router = APIRouter()


class MealSuggestionRequest(BaseModel):
    remainingCalories: float
    remainingProtein: float
    remainingCarbs: float
    remainingFats: float
    goals: Optional[List[str]] = None
    medicalConditions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None


class MealSuggestion(BaseModel):
    name: str
    description: str
    calories: int
    protein: int
    carbs: int
    fat: int
    prepTime: str
    ingredients: List[str]


class MealSuggestionResponse(BaseModel):
    suggestions: List[MealSuggestion]


def get_gemini_client():
    """Get Gemini client with API key"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)


@router.post("/suggest-meals", response_model=MealSuggestionResponse)
async def suggest_meals(request: MealSuggestionRequest):
    """
    Generate AI-powered meal suggestions based on remaining macros
    """
    client = get_gemini_client()
    if not client:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key not configured"
        )
    
    try:
        # Build prompt
        goals_text = ", ".join(request.goals) if request.goals else "general health"
        conditions = [c for c in (request.medicalConditions or []) if c != "none"]
        conditions_text = ", ".join(conditions) if conditions else "none"
        allergies_text = ", ".join(request.allergies) if request.allergies else "none"
        
        prompt = f"""Generate 3 healthy meal suggestions based on these remaining daily macros:
- Calories: {request.remainingCalories} kcal
- Protein: {request.remainingProtein}g
- Carbs: {request.remainingCarbs}g
- Fats: {request.remainingFats}g

User goals: {goals_text}
Medical conditions to consider: {conditions_text}
Allergies to avoid: {allergies_text}

Return a JSON array with exactly 3 meal suggestions. Each meal should have:
- name: meal name
- description: brief description (1-2 sentences)
- calories: estimated calories (integer)
- protein: grams of protein (integer)
- carbs: grams of carbs (integer)
- fat: grams of fat (integer)
- prepTime: preparation time (e.g., "15 min")
- ingredients: array of main ingredients

Return ONLY valid JSON array, no markdown or other text."""

        # Call Gemini API using async IO client
        response = await client.aio.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Parse response
        content = response.text
        
        # Clean up any markdown code blocks if present
        content = re.sub(r'```json\n?|\n?```', '', content).strip()
        
        try:
            suggestions = json.loads(content)
        except json.JSONDecodeError:
            # If parsing fails, return empty suggestions
            print(f"Failed to parse AI response: {content}")
            suggestions = []
        
        # Ensure we have a list
        if not isinstance(suggestions, list):
            suggestions = []
        
        return MealSuggestionResponse(suggestions=suggestions)
        
    except Exception as e:
        print(f"Error generating meal suggestions: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate meal suggestions: {str(e)}"
        )


from ..services.db_service import get_db

@router.get("/meals")
async def get_meals():
    """Get all meals for current user"""
    db = get_db()
    meals = await db.get_meals()
    return {"meals": meals}

class SaveMealRequest(BaseModel):
    items: List[dict]
    imageUrl: Optional[str] = ""
    totalCalories: float
    totalProtein: float
    totalCarbs: float
    totalFats: float
    # Allow optional ID/timestamp from frontend
    id: Optional[str] = None
    timestamp: Optional[str] = None

@router.post("/meals")
async def save_meal(meal: SaveMealRequest):
    """Save a meal to the database"""
    db = get_db()
    result = await db.save_meal(meal.model_dump())
    if not result:
        raise HTTPException(status_code=500, detail="Failed to save meal")
    return result
