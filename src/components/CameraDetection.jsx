import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
  frameRate: 10
};

export function CameraDetection({ onFrame }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onload = () => onFrame(img);
      }
    }
  }, [onFrame]);

  useEffect(() => {
    let interval;
    if (webcamRef.current) {
      interval = setInterval(capture, 200); // Reduce frame rate for better performance
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [capture]);

  return (
    <div className="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg"
        mirrored={false}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}