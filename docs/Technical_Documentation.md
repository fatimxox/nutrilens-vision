# NutriLens Vision: Technical Documentation

## 1. System Architecture

The NutriLens system follows a modern client-server architecture designed for local inference performance.

```mermaid
graph TD
    Client[Frontend (React/Vite)] -->|Upload Image + Ref Object| API[FastAPI Backend]
    API -->|Pre-processing| Pre[Image Preprocessor]
    Pre -->|detect_card()| Scale[Scale Estimator]
    Pre -->|transform()| Tensor[Input Tensor]
    Tensor -->|Inference| Model[ResNet50+FPN+ASPP Model]
    Model -->|Masks| Post[Post-Processor]
    Scale -->|Pixel Ratio| Vol[Volume Calculator]
    Post -->|Classes| Vol
    Vol -->|Portion Data| DB[Nutrition Database]
    DB -->|JSON Response| API
    API -->|Analysis Result| Client
```

### 1.1 Components
*   **Frontend**: React + TypeScript application. Handles image capture and user interaction.
*   **Backend**: Python FastAPI server. Hosts the PyTorch model and handles business logic.
*   **Model Engine**: A simplified inference engine loading `best_model.pth` (ResNet50 based).

## 2. API Documentation

### POST `/api/analyze`
Triggers the local Deep Learning pipeline to analyze an uploaded food image.

**Request:**
*   `file`: The food image (JPEG/PNG).
*   `has_reference`: Boolean, true if a credit card is present for scale.

**Process:**
1.  Image is resized to 512x512 for the model.
2.  `LocalModelInference` class loads weights from `models/resnet50_fpn.pth`.
3.  Forward pass generates a segmentation mask.
4.  Pixel counting + Scale factors = Volume estimation.

**Response:**
```json
{
  "status": "success",
  "segments": [
    {
      "food_item": "grilled_chicken",
      "confidence": 0.92,
      "mask_area_pixels": 45020,
      "estimated_weight_g": 150,
      "nutrition": {
        "calories": 239,
        "protein": 27,
        "carbs": 0,
        "fat": 13
      }
    }
  ],
  "processing_time_ms": 1200
}
```

## 3. Local Model Integration

The core of the system is the `FoodSegmentor` class found in `src/ai/inference.py`.

### Model Loader
```python
# Pseudo-code for model loading
class FoodSegmentor:
    def __init__(self, model_path="models/best_checkpoint.pth"):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = ResNet50_FPN(num_classes=104)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()

    def predict(self, image_tensor):
        with torch.no_grad():
            output = self.model(image_tensor)
        return output.argmax(dim=1)
```

## 3. Model Neural Architecture

The core inference engine is a composite architecture designed for high-fidelity segmentation.

![Detailed Model Architecture](file:///f:/AI/CNN/docs/model_architecture_detailed.png)

1.  **ResNet50 Backbone**: Extracts features at 5 different scales (Conv1 - Conv5).
2.  **ASPP Module**: The Res5 output flows into the Atrous Spatial Pyramid Pooling module. This applies dilated convolutions at rates (6, 12, 18) to gather multi-scale context.
3.  **Decoder**: High-level features from ASPP are concatenated with low-level features (from Res2), refined by 3x3 convolutions, and upsampled to generate the final mask.

## 4. Reference Object Detection Pipeline

To ensure accurate portion estimation, we preprocess every image to detect a standard credit card reference object.

![Card Detection Flow](file:///f:/AI/CNN/docs/card_detection_flow.png)

*   **Step 1-3**: Preprocessing (Grayscale, Blur) to remove texture noise.
*   **Step 4**: **Canny Edge Detection** creates a binary map of strong edges.
*   **Step 5**: Contour retrieval finds closed shapes; we filter for 4-sided polygons approximating the aspect ratio of a credit card.
*   **Step 6**: A **Perspective Transform** rectifies the card image to a top-down view to calculate the precise `pixels_per_cm` ratio.

## 5. Setup & Installation
1.  Clone the repository.
2.  Install dependencies: `pip install -r requirements.txt` (ensure `torch`, `torchvision`, `opencv-python` are included).
3.  **Download Model Weights**: Place the trained `.pth` file in the `models/` directory.
    *   *Note: The model is trained on the FoodSeg103 dataset as detailed in `notebooks/03_resnet50_fpn_aspp_optimized_segmentation.ipynb`.*
4.  Run the server: `python -m uvicorn src.main:app --reload`.
