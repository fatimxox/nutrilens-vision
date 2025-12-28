"""
Food Analyzer Service - Provider abstraction for food image analysis
Supports Gemini Vision (default) and custom PyTorch models (future)
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types
import json
import re
import os
import base64
import httpx


class NutritionInfo(BaseModel):
    calories: int
    protein: float
    carbs: float
    fat: float


class FoodItem(BaseModel):
    name: str
    confidence: float
    portion: str
    nutrition: NutritionInfo
    allergens: List[str] = []  # e.g., ["gluten", "dairy", "nuts"]
    health_warnings: List[str] = []  # e.g., ["high_sugar", "high_sodium"]


class AnalysisResult(BaseModel):
    provider: str
    food_items: List[FoodItem]
    total_nutrition: NutritionInfo


class BaseFoodAnalyzer(ABC):
    """Abstract base class for food analyzers"""
    
    @abstractmethod
    async def analyze(self, image_data: Optional[str] = None, image_url: Optional[str] = None) -> AnalysisResult:
        """Analyze food in image and return nutrition info"""
        pass


class GeminiFoodAnalyzer(BaseFoodAnalyzer):
    """Uses Gemini Vision API for food analysis"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not configured")
        self.client = genai.Client(api_key=api_key)
    
    async def analyze(self, image_data: Optional[str] = None, image_url: Optional[str] = None) -> AnalysisResult:
        """Analyze food image using Gemini Vision"""
        
        prompt = """Analyze this food image and identify all food items visible.
For each food item, provide:
1. name: The name of the food
2. confidence: Your confidence level (0.0 to 1.0)
3. portion: Estimated portion size (e.g., "150g", "1 cup", "1 medium")
4. nutrition: Estimated nutritional values for that portion
   - calories (integer)
   - protein (grams, float)
   - carbs (grams, float)
   - fat (grams, float)
5. allergens: List of common allergens present in this food. Include any of these if applicable:
   - "gluten" (wheat, barley, rye products)
   - "dairy" (milk, cheese, butter, cream)
   - "nuts" (tree nuts like almonds, walnuts, cashews)
   - "peanuts"
   - "eggs"
   - "soy"
   - "fish"
   - "shellfish"
   - "sesame"
6. health_warnings: List of health considerations. Include any applicable:
   - "high_sugar" if food has significant added sugars (bad for diabetics)
   - "high_sodium" if food is high in salt (bad for hypertension)
   - "high_fat" if saturated fat content is high (bad for heart disease)
   - "high_carb" if very high in carbohydrates (affects blood sugar)
   - "processed" if it's a highly processed food

Return ONLY a valid JSON object in this exact format:
{
  "food_items": [
    {
      "name": "food name",
      "confidence": 0.95,
      "portion": "150g",
      "nutrition": {
        "calories": 200,
        "protein": 25.0,
        "carbs": 10.0,
        "fat": 8.0
      },
      "allergens": ["dairy", "gluten"],
      "health_warnings": ["high_sodium"]
    }
  ]
}

Be accurate with portion sizes and allergen detection. If you cannot identify any food, return {"food_items": []}."""

        try:
            # Prepare image content
            contents = []
            
            if image_url:
                # Download image from URL
                async with httpx.AsyncClient() as http_client:
                    response = await http_client.get(image_url)
                    response.raise_for_status()
                    image_bytes = response.content
                    # Detect mime type from response or default to jpeg
                    content_type = response.headers.get("content-type", "image/jpeg")
                    mime_type = content_type.split(";")[0].strip()
                    
                contents = [
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt
                ]
            elif image_data:
                # Decode base64 image
                # Handle data URL format: data:image/jpeg;base64,....
                if image_data.startswith("data:"):
                    header, base64_data = image_data.split(",", 1)
                    mime_type = header.split(":")[1].split(";")[0]
                else:
                    base64_data = image_data
                    mime_type = "image/jpeg"
                
                image_bytes = base64.b64decode(base64_data)
                contents = [
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt
                ]
            else:
                raise ValueError("Either image_data or image_url must be provided")
            
            # Call Gemini Vision API
            response = await self.client.aio.models.generate_content(
                model="gemini-2.0-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # Parse response
            content = response.text
            content = re.sub(r'```json\n?|\n?```', '', content).strip()
            
            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                print(f"Failed to parse Gemini response: {content}")
                data = {"food_items": []}
            
            food_items = []
            for item in data.get("food_items", []):
                nutrition = item.get("nutrition", {})
                food_items.append(FoodItem(
                    name=item.get("name", "Unknown"),
                    confidence=float(item.get("confidence", 0.5)),
                    portion=item.get("portion", "1 serving"),
                    nutrition=NutritionInfo(
                        calories=int(nutrition.get("calories", 0)),
                        protein=float(nutrition.get("protein", 0)),
                        carbs=float(nutrition.get("carbs", 0)),
                        fat=float(nutrition.get("fat", 0))
                    ),
                    allergens=item.get("allergens", []),
                    health_warnings=item.get("health_warnings", [])
                ))
            
            # Calculate totals
            total_calories = sum(item.nutrition.calories for item in food_items)
            total_protein = sum(item.nutrition.protein for item in food_items)
            total_carbs = sum(item.nutrition.carbs for item in food_items)
            total_fat = sum(item.nutrition.fat for item in food_items)
            
            return AnalysisResult(
                provider="gemini",
                food_items=food_items,
                total_nutrition=NutritionInfo(
                    calories=total_calories,
                    protein=total_protein,
                    carbs=total_carbs,
                    fat=total_fat
                )
            )
            
        except Exception as e:
            print(f"Error in Gemini food analysis: {e}")
            raise


class CustomModelAnalyzer(BaseFoodAnalyzer):
    """
    Uses custom PyTorch model for food segmentation
    Placeholder for future implementation when models are available
    """
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        # TODO: Load model when available
        # self.model = torch.load(model_path)
    
    async def analyze(self, image_data: Optional[str] = None, image_url: Optional[str] = None) -> AnalysisResult:
        """Analyze food using custom segmentation model"""
        # TODO: Implement when model is available
        # 1. Load and preprocess image
        # 2. Run through segmentation model
        # 3. Map segmented regions to food classes
        # 4. Estimate portions based on pixel coverage
        # 5. Look up nutrition from database
        raise NotImplementedError("Custom model analyzer not yet implemented. Waiting for model download.")


def get_food_analyzer() -> BaseFoodAnalyzer:
    """Factory function to get appropriate food analyzer based on config"""
    provider = os.getenv("ANALYZER_PROVIDER", "gemini").lower()
    
    if provider == "custom":
        model_path = os.getenv("MODEL_PATH", "./models/best_deeplab_foodseg103.pth")
        if os.path.exists(model_path):
            return CustomModelAnalyzer(model_path)
        else:
            print(f"Custom model not found at {model_path}, falling back to Gemini")
            return GeminiFoodAnalyzer()
    else:
        return GeminiFoodAnalyzer()
