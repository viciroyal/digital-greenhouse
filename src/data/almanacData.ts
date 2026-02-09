/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ALMANAC DATABASE (SCIENCE & ACTION)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STRICT PROTOCOL: This database contains ONLY actionable, measurable data.
 * 
 * ALLOWED FIELDS:
 * - Input_Value (e.g., Brix Score, Bed Length)
 * - Logic_State (e.g., Red Light if <12, Green Light if >12)
 * - Output_Task (e.g., "Add 5 qts Master Mix")
 * - Deadline (e.g., "Oct 15")
 * 
 * FORBIDDEN: No quotes, stories, or "fluff" here.
 * UI BEHAVIOR: High Contrast, Buttons, Toggles. Red/Green indicators only.
 * 
 * THE LINK: Each action item has a `wisdomKey` that links to the Ancestral Path.
 * This key is ONLY used when user clicks the ℹ️ "Learn More" icon.
 */

// ============================================================================
// BRIX VALIDATION LOGIC
// ============================================================================

export interface BrixThreshold {
  id: string;
  cropCategory: string;
  minBrix: number;
  targetBrix: number;
  maxBrix: number;
  wisdomKey: string; // Links to Ancestral Path for "Learn More"
}

export const brixThresholds: BrixThreshold[] = [
  { id: 'root', cropCategory: 'Root Vegetables', minBrix: 12, targetBrix: 18, maxBrix: 24, wisdomKey: 'ingham-soil-food-web' },
  { id: 'squash', cropCategory: 'Squash & Melons', minBrix: 10, targetBrix: 14, maxBrix: 20, wisdomKey: 'steiner-organism' },
  { id: 'leafy', cropCategory: 'Leafy Greens', minBrix: 8, targetBrix: 12, maxBrix: 18, wisdomKey: 'three-sisters' },
  { id: 'fruit', cropCategory: 'Fruit Crops', minBrix: 14, targetBrix: 20, maxBrix: 28, wisdomKey: 'hermetic-vibration' },
  { id: 'herb', cropCategory: 'Herbs & Medicine', minBrix: 10, targetBrix: 16, maxBrix: 22, wisdomKey: 'carver-regeneration' },
];

export type LogicState = 'RED' | 'YELLOW' | 'GREEN';

export const getBrixState = (brixValue: number, threshold: BrixThreshold): LogicState => {
  if (brixValue < threshold.minBrix) return 'RED';
  if (brixValue >= threshold.targetBrix) return 'GREEN';
  return 'YELLOW';
};

// ============================================================================
// BED RESET CALCULATIONS (Pure Action Logic)
// ============================================================================

export interface BedDimensions {
  length: number; // feet
  width: number;  // feet
}

export interface AmendmentQuantity {
  id: string;
  name: string;
  baseQtyPerSqFt: number; // quarts per 150 sq ft baseline
  unit: 'quarts' | 'cups' | 'lbs' | 'oz';
  wisdomKey: string; // Links to Ancestral Path
}

export const masterMixIngredients: AmendmentQuantity[] = [
  { id: 'promix', name: 'Pro-Mix (Peat Base)', baseQtyPerSqFt: 5, unit: 'quarts', wisdomKey: 'ingham-soil-food-web' },
  { id: 'alfalfa', name: 'Alfalfa Meal', baseQtyPerSqFt: 2, unit: 'quarts', wisdomKey: 'nitrogen-fixer-priority' },
  { id: 'soybean', name: 'Soybean Meal', baseQtyPerSqFt: 2, unit: 'quarts', wisdomKey: 'biological-priority' },
  { id: 'kelp', name: 'Kelp Meal', baseQtyPerSqFt: 1, unit: 'quarts', wisdomKey: 'steiner-organism' },
  { id: 'seamineral', name: 'Sea Minerals', baseQtyPerSqFt: 0.5, unit: 'cups', wisdomKey: 'kemetic-flood' },
  { id: 'harmony', name: 'Harmony (Calcium)', baseQtyPerSqFt: 1, unit: 'quarts', wisdomKey: 'mineral-balance' },
  { id: 'wormcast', name: 'Worm Castings', baseQtyPerSqFt: 3, unit: 'quarts', wisdomKey: 'ingham-soil-food-web' },
  { id: 'humates', name: 'Humates', baseQtyPerSqFt: 0.5, unit: 'cups', wisdomKey: 'carver-regeneration' },
];

/**
 * Calculate scaled quantities based on bed dimensions
 * Baseline: 150 sq ft (60ft x 2.5ft)
 */
export const calculateQuantities = (
  dimensions: BedDimensions
): { ingredient: AmendmentQuantity; quantity: number; displayUnit: string }[] => {
  const baselineSqFt = 150;
  const actualSqFt = dimensions.length * dimensions.width;
  const scaleFactor = actualSqFt / baselineSqFt;

  return masterMixIngredients.map((ingredient) => {
    const rawQty = ingredient.baseQtyPerSqFt * scaleFactor;
    
    // Convert to cups if less than 1 quart (1 quart = 4 cups)
    if (ingredient.unit === 'quarts' && rawQty < 1) {
      return {
        ingredient,
        quantity: Math.round(rawQty * 4 * 10) / 10, // Convert to cups
        displayUnit: 'cups',
      };
    }
    
    return {
      ingredient,
      quantity: Math.round(rawQty * 10) / 10,
      displayUnit: ingredient.unit,
    };
  });
};

