import { AnalysisResult, GoalCategory } from '../types';

export const generateMockAnalysis = (
  imageBase64: string,
  mimeType: string,
  userGoals: GoalCategory[] = []
): AnalysisResult => {
  // Deterministic seed based on image length and goals
  const seed = (imageBase64.length % 5);

  const faceShapes = [
    {
      shape: 'Oval',
      proportions: 'Balanced vertical facial thirds (forehead 33%, mid-face 34%, lower jaw 33%). High structural equilibrium.',
      symmetry: 'Slight natural deviation at brow arch; jawline lateral balance within 95th percentile symmetry.',
      jawline: 'Clean angular mandibular angle with defined gonial transition; optimal resting chin projection.',
      forehead: 'Proportional hairline width; suits either textured crop or swept volume without shortening midface.',
      hairCategory: 'Medium Textured Cut',
      suggestedStyles: [
        'Textured French Crop with low taper fade',
        'Modern Quiff with natural matte finish',
        'Side Part Pompadour with taper sides',
      ],
      beard: 'Maintained 3-day designer stubble (3mm) emphasizes mandibular definition without widening the lower face.',
      glasses: ['Square Geometric Acetate', 'Classic Clubmaster', 'Slim Titanium Wire'],
      glassesProportions: '49-51mm lens width with a keyhole bridge balances horizontal eye spacing.',
    },
    {
      shape: 'Square',
      proportions: 'Strong horizontal balance between zygomatic cheekbones and gonial jawline width.',
      symmetry: 'High horizontal symmetry; strong lateral balance along the vertical center axis.',
      jawline: 'Pronounced, chiselled jawline with wide mandibular spread and firm chin definition.',
      forehead: 'Broad, masculine forehead structure; benefits from hairstyles with softer upper texture.',
      hairCategory: 'Textured Crop / Ivy League',
      suggestedStyles: [
        'Ivy League with scissor-cut sides',
        'Messy Textured Fringe with temple fade',
        'Short Classic Taper with textured top',
      ],
      beard: 'Clean-shaven or short boxed beard tapered along cheeks to soften mandibular corners.',
      glasses: ['Curved Round Frames', 'Soft Hexagonal Wire', 'Aviator Optical'],
      glassesProportions: 'Rounded lower rim contrasts square angles and softens jawline corners.',
    },
    {
      shape: 'Heart / Inverted Triangle',
      proportions: 'Wide zygomatic arch and temples tapering smoothly toward an acute, defined chin point.',
      symmetry: 'Strong central symmetry around the orbital region and nose bridge.',
      jawline: 'Refined, narrow chin; benefits from balanced jaw framing to ground the lower facial third.',
      forehead: 'Wide, prominent forehead; fringe styles and side volume create flattering proportion.',
      hairCategory: 'Mid-Length Flow / Fringe',
      suggestedStyles: [
        'Mid-Length Layered Flow',
        'Textured Curtain Haircut (middle part)',
        'Low Fade with forward textured fringe',
      ],
      beard: 'Full short beard (4-5mm) adds horizontal volume and balances the narrower lower third.',
      glasses: ['Bottom-Heavy Wayfarer', 'Rimless Minimal Wire', 'Rounded P3 Frames'],
      glassesProportions: 'Wider bottom frame proportions soften upper temple width.',
    },
    {
      shape: 'Oblong / Rectangular',
      proportions: 'Elongated vertical axis with uniform cheek and jawline width.',
      symmetry: 'Consistent linear symmetry from hairline to chin.',
      jawline: 'Extended linear jawline with clear horizontal base.',
      forehead: 'High forehead line; benefits from forehead-covering fringes to reduce perceived vertical length.',
      hairCategory: 'Textured Caesar / Forward Fringe',
      suggestedStyles: [
        'Forward Textured Caesar with temple drop',
        'Messy Casual Fringe with natural waves',
        'Side Swept Textured Crew Cut',
      ],
      beard: 'Medium stubble or balanced chevron mustache; avoid goatee which elongates the chin.',
      glasses: ['Wide Square Frames', 'Deep Wayfarer', 'Bold Browline Acetate'],
      glassesProportions: 'Taller lens depth (42mm+) breaks up vertical facial height effectively.',
    },
    {
      shape: 'Diamond',
      proportions: 'Prominent cheekbones with tapered forehead and narrow pointed jawline.',
      symmetry: 'High zygomatic symmetry with clear facial contour angles.',
      jawline: 'Sculpted, sharp chin presentation with distinct mandibular contour.',
      forehead: 'Slightly narrower forehead width than midface.',
      hairCategory: 'Textured Quiff / Side Part',
      suggestedStyles: [
        'Textured Quiff with volume at temples',
        'Soft Side Sweep with medium taper',
        'Layered Shag with ear drape',
      ],
      beard: 'Full rounded beard to fill out chin taper and harmonize with cheekbone projection.',
      glasses: ['Oval Frames', 'Subtle Cat-Eye or Browline', 'Round Horn-Rim'],
      glassesProportions: 'Frames no wider than cheekbones maintain natural angular balance.',
    },
  ];

  const profile = faceShapes[seed];

  // Improvement-oriented scores
  const scores = {
    groomingScore: 82 + (seed * 3) % 12,
    hairCompatibility: 85 + (seed * 2) % 11,
    styleCompatibility: 80 + (seed * 4) % 14,
    photoQuality: 88 - (seed * 3) % 10,
    routineConsistency: 79 + (seed * 3) % 15,
    presentationScore: 84 + (seed * 2) % 12,
  };

  const id = `scan_${Date.now()}`;

  return {
    id,
    timestamp: Date.now(),
    image: imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${imageBase64}`,
    isMock: true,
    scores,
    faceProfile: {
      faceShape: profile.shape,
      proportions: profile.proportions,
      symmetryNotes: profile.symmetry,
      jawlineChin: profile.jawline,
      foreheadHairline: profile.forehead,
    },
    hair: {
      currentCategory: profile.hairCategory,
      compatibility: `Strong structural alignment with ${profile.shape.toLowerCase()} geometry when top volume is balanced with tapered sides.`,
      suggestedStyles: profile.suggestedStyles,
    },
    grooming: {
      beardCompatibility: profile.beard,
      eyebrowSuggestions: 'Natural arch with light stray cleanup between brows; preserve natural density to frame eye depth.',
      generalPresentation: 'Hydrated look with clean neckline line-up and well-defined stubble margins.',
    },
    glasses: {
      recommendedFrames: profile.glasses,
      frameProportions: profile.glassesProportions,
      styleCompatibility: 'Matte black, dark tortoiseshell, or brushed slate titanium complements skin undertones.',
    },
    skincare: {
      visibleAppearance: 'Balanced to slightly combination skin presentation with good elasticity and minimal surface dullness.',
      morningRoutine: [
        '1. Gentle low-pH hydrating foam cleanser',
        '2. Hyaluronic acid serum on damp skin for cellular plumping',
        '3. Lightweight non-comedogenic gel moisturizer',
        '4. Broad-spectrum SPF 50 invisible matte sunscreen',
      ],
      eveningRoutine: [
        '1. Oil-based pre-cleanse to dissolve environmental pollution',
        '2. Gentle clarifying wash',
        '3. 2% Niacinamide or barrier restoration ceramide serum',
        '4. Deep barrier recovery cream',
      ],
      hydrationAdvice: 'Maintain 2.5L daily water intake and use an occlusive lip balm before sleep.',
    },
    photoQuality: {
      lighting: 'Natural front-facing ambient lighting observed. Soft shadows define cheekbone depth.',
      angle: 'Close to eye-level (~0 degrees tilt). Ideal for true cranial proportion appraisal.',
      distance: 'Approximately 60cm from lens. Minimal wide-angle lens nose-distortion.',
      sharpness: 'Good focal clarity across iris and brow boundaries.',
      composition: 'Centrally placed with adequate cranial clearance in upper thirds.',
    },
    recommendations: [
      {
        id: 'rec_1',
        title: profile.suggestedStyles[0],
        category: 'Hair',
        priority: 'HIGH',
        what: `Request a ${profile.suggestedStyles[0]} on your next barber appointment.`,
        why: `Adds upper-third texture that harmonizes with your ${profile.shape.toLowerCase()} facial structure without exaggerating lower jaw angles.`,
        how: 'Bring reference photos to your barber. Ask for textured scissor cut on top with finger-length length and low-taper neck.',
        maintenance: 'Trim every 3 to 4 weeks; style daily using pea-sized matte clay on towel-dried hair.',
      },
      {
        id: 'rec_2',
        title: 'Precision Mandibular Stubble Framing',
        category: 'Grooming',
        priority: 'HIGH',
        what: 'Define neckline 1cm above the Adam’s apple and maintain 3mm uniform stubble.',
        why: 'Sharpens the transition between under-chin and neck, visibly defining mandibular line.',
        how: 'Use an adjustable beard trimmer with 3mm guard, clean edges with a safety razor or foil shaver.',
        maintenance: 'Trim every 2-3 days; apply 2 drops of non-comedogenic squalane beard oil.',
      },
      {
        id: 'rec_3',
        title: profile.glasses[0],
        category: 'Glasses',
        priority: 'MEDIUM',
        what: `Consider ${profile.glasses[0]} if wearing optical or blue-light lenses.`,
        why: `The frame geometry balances horizontal eye spacing and counterbalances your ${profile.shape.toLowerCase()} contours.`,
        how: 'Try on frame dimensions matching 49mm-51mm eye size with a 19mm bridge.',
        maintenance: 'Clean with microfiber cloth and lens spray; adjust nose pads at optometrist.',
      },
      {
        id: 'rec_4',
        title: 'Daily SPF 50 & Barrier Shield',
        category: 'Skincare',
        priority: 'MEDIUM',
        what: 'Adopt consistent daily broad-spectrum sun protection every morning.',
        why: 'Prevents photo-aging, preserves collagen elasticity, and ensures even dermal tone.',
        how: 'Apply 2 finger-lengths of fluid SPF after moisturizer, 15 minutes before sun exposure.',
        maintenance: 'Daily morning habit; reapply if spending extended time outdoors.',
      },
      {
        id: 'rec_5',
        title: 'Camera Lighting & Catchlight Alignment',
        category: 'Photo',
        priority: 'LOW',
        what: 'Face north-facing natural window light when taking portraits or selfies.',
        why: 'Generates crisp iris catchlights and eliminates harsh overhead forehead shadows.',
        how: 'Position camera at eye level, 70cm distance, angled 5 degrees towards your best profile.',
        maintenance: 'Apply whenever taking progress documentation photos.',
      },
    ],
    actionPlan: {
      today: [
        'Establish 2-minute morning rinse + moisturizer + SPF routine.',
        'Trim and line up neck border 1cm above Adam’s apple.',
        'Drink 2 glasses of water to support cellular skin hydration.',
      ],
      thisWeek: [
        `Book barber appointment for ${profile.suggestedStyles[0]}.`,
        'Try matte styling clay or sea salt spray for natural crown volume.',
        'Audit eyewear or sunglasses against recommended frame geometry.',
      ],
      thisMonth: [
        'Document second progress scan in identical lighting to evaluate progress.',
        'Review skincare routine adaptation and consistency streak in app.',
        'Update personal styling goals and favorite items in Style Lab.',
      ],
    },
  };
};

export const getMockCoachResponse = (message: string, context?: any): string => {
  const lower = message.toLowerCase();

  if (lower.includes('hair') || lower.includes('cut') || lower.includes('style')) {
    const shape = context?.faceProfile?.faceShape || 'your';
    return `Based on your **${shape}** face shape:\n\n• **Top Recommendation:** Go for a textured haircut with moderate height on top and clean tapered sides (like a textured crop or relaxed quiff).\n• **Why it works:** It visually elongates your facial third without making your sides look bulky.\n• **Barber tip:** Ask for scissors-cut texture on top, leaving about 2-3 inches, with a low-taper on the temples.\n• **Product:** Use a small dime-sized amount of matte styling clay on damp hair.`;
  }

  if (lower.includes('skin') || lower.includes('routine') || lower.includes('morning')) {
    return `Here is a bulletproof 3-step foundational routine:\n\n1. **Cleanse:** Gentle hydrating cleanser in the AM and PM.\n2. **Hydrate:** Light gel moisturizer or hyaluronic acid serum on damp skin.\n3. **Protect:** Broad-spectrum SPF 50 sunscreen every morning without fail.\n\n*Consistency for 3 weeks will deliver noticeable improvements in natural radiance and smooth texture.*`;
  }

  if (lower.includes('glasses') || lower.includes('frame') || lower.includes('spectacles')) {
    const frames = context?.glasses?.recommendedFrames?.join(', ') || 'Square Acetate or Slim Geometric Titanium';
    return `For optical frames, your facial proportions harmonize best with:\n\n• **Recommended:** ${frames}\n• **Key Rule:** Avoid frames that are wider than your cheekbones.\n• **Bridge:** A medium keyhole bridge gives a refined, balanced focal point to the midface.`;
  }

  if (lower.includes('improve first') || lower.includes('focus') || lower.includes('start')) {
    return `Start with the **Big 3 Quick Wins** this week:\n\n1. **Grooming Lineup:** Clean up neck hair 1cm above the Adam's apple and trim any stray eyebrow hairs.\n2. **Haircut Refresh:** Get your sides tapered clean to immediately sharpen your jawline presentation.\n3. **Hydration & Sleep:** 2.5L water daily and 7-8 hours rest will do wonders for under-eye freshness.`;
  }

  if (lower.includes('light') || lower.includes('photo') || lower.includes('camera')) {
    return `To elevate your photo quality immediately:\n\n• **Light:** Face directly toward a window with soft daylight (never put the light behind you).\n• **Height:** Hold your phone camera directly at eye level.\n• **Distance:** Keep the phone at least 60-70cm away to avoid wide-angle lens distortion on your nose and forehead.\n• **Pose:** Turn your head 5 degrees to one side to highlight jawline shadow definition.`;
  }

  return `That's a great question! For continuous improvement, remember that consistency beats intensity. Focus on daily grooming habits, sticking to your morning skincare steps, and keeping your haircut fresh every 3 weeks. Would you like specific advice on your hair, beard, skincare, or personal style?`;
};
