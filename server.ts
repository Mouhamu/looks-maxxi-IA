import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      description: 'Useful improvement-oriented scores from 1 to 100 based on grooming, compatibility, and presentation.',
      properties: {
        groomingScore: { type: Type.NUMBER, description: 'Score for visible grooming tidiness and routine care' },
        hairCompatibility: { type: Type.NUMBER, description: 'Score for current hairstyle compatibility with face shape' },
        styleCompatibility: { type: Type.NUMBER, description: 'Score for personal styling harmony and frame balance' },
        photoQuality: { type: Type.NUMBER, description: 'Score for photo lighting, sharpness, distance, and angle' },
        routineConsistency: { type: Type.NUMBER, description: 'Estimated foundational routine consistency' },
        presentationScore: { type: Type.NUMBER, description: 'Overall balanced presentation and grooming score' },
      },
      required: [
        'groomingScore',
        'hairCompatibility',
        'styleCompatibility',
        'photoQuality',
        'routineConsistency',
        'presentationScore',
      ],
    },
    faceProfile: {
      type: Type.OBJECT,
      description: 'Objective observations of facial structure and proportions.',
      properties: {
        faceShape: { type: Type.STRING, description: 'Estimated face shape (e.g. Oval, Square, Round, Heart, Oblong, Diamond)' },
        proportions: { type: Type.STRING, description: 'Balanced vertical third and horizontal fifth notes' },
        symmetryNotes: { type: Type.STRING, description: 'Visible symmetry and structural harmony observations' },
        jawlineChin: { type: Type.STRING, description: 'Jawline definition, posture, and neckline presentation' },
        foreheadHairline: { type: Type.STRING, description: 'Forehead framing and hairline balance observations' },
      },
      required: ['faceShape', 'proportions', 'symmetryNotes', 'jawlineChin', 'foreheadHairline'],
    },
    hair: {
      type: Type.OBJECT,
      description: 'Hair analysis and category suggestions.',
      properties: {
        currentCategory: { type: Type.STRING, description: 'Current hairstyle category observed' },
        compatibility: { type: Type.STRING, description: 'Compatibility with facial structure' },
        suggestedStyles: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 recommended hairstyle cuts with texture/length instructions',
        },
      },
      required: ['currentCategory', 'compatibility', 'suggestedStyles'],
    },
    grooming: {
      type: Type.OBJECT,
      description: 'Facial hair and grooming guidance.',
      properties: {
        beardCompatibility: { type: Type.STRING, description: 'Beard, stubble, or clean-shaven compatibility analysis' },
        eyebrowSuggestions: { type: Type.STRING, description: 'Eyebrow grooming and framing advice' },
        generalPresentation: { type: Type.STRING, description: 'Tidiness, skin hydration look, and maintenance tips' },
      },
      required: ['beardCompatibility', 'eyebrowSuggestions', 'generalPresentation'],
    },
    glasses: {
      type: Type.OBJECT,
      description: 'Eyewear and optical frame recommendations.',
      properties: {
        recommendedFrames: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Frame shapes suited to face geometry (e.g. Geometric Square, Rounded Acetate, Aviator)',
        },
        frameProportions: { type: Type.STRING, description: 'Bridge width and lens depth tips' },
        styleCompatibility: { type: Type.STRING, description: 'Color and material finish suggestions' },
      },
      required: ['recommendedFrames', 'frameProportions', 'styleCompatibility'],
    },
    skincare: {
      type: Type.OBJECT,
      description: 'General visible skin appearance guidance.',
      properties: {
        visibleAppearance: { type: Type.STRING, description: 'Visible skin texture and hydration appearance' },
        morningRoutine: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Morning steps (e.g. gentle cleanser, hydration serum, moisturizer, SPF)',
        },
        eveningRoutine: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Evening steps (e.g. cleansing, barrier cream, restorative hydration)',
        },
        hydrationAdvice: { type: Type.STRING, description: 'Daily hydration and barrier support guidance' },
      },
      required: ['visibleAppearance', 'morningRoutine', 'eveningRoutine', 'hydrationAdvice'],
    },
    photoQuality: {
      type: Type.OBJECT,
      description: 'Evaluation of the selfie quality.',
      properties: {
        lighting: { type: Type.STRING, description: 'Lighting evaluation and improvement tips' },
        angle: { type: Type.STRING, description: 'Camera angle evaluation (e.g. eye level vs high/low)' },
        distance: { type: Type.STRING, description: 'Subject distance and focal length distortion notes' },
        sharpness: { type: Type.STRING, description: 'Focus and clarity rating' },
        composition: { type: Type.STRING, description: 'Headroom and centering tips' },
      },
      required: ['lighting', 'angle', 'distance', 'sharpness', 'composition'],
    },
    recommendations: {
      type: Type.ARRAY,
      description: 'List of top 4-6 actionable recommendations.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          category: { type: Type.STRING, description: 'Hair, Grooming, Skincare, Glasses, Style, or Photo' },
          priority: { type: Type.STRING, description: 'HIGH, MEDIUM, or LOW' },
          what: { type: Type.STRING, description: 'Concrete description of the action' },
          why: { type: Type.STRING, description: 'Why this works with the user facial characteristics' },
          how: { type: Type.STRING, description: 'Specific execution details or barber instructions' },
          maintenance: { type: Type.STRING, description: 'Daily, weekly, or monthly upkeep level' },
        },
        required: ['id', 'title', 'category', 'priority', 'what', 'why', 'how', 'maintenance'],
      },
    },
    actionPlan: {
      type: Type.OBJECT,
      description: 'Personalized evolution roadmap.',
      properties: {
        today: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '1-3 immediate practical actions for today',
        },
        thisWeek: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2-4 weekly grooming/styling milestones',
        },
        thisMonth: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2-3 monthly goals such as new haircut trial and progress photo update',
        },
      },
      required: ['today', 'thisWeek', 'thisMonth'],
    },
  },
  required: [
    'scores',
    'faceProfile',
    'hair',
    'grooming',
    'glasses',
    'skincare',
    'photoQuality',
    'recommendations',
    'actionPlan',
  ],
};