// ============================================================================
// TASK OUTPUT SYSTEM
// ============================================================================

export interface ActionTask {
  id: string;
  category: 'reset' | 'check' | 'plant' | 'harvest' | 'spray';
  action: string; // Short imperative: "Add 5 qts Master Mix"
  deadline?: string; // "Oct 15" or "Before First Frost"
  priority: 'high' | 'medium' | 'low';
  frequencyZone: number; // 396, 417, 528, etc.
  wisdomKey: string; // Links to Ancestral Path
}

export const generateBrixTask = (
  brixValue: number,
  threshold: BrixThreshold
): ActionTask | null => {
  const state = getBrixState(brixValue, threshold);
  
  if (state === 'RED') {
    return {
      id: `brix-alert-${threshold.id}`,
      category: 'spray',
      action: 'Apply foliar spray (Compost Tea + Kelp)',
      deadline: 'Within 3 days',
      priority: 'high',
      frequencyZone: 396,
      wisdomKey: threshold.wisdomKey,
    };
  }
  
  if (state === 'YELLOW') {
    return {
      id: `brix-boost-${threshold.id}`,
      category: 'spray',
      action: 'Top-dress with Worm Castings',
      deadline: 'This week',
      priority: 'medium',
      frequencyZone: 417,
      wisdomKey: threshold.wisdomKey,
    };
  }
  
  return null; // GREEN = no action needed
};

// ============================================================================
// SEASONAL DEADLINES
// ============================================================================

export interface SeasonalTask {
  id: string;
  month: number; // 1-12
  task: string;
  priority: 'high' | 'medium' | 'low';
  wisdomKey: string;
}

export const seasonalCalendar: SeasonalTask[] = [
  { id: 'feb-bed-prep', month: 2, task: 'Prepare beds (Occultation)', priority: 'high', wisdomKey: 'fukuoka-no-till' },
  { id: 'mar-bed-prep', month: 3, task: 'Apply Master Mix to beds', priority: 'high', wisdomKey: 'ingham-soil-food-web' },
  { id: 'apr-plant', month: 4, task: 'Transplant warm-season crops', priority: 'high', wisdomKey: 'three-sisters' },
  { id: 'may-check', month: 5, task: 'First Brix check of season', priority: 'medium', wisdomKey: 'carver-regeneration' },
  { id: 'jun-spray', month: 6, task: 'BD 501 (Silica) at summer solstice', priority: 'medium', wisdomKey: 'steiner-organism' },
  { id: 'aug-harvest', month: 8, task: 'Peak harvest - measure Brix', priority: 'high', wisdomKey: 'hermetic-vibration' },
  { id: 'sep-seed', month: 9, task: 'Save seeds from best plants', priority: 'medium', wisdomKey: 'dogon-seed-lineage' },
  { id: 'oct-cover', month: 10, task: 'Plant cover crops', priority: 'high', wisdomKey: 'cover-crop-law' },
  { id: 'nov-compost', month: 11, task: 'Build compost pile (Farm Stomach)', priority: 'medium', wisdomKey: 'steiner-organism' },
  { id: 'dec-rest', month: 12, task: 'Soil rest period begins', priority: 'low', wisdomKey: 'fukuoka-do-nothing' },
];

export const getCurrentSeasonalTasks = (): SeasonalTask[] => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  return seasonalCalendar.filter(
    (task) => task.month === currentMonth || task.month === currentMonth + 1
  );
};

// ============================================================================
// FORBIDDEN ACTIONS (Fukuoka Protocol - Pure Logic)
// ============================================================================

export interface ForbiddenActionAlert {
  action: string;
  alternatives: string[];
  wisdomKey: string;
}

export const forbiddenActionChecks: ForbiddenActionAlert[] = [
  { action: 'tilling', alternatives: ['Occultation', 'Broadforking'], wisdomKey: 'fukuoka-no-till' },
  { action: 'plowing', alternatives: ['No-till seeding', 'Cover cropping'], wisdomKey: 'fukuoka-do-nothing' },
  { action: 'rototilling', alternatives: ['Broadforking', 'Deep mulching'], wisdomKey: 'fukuoka-no-till' },
  { action: 'weeding', alternatives: ['Chop and drop', 'Living mulch'], wisdomKey: 'least-resistance' },
  { action: 'synthetic fertilizer', alternatives: ['Compost Tea', 'Worm Castings'], wisdomKey: 'biological-priority' },
];

export const checkForForbiddenAction = (inputText: string): ForbiddenActionAlert | null => {
  const lowerText = inputText.toLowerCase();
  return forbiddenActionChecks.find((check) => lowerText.includes(check.action)) || null;
};

// ============================================================================
// ZONE PRIORITY (Permaculture - Pure Logic)
// ============================================================================

export type AlertFrequency = 'daily' | 'weekly' | 'seasonal';

export const getAlertFrequency = (hz: number): AlertFrequency => {
  if (hz <= 417) return 'daily';    // Zone 1-2: Daily attention
  if (hz <= 639) return 'weekly';   // Zone 3-4: Weekly check
  return 'seasonal';                 // Zone 5+: Seasonal/wild
};
