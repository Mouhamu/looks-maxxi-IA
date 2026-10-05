import React, { useState, useRef, useEffect } from 'react';
import { ImageValidationResult, Language } from '../types';
import { translations } from '../services/i18n';
import { validatePhoto } from '../services/faceDetectionService';

interface PhotoCaptureModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPhoto: (dataUrl: string, mimeType: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  lang,
  isOpen,
  onClose,
  onConfirmPhoto,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery' | 'presets'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<ImageValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset curated sample portraits for instant testing
  const samplePresets = [
    {
      title: 'Balanced Oval Profile',
      url: '/src/assets/images/onboarding_portrait_1791157653881.jpg',
      desc: 'Ideal lighting, neutral expression, clear jawline margin.',
    },
    {
      title: 'Biometric Grid Silhouette',
      url: '/src/assets/images/biometric_face_scan_1791157675063.jpg',
      desc: 'Symmetric frontal alignment for proportion analysis.',
    },
  ];

  // Start Camera
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. You can upload a photo from your gallery or choose a preset.');
      setIsCameraActive(false);
      setActiveTab('gallery');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, capturedImage]);

  if (!isOpen) return null;

  // Capture from live camera
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      // Mirror horizontal for natural selfie feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    setMimeType('image/jpeg');
    verifyAndSetImage(dataUrl);
  };

  // Switch Camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        verifyAndSetImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset Selection
  const handleSelectPreset = (url: string) => {
    setMimeType('image/jpeg');
    verifyAndSetImage(url);
  };

  // Pre-analysis image optimization & quality check
  const compressImage = (dataUrl: string, maxDimension = 1080, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && dataUrl.length < 500000) {
          resolve(dataUrl);
          return;
        }
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const verifyAndSetImage = async (dataUrl: string) => {
    setIsValidating(true);
    const optimized = await compressImage(dataUrl);
    setCapturedImage(optimized);
    const result = await validatePhoto(optimized);
    setIsValidating(false);
    if (!result.valid) {
      setValidationWarning(result);
    } else {
      setValidationWarning(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setValidationWarning(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleProceed = () => {
    if (!capturedImage) return;
    stopCamera();
    onConfirmPhoto(capturedImage, mimeType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {t.captureTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.captureSubtitle}
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls (Only when not captured yet) */}
        {!capturedImage && (
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'camera'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📷</span>
              <span>{t.tabCamera}</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📁</span>
              <span>{t.tabGallery}</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>{t.tabPresets}</span>
            </button>
          </div>
        )}

        {/* Viewport Area */}
        <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center mb-4">
          {capturedImage ? (
            /* Frozen Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured selfie preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-2xl pointer-events-none"></div>
              {/* Biometric alignment oval guideline */}
              <div className="absolute inset-x-12 inset-y-10 border border-dashed border-cyan-400/40 rounded-[50%] pointer-events-none"></div>
            </div>
          ) : activeTab === 'camera' ? (
            /* Live Camera Feed */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />
                  {/* Subtle biometric head guide */}
                  <div className="absolute inset-x-12 inset-y-10 border border-dashed border-cyan-400/50 rounded-[50%] pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-cyan-300 font-mono tracking-widest bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
                      ALIGN FACE
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <span className="text-3xl block mb-2">📸</span>
                  <p className="text-xs text-slate-400 mb-3">
                    {cameraError || 'Initializing camera stream...'}
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-cyan-400 border border-slate-700 hover:bg-slate-700"
                  >
                    Enable Camera
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'gallery' ? (
            /* Gallery Drag and Drop */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-900/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-2xl text-cyan-400">
                📥
              </div>
              <p className="text-xs font-bold text-slate-200 mb-1">
                {t.dragDropText}
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG (Max 25MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Presets Grid */
            <div className="w-full h-full p-3 grid grid-cols-1 gap-2 overflow-y-auto">
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-800"
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-xs font-bold text-white block">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-2">
                      {preset.desc}
                    </span>
                  </div>
                  <span className="text-cyan-400 text-xs font-bold">Use</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Validation Warning Alert */}
        {validationWarning && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div>
                <p className="font-bold mb-0.5">{validationWarning.issueMessage}</p>
                <p className="text-[11px] text-amber-300/80">{validationWarning.suggestion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>↺</span>
                <span>{t.retake}</span>
              </button>
              <button
                onClick={handleProceed}
                disabled={isValidating}
                className="flex-2 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{validationWarning ? t.validationContinueAnyway : t.confirmAnalyze}</span>
                <span>→</span>
              </button>
            </>
          ) : activeTab === 'camera' && isCameraActive ? (
            <div className="w-full flex items-center justify-between px-4">
              <button
                onClick={handleToggleCamera}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                title={t.btnSwitchCamera}
              >
                🔄
              </button>
              <button
                onClick={handleSnap}
                className="w-16 h-16 rounded-full border-4 border-cyan-400 bg-white p-1 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-cyan-500/40"
                title={t.btnTakePhoto}
              >
                <div className="w-full h-full rounded-full bg-cyan-500"></div>
              </button>
              <div className="w-11 h-11" /> {/* balance spacing */}
            </div>
          ) : (
            <button
              onClick={() => {
                if (activeTab === 'gallery') fileInputRef.current?.click();
                if (activeTab === 'presets') handleSelectPreset(samplePresets[0].url);
              }}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {activeTab === 'gallery' ? t.btnChooseFile : 'Select Preset'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
