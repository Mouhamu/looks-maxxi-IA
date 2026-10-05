
import React, { useState, useRef } from 'react';

interface UploadScreenProps {
  onAnalyze: (imageBase64: string, mimeType: string) => void;
  error: string | null;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze, error }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyzeClick = () => {
    if (file && preview) {
      // preview is a data URL: data:image/...,base64,...
      const base64String = preview.split(',')[1];
      onAnalyze(base64String, file.type);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md text-center flex flex-col items-center justify-center p-4 h-full">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h2 className="text-3xl font-bold mb-2">Get Your Face Rated</h2>
        <p className="text-gray-400 mb-8">Upload a clear, front-facing selfie for an honest AI analysis.</p>

        <div 
          className="w-64 h-80 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center mb-6 cursor-pointer hover:border-blue-500 transition-colors"
          onClick={triggerFileSelect}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 block">Tap to upload</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {error && <p className="text-red-500 my-4">{error}</p>}
      </div>
      
      <div className="w-full pb-4">
        <button
          onClick={handleAnalyzeClick}
          disabled={!file}
          className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 transition-transform duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 active:scale-95"
        >
          Analyze My Face
        </button>
      </div>
    </div>
  );
};

export default UploadScreen;
