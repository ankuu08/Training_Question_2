import React, { useRef, useEffect } from 'react';

export function ObjectDetection({ image, predictions }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image || !predictions || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image
    ctx.drawImage(image, 0, 0);

    // Draw predictions
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
      const labelWidth = ctx.measureText(label).width + 10;
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(x, y - 25, labelWidth, 25);

      // Draw label text
      ctx.fillStyle = '#000000';
      ctx.font = '18px Arial';
      ctx.fillText(label, x + 5, y - 7);
    });
  }, [image, predictions]);

  return (
    <div className="max-w-full overflow-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
      />
    </div>
  );
}