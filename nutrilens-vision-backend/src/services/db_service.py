"""
Database Service - Supabase Interaction
"""
import os
from typing import List, Optional, Dict, Any
from supabase import create_client, Client
from pydantic import BaseModel
import json

class DBService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DBService, cls).__new__(cls)
            cls._instance.client = None
            cls._instance.initialize()
        return cls._instance
    
    def initialize(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        
        if url and key:
            try:
                self.client: Client = create_client(url, key)
                print("Supabase client initialized successfully")
            except Exception as e:
                print(f"Failed to initialize Supabase client: {e}")
        else:
            print("Supabase credentials not found in environment variables")
    
    async def get_meals(self, user_id: str = "default_user") -> List[Dict[str, Any]]:
        """Fetch meals from Supabase"""
        if not self.client:
            return []
            
        try:
            # Assumes a 'meals' table exists. If user_id filtering is needed:
            # .eq('user_id', user_id)
            response = self.client.table('meal_logs').select("*").order('created_at', desc=True).execute()
            
            meals = []
            for record in response.data:
                # Map DB record to frontend Meal structure
                # This assumes 'items' is stored as JSONB
                meal = {
                    "id": str(record.get('id')),
                    "timestamp": record.get('created_at'),
                    "imageUrl": record.get('image_url', ''),
                    "items": record.get('items', []),
                    "totalCalories": record.get('total_calories', 0),
                    "totalProtein": record.get('total_protein', 0),
                    "totalCarbs": record.get('total_carbs', 0),
                    "totalFats": record.get('total_fats', 0),
                }
                meals.append(meal)
            return meals
        except Exception as e:
            print(f"Error fetching meals: {e}")
            return []

    async def save_meal(self, meal_data: Dict[str, Any], user_id: str = "default_user") -> Optional[Dict[str, Any]]:
        """Save a meal to Supabase"""
        if not self.client:
            print("Supabase client not initialized")
            return None
            
        try:
            # Prepare data for insertion matching expected DB schema
            # We'll use a simplified schema mapping here
            db_record = {
                "user_id": user_id,  # In a real app, this comes from auth
                "items": meal_data.get("items", []),
                "image_url": meal_data.get("imageUrl", ""),
                "total_calories": meal_data.get("totalCalories", 0),
                "total_protein": meal_data.get("totalProtein", 0),
                "total_carbs": meal_data.get("totalCarbs", 0),
                "total_fats": meal_data.get("totalFats", 0),
                # created_at is automatic
            }
            
            # If the meal has a specific timestamp from frontend, we might want to use it
            # depends if DB column 'created_at' is writable or if we have another 'meal_time' column
            
            response = self.client.table('meal_logs').insert(db_record).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error saving meal: {e}")
            return None

def get_db():
    return DBService()
