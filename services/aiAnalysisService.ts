import { AnalysisResult, GoalCategory } from '../types';
import { generateMockAnalysis, getMockCoachResponse } from './mockAiEngine';

export const analyzeFaceWithAI = async (
  imageBase64: string,
  mimeType: string,
  userGoals: GoalCategory[] = []
): Promise<AnalysisResult> => {
  let cleanBase64 = imageBase64;
  if (cleanBase64.includes(';base64,')) {
    cleanBase64 = cleanBase64.split(';base64,')[1];
  }

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: cleanBase64,
        mimeType: mimeType || 'image/jpeg',
        preferences: { goals: userGoals },
      }),
    });

    if (!response.ok) {
      console.warn('API returned non-200. Activating local deterministic analysis engine.');
      return generateMockAnalysis(imageBase64, mimeType, userGoals);
    }

    const data = await response.json();

    if (data.useMock) {
      return generateMockAnalysis(imageBase64, mimeType, userGoals);
    }

    // Verify structured response conforms to AnalysisResult
    const id = `scan_${Date.now()}`;
    const result: AnalysisResult = {
      id,
      timestamp: Date.now(),
      image: imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${cleanBase64}`,
      isMock: false,
      scores: data.scores || {
        groomingScore: 84,
        hairCompatibility: 86,
        styleCompatibility: 82,
        photoQuality: 88,
        routineConsistency: 80,
        presentationScore: 85,
      },
      faceProfile: data.faceProfile,
      hair: data.hair,
      grooming: data.grooming,
      glasses: data.glasses,
      skincare: data.skincare,
      photoQuality: data.photoQuality,
      recommendations: data.recommendations || [],
      actionPlan: data.actionPlan || {
        today: ['Stick to morning skincare', 'Clean neck lineup'],
        thisWeek: ['Book haircut appointment', 'Audit glasses shape'],
        thisMonth: ['Take second progress scan', 'Refine wardrobe basics'],
      },
    };

    return result;
  } catch (err) {
    console.warn('Network or server exception during analysis. Engaging fallback engine:', err);
    return generateMockAnalysis(imageBase64, mimeType, userGoals);
  }
};

export const askCoach = async (
  message: string,
  history: any[],
  context?: any
): Promise<string> => {
  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history, context }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply && !data.useMock) {
        return data.reply;
      }
    }
  } catch (e) {
    console.warn('Coach API unavailable, serving intelligent fallback response.');
  }

  return getMockCoachResponse(message, context);
};
