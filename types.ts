export type Language = 'en' | 'ar' | 'fr' | 'es';
export type ThemeMode = 'dark' | 'light';
export type SubscriptionTier = 'free' | 'pro';

export type GoalCategory =
  | 'grooming'
  | 'hairstyle'
  | 'skincare'
  | 'style'
  | 'photo'
  | 'presentation';

export interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  avatar?: string;
  createdAt: number;
  subscription: SubscriptionTier;
  goals: GoalCategory[];
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface ImprovementScores {
  groomingScore: number;
  hairCompatibility: number;
  styleCompatibility: number;
  photoQuality: number;
  routineConsistency: number;
  presentationScore: number;
}

export interface FaceProfile {
  faceShape: string;
  proportions: string;
  symmetryNotes: string;
  jawlineChin: string;
  foreheadHairline: string;
}

export interface HairAnalysis {
  currentCategory: string;
  compatibility: string;
  suggestedStyles: string[];
}

export interface GroomingAnalysis {
  beardCompatibility: string;
  eyebrowSuggestions: string;
  generalPresentation: string;
}

export interface GlassesAnalysis {
  recommendedFrames: string[];
  frameProportions: string;
  styleCompatibility: string;
}

export interface SkincareAnalysis {
  visibleAppearance: string;
  morningRoutine: string[];
  eveningRoutine: string[];
  hydrationAdvice: string;
}

export interface PhotoQualityAnalysis {
  lighting: string;
  angle: string;
  distance: string;
  sharpness: string;
  composition: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'Hair' | 'Grooming' | 'Skincare' | 'Glasses' | 'Style' | 'Photo';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  what: string;
  why: string;
  how: string;
  maintenance: string;
}

export interface ActionPlan {
  today: string[];
  thisWeek: string[];
  thisMonth: string[];
}

export type LooksTier = 'SUB3' | 'SUB5' | 'LTN' | 'MTN' | 'HTN' | 'CHAD' | 'TRUE ADAM';

export interface AnalysisResult {
  id: string;
  timestamp: number;
  image: string;
  isMock: boolean;
  tier?: LooksTier;
  scores: ImprovementScores;
  faceProfile: FaceProfile;
  hair: HairAnalysis;
  grooming: GroomingAnalysis;
  glasses: GlassesAnalysis;
  skincare: SkincareAnalysis;
  photoQuality: PhotoQualityAnalysis;
  recommendations: Recommendation[];
  actionPlan: ActionPlan;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  max: number;
}

export interface RoutineTask {
  id: string;
  title: string;
  subtitle: string;
  timeOfDay: 'morning' | 'evening';
  completed: boolean;
  category: 'skincare' | 'grooming' | 'hygiene' | 'style';
}

export interface StyleItem {
  id: string;
  category: 'hair' | 'beard' | 'glasses' | 'style';
  name: string;
  compatibilityTag: string;
  whyItWorks: string;
  maintenance: 'Low' | 'Medium' | 'High';
  howToTry: string;
  tags: string[];
  bookmarked?: boolean;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: number;
  suggestedPrompts?: string[];
}

export type NavigationTab = 'home' | 'style-lab' | 'progress' | 'coach' | 'profile' | 'routine';

export type AppScreen =
  | 'onboarding'
  | 'auth'
  | 'main'
  | 'capture'
  | 'scanning'
  | 'results'
  | 'report'
  | 'pro'
  | 'settings'
  | 'history-detail';

export interface ImageValidationResult {
  valid: boolean;
  faceDetected: boolean;
  multipleFaces: boolean;
  lightingAcceptable: boolean;
  sharpnessAcceptable: boolean;
  distanceAcceptable: boolean;
  obstructionAcceptable: boolean;
  issueMessage?: string;
  suggestion?: string;
}
