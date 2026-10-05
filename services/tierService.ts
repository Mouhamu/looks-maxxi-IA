import { LooksTier } from '../types';

export interface TierData {
  tier: LooksTier;
  score: number;
  nextTier: LooksTier | null;
  pointsNeeded: number;
  progressPercent: number; // 0 to 100 within current bracket
  title: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeGlow: string;
  gradientText: string;
  description: string;
  levelUpAdvice: string;
}

export const TIER_CONFIG: Record<
  LooksTier,
  {
    min: number;
    max: number;
    next: LooksTier | null;
    nextThreshold: number | null;
    title: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    badgeGlow: string;
    gradientText: string;
    description: string;
    levelUpAdvice: string;
  }
> = {
  SUB3: {
    min: 0,
    max: 29,
    next: 'SUB5',
    nextThreshold: 30,
    title: 'Baseline Tier',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-700',
    badgeText: 'text-slate-300',
    badgeGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.3)]',
    gradientText: 'from-slate-300 to-slate-500',
    description: 'Foundational grooming habits, lighting improvements, and basic haircare will yield immediate elevation.',
    levelUpAdvice: 'Focus on a fresh haircut taper, daily water hydration, and clean neckline alignment to gain instant points.',
  },
  SUB5: {
    min: 30,
    max: 39,
    next: 'LTN',
    nextThreshold: 40,
    title: 'Developing Tier',
    badgeBg: 'bg-amber-950/40',
    badgeBorder: 'border-amber-600/50',
    badgeText: 'text-amber-300',
    badgeGlow: 'shadow-[0_0_18px_rgba(217,119,6,0.3)]',
    gradientText: 'from-amber-200 via-amber-400 to-amber-600',
    description: 'Noticeable progress. Refining beard borders, eyebrow cleanup, and camera angle will push you into LTN.',
    levelUpAdvice: 'Upgrade to a structured haircut suited to your face shape, daily SPF 50, and 60cm camera distance.',
  },
  LTN: {
    min: 40,
    max: 49,
    next: 'MTN',
    nextThreshold: 50,
    title: 'Approaching Harmony',
    badgeBg: 'bg-blue-950/40',
    badgeBorder: 'border-blue-500/50',
    badgeText: 'text-blue-300',
    badgeGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    gradientText: 'from-blue-200 via-sky-400 to-blue-600',
    description: 'Solid presentation foundation. Optimizing eyewear geometry and skin barrier moisture will cross into MTN.',
    levelUpAdvice: 'Select glasses frames matching your zygomatic width and establish a 2-step evening skincare habit.',
  },
  MTN: {
    min: 50,
    max: 59,
    next: 'HTN',
    nextThreshold: 60,
    title: 'Balanced Standard',
    badgeBg: 'bg-cyan-950/50',
    badgeBorder: 'border-cyan-400/60',
    badgeText: 'text-cyan-300',
    badgeGlow: 'shadow-[0_0_22px_rgba(6,182,212,0.4)]',
    gradientText: 'from-cyan-200 via-teal-300 to-cyan-500',
    description: 'Strong, balanced grooming harmony. Elevating haircut texture and wardrobe silhouette unlocks HTN.',
    levelUpAdvice: 'Experiment with sea salt styling spray or matte clay, clean shaven or 3mm stubble precision, and posture.',
  },
  HTN: {
    min: 60,
    max: 69,
    next: 'CHAD',
    nextThreshold: 70,
    title: 'High Aesthetic Refinement',
    badgeBg: 'bg-indigo-950/50',
    badgeBorder: 'border-indigo-400/60',
    badgeText: 'text-indigo-300',
    badgeGlow: 'shadow-[0_0_25px_rgba(99,102,241,0.45)]',
    gradientText: 'from-indigo-200 via-purple-300 to-indigo-500',
    description: 'Exceptional visual polish. Strict skincare consistency, sharp jawline posture, and ideal studio lighting propel you into CHAD.',
    levelUpAdvice: 'Fine-tune tongue posture (mewing habits), sleep hygiene, and tailored monochrome attire to break into CHAD.',
  },
  CHAD: {
    min: 70,
    max: 89,
    next: 'TRUE ADAM',
    nextThreshold: 90,
    title: 'Peak Aesthetic Harmony',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20',
    badgeBorder: 'border-yellow-400/70',
    badgeText: 'text-yellow-300',
    badgeGlow: 'shadow-[0_0_28px_rgba(234,179,8,0.5)]',
    gradientText: 'from-yellow-200 via-amber-300 to-yellow-500',
    description: 'Elite presentation tier. Outstanding symmetry, razor-sharp grooming definition, and flawless photometric balance.',
    levelUpAdvice: 'Perfection in subtle nuances: high-fidelity dermal barrier health and signature personal styling to reach TRUE ADAM.',
  },
  'TRUE ADAM': {
    min: 90,
    max: 100,
    next: null,
    nextThreshold: null,
    title: 'Transcendent Master',
    badgeBg: 'bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-amber-500/30',
    badgeBorder: 'border-cyan-300/80',
    badgeText: 'text-white',
    badgeGlow: 'shadow-[0_0_35px_rgba(34,211,238,0.6)]',
    gradientText: 'from-cyan-300 via-purple-300 to-amber-300',
    description: 'Apex aesthetic evolution. Flawless symmetry presentation, immaculate grooming discipline, and effortless elegance.',
    levelUpAdvice: 'Maintain supreme daily consistency across all habits and document your aesthetic journey as a blueprint pioneer.',
  },
};

