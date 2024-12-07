"""Main script for object detection."""

from .model import ObjectDetector
from .visualization import draw_detections
from .utils import load_image, save_image

def main(image_path, output_path):
    """Main function to run object detection."""
    # Load image
    image = load_image(image_path)
    if image is None:
        return False
    
    # Initialize detector
    detector = ObjectDetector()
    
    # Perform detection
    detections = detector.detect(image)
    
    # Draw results
    result_image = draw_detections(image.copy(), detections, detector.classes)
    
    # Save output
    return save_image(result_image, output_path)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python main.py <input_image> <output_image>")
        sys.exit(1)
    
    success = main(sys.argv[1], sys.argv[2])
    if success:
        print("Detection completed successfully")
    else:
        print("Detection failed")