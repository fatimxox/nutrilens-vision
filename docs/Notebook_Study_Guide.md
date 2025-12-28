# Notebook Study Guide: Architectural Flows

This guide provides visual aids for studying the four core notebooks in the `nutrilens-vision` project.

## 1. Reference Object Detection
**Notebook**: `01_card_detection_and_nutrition_estimation.ipynb`
**Focus**: Computer Vision, OpenCV, Perspective Transform.

The pipeline for detecting the reference object (standard credit card) to calibrate size scaling.
![Card Detection Flow](file:///f:/AI/CNN/docs/card_detection_flow.png)

## 2. MobileNetV2 + DeepLabV3+ (Training)
**Notebook**: `02_deeplabv3_mobilenetv2_segmentation_training.ipynb`
**Focus**: Efficient Deep Learning, Transfer Learning, Mobile Architecture.

An optimized architecture designed for speed on mobile devices/edge servers. It uses "Inverted Residual Blocks" to reduce floating-point operations.
![MobileNet Architecture](file:///f:/AI/CNN/docs/flow_02_mobilenet.png)

## 3. ResNet50 + FPN + ASPP (Optimization)
**Notebook**: `03_resnet50_fpn_aspp_optimized_segmentation.ipynb`
**Focus**: High-Accuracy Segmentation, Feature Pyramid Networks.

The "Heavy" model architecture chosen for the final implementation due to its superior accuracy in distinguishing complex food boundaries.
![ResNet50 Architecture](file:///f:/AI/CNN/docs/model_architecture_detailed.png)

## 4. Data Exploration & Analysis
**Notebook**: `04_foodseg103_data_exploration.ipynb`
**Focus**: EDA, Data Visualization, Class Distribution.

The workflow for understanding the `FoodSeg103` dataset before training.
![Data Exploration Flow](file:///f:/AI/CNN/docs/flow_04_data_exploration.png)
