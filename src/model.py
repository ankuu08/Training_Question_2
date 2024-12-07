"""YOLOv3 model handling and object detection."""

import cv2
import numpy as np
from .config import *

class ObjectDetector:
    def __init__(self):
        self.classes = self._load_classes()
        self.net = self._load_model()
        self.output_layers = self._get_output_layers()
    
    def _load_classes(self):
        """Load COCO class names."""
        try:
            with open(CLASSES_PATH, 'r') as f:
                return [line.strip() for line in f.readlines()]
        except FileNotFoundError:
            print("Error: COCO classes file not found")
            return []
    
    def _load_model(self):
        """Load YOLOv3 model."""
        try:
            return cv2.dnn.readNet(MODEL_PATH, CONFIG_PATH)
        except Exception as e:
            print(f"Error loading model: {e}")
            return None
    
    def _get_output_layers(self):
        """Get output layers of the network."""
        layer_names = self.net.getLayerNames()
        return [layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
    
    def detect(self, image):
        """Perform object detection on the input image."""
        blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
        self.net.setInput(blob)
        outputs = self.net.forward(self.output_layers)
        return self._process_outputs(outputs, image.shape[:2])
    
    def _process_outputs(self, outputs, image_shape):
        """Process network outputs to get detections."""
        boxes = []
        confidences = []
        class_ids = []
        
        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                
                if confidence > CONFIDENCE_THRESHOLD:
                    center_x = int(detection[0] * image_shape[1])
                    center_y = int(detection[1] * image_shape[0])
                    width = int(detection[2] * image_shape[1])
                    height = int(detection[3] * image_shape[0])
                    
                    x = int(center_x - width/2)
                    y = int(center_y - height/2)
                    
                    boxes.append([x, y, width, height])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        
        indices = cv2.dnn.NMSBoxes(boxes, confidences, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)
        return [(boxes[i], confidences[i], class_ids[i]) for i in indices]