"""Visualization utilities for displaying detection results."""

import cv2
from .config import *

def draw_detections(image, detections, class_names):
    """Draw bounding boxes and labels on the image."""
    for box, confidence, class_id in detections:
        x, y, w, h = box
        label = f"{class_names[class_id]}: {confidence:.2f}"
        
        # Draw bounding box
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), BOX_THICKNESS)
        
        # Draw label background
        label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, FONT_SCALE, FONT_THICKNESS)[0]
        cv2.rectangle(image, (x, y - 20), (x + label_size[0], y), (0, 255, 0), -1)
        
        # Draw label text
        cv2.putText(image, label, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    FONT_SCALE, (0, 0, 0), FONT_THICKNESS)
    
    return image