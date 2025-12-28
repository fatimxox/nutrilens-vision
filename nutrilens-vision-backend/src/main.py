"""
NutriLens Vision Backend - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .routes import meals, analysis

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NutriLens Vision API",
    description="AI-powered nutrition tracking and meal suggestion API",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://localhost:8080",  # Frontend dev server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meals.router, prefix="/api", tags=["meals"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "nutrilens-vision-backend"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "NutriLens Vision API", "docs": "/docs"}
