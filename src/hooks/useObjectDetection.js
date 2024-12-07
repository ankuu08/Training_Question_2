import { useState, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export function useObjectDetection() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadModel = useCallback(async () => {
    try {
      // Ensure TensorFlow.js is properly initialized
      await tf.ready();
      // Load the COCO-SSD model
      const loadedModel = await cocoSsd.load({
        base: 'mobilenet_v2'
      });
      setModel(loadedModel);
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const detectObjects = useCallback(async (image) => {
    if (!model || !image) return null;
    try {
      // Ensure we're passing a valid image element
      if (!(image instanceof HTMLImageElement)) {
        return null;
      }
      // Perform detection
      const predictions = await model.detect(image);
      return predictions;
    } catch (error) {
      console.error('Error detecting objects:', error);
      return null;
    }
  }, [model]);

  // Load model on component mount
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  return { detectObjects, loading };
}