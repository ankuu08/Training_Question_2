"""Configuration settings for the object detection program."""

# Model settings
MODEL_PATH = "models/yolov3.weights"
CONFIG_PATH = "models/yolov3.cfg"
CLASSES_PATH = "models/coco.names"

# Detection settings
CONFIDENCE_THRESHOLD = 0.5
NMS_THRESHOLD = 0.4

# Display settings
FONT_SCALE = 0.5
FONT_THICKNESS = 1
BOX_THICKNESS = 2