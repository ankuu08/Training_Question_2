import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function ImageUpload({ onImageUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => onImageUpload(img);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the image here...</p>
      ) : (
        <p>Drag and drop a JPEG image here, or click to select one</p>
      )}
    </div>
  );
}