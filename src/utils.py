"""Utility functions for image processing and file handling."""

import cv2

def load_image(image_path):
    """Load and preprocess input image."""
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Failed to load image")
        return image
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def save_image(image, output_path):
    """Save the processed image."""
    try:
        cv2.imwrite(output_path, image)
        return True
    except Exception as e:
        print(f"Error saving image: {e}")
        return False