app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, preferences } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'API key not configured. Using fallback local intelligence engine.',
        useMock: true,
      });
    }

    let cleanBase64 = imageBase64;
    if (cleanBase64.includes(';base64,')) {
      cleanBase64 = cleanBase64.split(';base64,')[1];
    }

    const userPrefs = preferences ? `User goals: ${JSON.stringify(preferences)}` : '';

    const prompt = `You are LooksMaxxi BP, an advanced, highly respectful personal grooming, hairstyle, skincare, and self-improvement assistant. Tagline: "Analyze. Improve. Evolve."

Analyze the user's selfie objectively and constructively.
${userPrefs}

CRITICAL ETHICAL & SAFETY RULES:
- Never infer or classify race, ethnicity, religion, sexual orientation, personality, intelligence, criminality, or medical conditions.
- Never diagnose skin diseases or health problems.
- Never claim to measure inherent human worth or attractiveness. Focus strictly on grooming tidiness, hairstyle geometry compatibility with face shape, optical frame matching, and clean presentation.
- Never suggest extreme dieting, starvation, unsafe procedures, or harmful modification.
- Present all recommendations as suggestions.

Return the complete analysis strictly following the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text ? response.text.trim() : '{}';
    const result = JSON.parse(jsonString);

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({
      error: error?.message || 'AI processing encountered an issue. Falling back to local engine.',
      useMock: true,
    });
  }
});

app.post('/api/coach', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'API key not configured', useMock: true });
    }

    const systemInstruction = `You are "BP Coach", the dedicated personal improvement coach inside the LooksMaxxi BP mobile application.
Your role: Be supportive, realistic, motivating, practical, and non-judgmental.
User Context:
${context ? JSON.stringify(context) : 'No previous analysis available.'}

Guidelines:
- Give concise, actionable advice for grooming, hairstyle, skincare basics, glasses, photo lighting, and daily habits.
- Never promote extreme dieting, dangerous cosmetic actions, or insecurity.
- Keep answers punchy, easy to read on mobile, with bullet points and clear next steps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { text: `System context: ${systemInstruction}\nUser message: ${message}` },
      ],
    });

    return res.json({ reply: response.text || "I'm here to help you refine your grooming and presentation. What area would you like to focus on?" });
  } catch (error: any) {
    console.error('Error in /api/coach:', error);
    return res.status(500).json({ error: error?.message, useMock: true });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LooksMaxxi BP server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
