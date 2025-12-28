"""
Food Analysis Routes - Image-based food detection and nutrition estimation
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..services.food_analyzer import get_food_analyzer, AnalysisResult

router = APIRouter()


class AnalyzeFoodRequest(BaseModel):
    image: Optional[str] = None  # Base64 encoded image
    image_url: Optional[str] = None  # URL to image


@router.post("/analyze-food", response_model=AnalysisResult)
async def analyze_food(request: AnalyzeFoodRequest):
    """
    Analyze a food image to detect food items and estimate nutrition.
    
    Accepts either:
    - image: Base64 encoded image data (with or without data URL prefix)
    - image_url: URL to a publicly accessible food image
    
    Returns detected food items with portion sizes and nutritional information.
    """
    if not request.image and not request.image_url:
        raise HTTPException(
            status_code=400,
            detail="Either 'image' (base64) or 'image_url' must be provided"
        )
    
    try:
        analyzer = get_food_analyzer()
        result = await analyzer.analyze(
            image_data=request.image,
            image_url=request.image_url
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        print(f"Error analyzing food: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze food image: {str(e)}"
        )
