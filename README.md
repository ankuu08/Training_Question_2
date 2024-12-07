# Object Detection Program

This program performs object detection using YOLOv3 and OpenCV. It's organized into multiple modules following best practices for code organization and maintainability.

## Project Structure

- `src/`
  - `config.py`: Configuration settings and constants
  - `model.py`: YOLOv3 model implementation and detection logic
  - `visualization.py`: Functions for drawing detection results
  - `utils.py`: Utility functions for image processing
  - `main.py`: Main script to run the program

## Usage

```bash
python src/main.py input.jpg output.jpg
```

## Requirements

- OpenCV
- NumPy
- YOLOv3 weights and configuration files
- COCO class names file

## Features

- Object detection using YOLOv3
- Support for JPEG images
- Bounding box visualization
- Class name and confidence score display