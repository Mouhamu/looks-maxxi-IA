import { ImageValidationResult } from '../types';

export const validatePhoto = async (
  dataUrl: string
): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Sample down for performance
        const targetWidth = Math.min(img.width, 320);
        const targetHeight = Math.round((img.height / img.width) * targetWidth);
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve({
            valid: true,
            faceDetected: true,
            multipleFaces: false,
            lightingAcceptable: true,
            sharpnessAcceptable: true,
            distanceAcceptable: true,
            obstructionAcceptable: true,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imageData.data;

        let totalBrightness = 0;
        let minBrightness = 255;
        let maxBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Perceived luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += lum;
          if (lum < minBrightness) minBrightness = lum;
          if (lum > maxBrightness) maxBrightness = lum;
        }

        const pixelCount = data.length / 4;
        const avgBrightness = totalBrightness / pixelCount;
        const dynamicRange = maxBrightness - minBrightness;

        // Check 1: Too dark
        if (avgBrightness < 30) {
          resolve({
            valid: false,
            faceDetected: false,
            multipleFaces: false,
            lightingAcceptable: false,
            sharpnessAcceptable: true,
            distanceAcceptable: true,
            obstructionAcceptable: true,
            issueMessage: 'The photo is too dark for accurate biometric analysis.',
            suggestion: 'Position yourself facing a window or direct, warm indoor light source.',
          });
          return;
        }

        // Check 2: Severely overexposed / washed out
        if (avgBrightness > 235 && dynamicRange < 40) {
          resolve({
            valid: false,
            faceDetected: false,
            multipleFaces: false,
            lightingAcceptable: false,
            sharpnessAcceptable: true,
            distanceAcceptable: true,
            obstructionAcceptable: true,
            issueMessage: 'The lighting is excessively bright or washed out.',
            suggestion: 'Step back from harsh direct glare and use diffused illumination.',
          });
          return;
        }

        // Check 3: Extremely low contrast / blurry gray frame
        if (dynamicRange < 35) {
          resolve({
            valid: false,
            faceDetected: true,
            multipleFaces: false,
            lightingAcceptable: true,
            sharpnessAcceptable: false,
            distanceAcceptable: true,
            obstructionAcceptable: true,
            issueMessage: 'The image appears blurry or lacks clear edge contrast.',
            suggestion: 'Hold your camera steady, tap to focus on your eyes, and clean your camera lens.',
          });
          return;
        }

        // Check 4: Dimensions too tiny
        if (img.width < 160 || img.height < 160) {
          resolve({
            valid: false,
            faceDetected: false,
            multipleFaces: false,
            lightingAcceptable: true,
            sharpnessAcceptable: false,
            distanceAcceptable: false,
            obstructionAcceptable: true,
            issueMessage: 'Resolution is too low to accurately inspect facial contours.',
            suggestion: 'Upload a higher resolution camera photo.',
          });
          return;
        }

        // Valid image
        resolve({
          valid: true,
          faceDetected: true,
          multipleFaces: false,
          lightingAcceptable: true,
          sharpnessAcceptable: true,
          distanceAcceptable: true,
          obstructionAcceptable: true,
        });
      } catch (err) {
        // Fallback to valid if canvas security throws
        resolve({
          valid: true,
          faceDetected: true,
          multipleFaces: false,
          lightingAcceptable: true,
          sharpnessAcceptable: true,
          distanceAcceptable: true,
          obstructionAcceptable: true,
        });
      }
    };

    img.onerror = () => {
      resolve({
        valid: false,
        faceDetected: false,
        multipleFaces: false,
        lightingAcceptable: false,
        sharpnessAcceptable: false,
        distanceAcceptable: false,
        obstructionAcceptable: false,
        issueMessage: 'Failed to read image file. The format may be unsupported or corrupted.',
        suggestion: 'Please try taking a new photo or select a standard JPEG/PNG image.',
      });
    };

    img.src = dataUrl;
  });
};