export const calculateTier = (rawScore: number): TierData => {
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let tier: LooksTier;
  if (score < 30) tier = 'SUB3';
  else if (score < 40) tier = 'SUB5';
  else if (score < 50) tier = 'LTN';
  else if (score < 60) tier = 'MTN';
  else if (score < 70) tier = 'HTN';
  else if (score < 90) tier = 'CHAD';
  else tier = 'TRUE ADAM';

  const cfg = TIER_CONFIG[tier];
  const nextThreshold = cfg.nextThreshold;
  const pointsNeeded = nextThreshold !== null ? Math.max(0, nextThreshold - score) : 0;

  // Bracket progress
  const bracketRange = (cfg.nextThreshold || 100) - cfg.min;
  const progressWithin = score - cfg.min;
  const progressPercent = Math.min(100, Math.max(0, Math.round((progressWithin / bracketRange) * 100)));

  return {
    tier,
    score,
    nextTier: cfg.next,
    pointsNeeded,
    progressPercent,
    title: cfg.title,
    badgeBg: cfg.badgeBg,
    badgeBorder: cfg.badgeBorder,
    badgeText: cfg.badgeText,
    badgeGlow: cfg.badgeGlow,
    gradientText: cfg.gradientText,
    description: cfg.description,
    levelUpAdvice: cfg.levelUpAdvice,
  };
};

export const compareTiers = (
  prevScore: number,
  currScore: number
): {
  prevTier: LooksTier;
  currTier: LooksTier;
  scoreDiff: number;
  tierChanged: boolean;
  leveledUp: boolean;
} => {
  const prevData = calculateTier(prevScore);
  const currData = calculateTier(currScore);
  const scoreDiff = currScore - prevScore;

  const tierOrder: LooksTier[] = ['SUB3', 'SUB5', 'LTN', 'MTN', 'HTN', 'CHAD', 'TRUE ADAM'];
  const prevIndex = tierOrder.indexOf(prevData.tier);
  const currIndex = tierOrder.indexOf(currData.tier);

  return {
    prevTier: prevData.tier,
    currTier: currData.tier,
    scoreDiff,
    tierChanged: prevData.tier !== currData.tier,
    leveledUp: currIndex > prevIndex,
  };
};
