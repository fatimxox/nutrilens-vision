# NutriLens Vision: Project Proposal

## 1. Executive Summary
NutriLens Vision is an AI-powered dietary analysis system designed to provide accurate, real-time nutrition estimation from food images. Unlike conventional solutions that rely on cloud-based APIs with high latency and privacy concerns, NutriLens Vision leverages **local, on-device deep learning inference**. By integrating a state-of-the-art semantic segmentation architecture (ResNet50 backbone + Feature Pyramid Network + Atrous Spatial Pyramid Pooling) directly into the backend, the system achieves precise food volumetric estimation and calorie calculation specific to the Egyptian culinary context.

## 2. Problem Statement
Manual calorie tracking is tedious and often inaccurate. Users struggle to estimate portion sizes, leading to abandonment of health goals. Existing automated solutions often suffer from:
*   **Lack of Scale Awareness**: Inability to judge real-world portion sizes from 2D images.
*   **Generic Datasets**: Failure to recognize specific regional dishes (e.g., Koshary, Hawawshi).
*   **Privacy & Latency Issues**: heavy reliance on external commercial APIs.

## 3. Methodology & Technical Approach

### 3.1. Reference Object Detection for Scale
To solve the portion estimation challenge, we employ a reference object technique.
*   **Mechanism**: The user places a standard-sized object (a credit card or coin) in the frame.
*   **Algorithm**: A specialized Computer Vision module (developed in `01_card_detection_and_nutrition_estimation.ipynb`) detects the card's contours to calculate a `pixel_to_cm` ratio. This allows for accurate depth and volume estimation of food items.

### 3.2. Advanced Semantic Segmentation
Core analysis is performed by a custom-trained deep learning model.
*   **Architecture**: We utilize a **DeepLabV3+ inspired architecture** modified with a **ResNet50** backbone for feature extraction, augmented by a **Feature Pyramid Network (FPN)** for multi-scale handling, and **ASPP (Atrous Spatial Pyramid Pooling)** to capture contextual information.
*   **Training**: The model was trained on the `FoodSeg103` dataset, fine-tuned to segment food pixels from background noise with high IoU (Intersection over Union).
*   **Inference**: The model runs locally on the application server, ensuring data privacy and reducing dependence on external internet bandwidth.

## 4. Technical Implementation: From Research to Code

Our system directly implements key techniques from foundational Computer Vision research papers.

### 4.1. DeepLabV3+ & ResNet (Chen et al., He et al.)
We implemented the **DeepLabV3+** decoder structure to refine segmentation boundaries, critical for distinguishing adjacent food items.
*   **Technique Implemented**: **Atrous Spatial Pyramid Pooling (ASPP)**.
*   **Why**: Standard convolutions lose detail at high resolutions. ASPP allows us to probe the incoming feature map at multiple rates (dilation rates of 6, 12, 18), capturing objects of varying sizes without losing resolution.
*   **Backbone**: We replaced the standard Xception backbone with **ResNet50** (He et al.) to balance accuracy and inference speed for our local server environment.

### 4.2. Feature Pyramid Networks (Lin et al.)
*   **Technique Implemented**: **Top-Down Pathway and Lateral Connections**.
*   **Why**: Food items appear at drastically different scales (e.g., a small garnish vs. a main steak). FPN builds high-level semantic feature maps at all scales, improving the detection of small ingredients often missed by single-scale detectors.

### 4.3. Reference Object Scaling (Custom Implementation)
*   **Technique Implemented**: **Perspective Transformation & Canny Edge Detection**.
*   **Why**: To convert pixel volume to physical volume ($cm^3$).
*   **Flow**:
    1.  **Gaussian Blur** (reduce noise).
    2.  **Canny Edge Detection** (find object boundaries).
    3.  **Contour Approximation** (isolate the standard card shape).
    4.  **Perspective Warp** (flatten the view for accurate measurement).
    5.  **Ratio Calculation** (pixels per cm).

## 5. Frontend & Backend Implementation Details

### 5.1. Frontend Architecture (React + Vite)
The user interface is built for performance and responsiveness.
*   **Core Framework**: **React 18** with **TypeScript** for type-safe component development.
*   **Build Tool**: **Vite** is used for ultra-fast hot module replacement (HMR) and optimized production builds.
*   **Styling**: **TailwindCSS** for a utility-first design system, ensuring consistent spacing, typography, and color themes (Slate/Emerald palette).
*   **Image Handling**:
    *   **Canvas API**: Used to resize images on the client-side before upload to reduce latency.
    *   **Overlay Rendering**: SVG paths are drawn over the original image to visualize the segmentation masks returned by the backend.
*   **State Management**: **React Query (TanStack Query)** manages server state, caching API responses, and handling loading/error states for a smooth UX.

### 5.2. Backend Architecture (FastAPI + PyTorch)
The backbone of the system is a high-performance Python server.
*   **API Framework**: **FastAPI** (ASGI) was chosen for its native async support and automatic OpenAPI documentation generation.
*   **Data Validation**: **Pydantic** models ensure that all incoming requests (files, parameters) and outgoing responses (nutrition JSON) adhere to a strict schema.
*   **Model Serving**:
    *   The PyTorch model is loaded once at startup ("App Lifecycle Event") to avoid per-request latency.
    *   Inference runs in a thread pool to prevent blocking the main async event loop.
*   **Image Processing**: **OpenCV** and **PIL** (Pillow) are used for tensor transformation (normalization, resizing) before feeding data to the neural network.

## 6. Expected Outcomes
*   **High Precision**: accurate segmentation of complex mixed meals.
*   **Real-time Feedback**: Immediate nutritional breakdown.
*   **Privacy-First**: No images leave the secure local environment for 3rd party analysis.

## 5. References
This project builds upon foundational research in computer vision:
1.  *He, K., et al. "Deep Residual Learning for Image Recognition" (ResNet)*.
2.  *Chen, L.-C., et al. "Encoder-Decoder with Atrous Separable Convolution for Semantic Image Segmentation" (DeepLabV3+)*.
3.  *Lin, T.-Y., et al. "Feature Pyramid Networks for Object Detection" (FPN)*.
4.  *Wu, X., et al. "A Large-Scale Benchmark for Food Image Segmentation and Estimation" (FoodSeg103)*.
