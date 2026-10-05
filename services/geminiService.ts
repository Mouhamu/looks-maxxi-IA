import { AnalysisResult } from '../types';

export const analyzeFace = async (imageBase64: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unexpected server error occurred.' }));
      throw new Error(errorData.error || `Server responded with ${response.status}: ${response.statusText}`);
    }

    const result = (await response.json()) as AnalysisResult;
    return result;
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    throw new Error(error?.message || 'Failed to analyze the image. Please try again later.');
  }
};
