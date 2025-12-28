# NutriLens Vision Backend

FastAPI backend for NutriLens nutrition tracking application.

## Setup

1.  **Environment**:
    ```bash
    cd nutrilens-vision-backend
    python -m venv venv
    venv\Scripts\activate  # Windows
    pip install -r requirements.txt
    ```

2.  **Model Weights**:
    *   Ensure you have the trained `best_model.pth` (ResNet50+FPN).
    *   Place it in the `../models/` directory or update the config to point to it.

## Run Local Inference Server

```bash
# Starts FastAPI with hot-reloading
uvicorn src.main:app --reload --port 3001
```

## API Endpoints

*   `GET /api/health`: Health check (returns `200 OK` if model is loaded).
*   `POST /api/analyze`: **Core Endpoint**. Accepts `file` and `has_reference`. Runs local PyTorch inference to return segmentation masks and nutrition data.
*   `POST /api/suggest-meals`: Get AI meal suggestions.
