/**
 * Soil Calculator Constants & Types
 */

// ─── ENVIRONMENT TYPES ───────────────────────────────────────────────
export type EnvironmentType = 'pot' | 'raised_bed' | 'farm' | 'high_tunnel';

export interface EnvironmentOption {
  id: EnvironmentType;
  label: string;
  description: string;
  icon: string;
  useMasterMix: boolean;
}

export const ENVIRONMENTS: EnvironmentOption[] = [
  { id: 'pot', label: 'Pot / Container', description: 'OMRI organic potting mix', icon: '🪴', useMasterMix: false },
  { id: 'raised_bed', label: 'Raised Bed', description: 'Master Mix protocol', icon: '🌱', useMasterMix: true },
  { id: 'farm', label: 'Farm Row', description: 'Master Mix protocol', icon: '🌾', useMasterMix: true },
  { id: 'high_tunnel', label: 'High Tunnel', description: 'Master Mix protocol', icon: '🏠', useMasterMix: true },
];

// ─── CONTAINER SIZES (for pots) ──────────────────────────────────────
export interface ContainerSize {
  id: string;
  label: string;
  gallons: number;
  cubicFeet: number; // approximate soil volume
  bestFor: string;
}

export const CONTAINER_SIZES: ContainerSize[] = [
  { id: '1gal', label: '1 Gallon', gallons: 1, cubicFeet: 0.13, bestFor: 'Herbs, small greens' },
  { id: '3gal', label: '3 Gallon', gallons: 3, cubicFeet: 0.4, bestFor: 'Peppers, compact herbs' },
  { id: '5gal', label: '5 Gallon', gallons: 5, cubicFeet: 0.67, bestFor: 'Tomatoes, peppers, eggplant' },
  { id: '7gal', label: '7 Gallon', gallons: 7, cubicFeet: 0.93, bestFor: 'Large tomatoes, squash' },
  { id: '10gal', label: '10 Gallon', gallons: 10, cubicFeet: 1.34, bestFor: 'Root vegetables, multi-plant' },
  { id: '15gal', label: '15 Gallon', gallons: 15, cubicFeet: 2.0, bestFor: 'Fruit trees, large crops' },
  { id: '20gal', label: '20 Gallon', gallons: 20, cubicFeet: 2.67, bestFor: 'Dwarf trees, large bushes' },
  { id: '25gal', label: '25 Gallon', gallons: 25, cubicFeet: 3.34, bestFor: 'Full-size fruit trees' },
  { id: 'custom', label: 'Custom Size', gallons: 0, cubicFeet: 0, bestFor: 'Enter your own dimensions' },
];

// ─── POT MIX RECIPE (OMRI Organic) ──────────────────────────────────
export interface PotMixComponent {
  id: string;
  name: string;
  role: string;
  percentage: number;
  color: string;
  note: string;
}

export const POT_MIX_RECIPE: PotMixComponent[] = [
  { id: 'potting_base', name: 'OMRI Organic Potting Mix', role: 'BASE', percentage: 50, color: 'hsl(35 50% 40%)', note: 'Certified organic peat/coir base' },
  { id: 'compost', name: 'Aged Compost', role: 'FERTILITY', percentage: 20, color: 'hsl(25 60% 35%)', note: 'Well-finished, screened ¼ inch' },
  { id: 'worm_castings', name: 'Worm Castings', role: 'BIOLOGY', percentage: 15, color: 'hsl(35 40% 30%)', note: 'Living microbial inoculant' },
  { id: 'perlite', name: 'Perlite', role: 'DRAINAGE', percentage: 10, color: 'hsl(0 0% 80%)', note: 'Prevents compaction & root rot' },
  { id: 'amendments', name: 'Dry Amendments', role: 'MINERALS', percentage: 5, color: 'hsl(45 60% 50%)', note: 'Kelp meal, rock dust, neem cake' },
];

// ─── MASTER MIX (for beds/farm/tunnel) ───────────────────────────────
export type MixRole = 'VISION' | 'ALCHEMY' | 'ANCHOR' | 'STRUCTURE' | 'BRIDGE' | 'SHELTER' | 'MINERAL' | 'BIOLOGY' | 'SHIELD';

export interface MasterMixComponent {
  id: string;
  name: string;
  role: MixRole;
  baseQuarts: number;
  roleColor: string;
  frequencyBoost?: number[];
  tier: 'core' | 'mineral' | 'biology';
  nutrientKey: string; // primary nutrient symbol
  organic: string; // organic certification note
}

export const MASTER_MIX_PROTOCOL: MasterMixComponent[] = [
  // ── TIER 1: CORE (original 8) ──
  { id: 'promix', name: 'Pro-Mix (Peat Base)', role: 'VISION', baseQuarts: 5, roleColor: 'hsl(270 50% 55%)', tier: 'core', nutrientKey: 'Structure', organic: 'OMRI Listed' },
  { id: 'cococoir', name: 'Coco Coir', role: 'VISION', baseQuarts: 3, roleColor: 'hsl(30 55% 45%)', tier: 'core', nutrientKey: 'Structure + Aeration', organic: 'OMRI Organic' },
  { id: 'alfalfa', name: 'Alfalfa Meal', role: 'ALCHEMY', baseQuarts: 2, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528], tier: 'core', nutrientKey: 'N', organic: 'OMRI Organic' },
  { id: 'soybean', name: 'Soybean Meal', role: 'ALCHEMY', baseQuarts: 1, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528], tier: 'core', nutrientKey: 'N', organic: 'Non-GMO Organic' },
  { id: 'kelp', name: 'Kelp Meal', role: 'ANCHOR', baseQuarts: 1, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396], tier: 'core', nutrientKey: 'K', organic: 'OMRI Listed' },
  { id: 'seamineral', name: 'Sea Minerals', role: 'ANCHOR', baseQuarts: 0.5, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396], tier: 'core', nutrientKey: 'Traces', organic: 'Ocean-Harvested' },
  { id: 'harmony', name: 'Harmony Calcium', role: 'STRUCTURE', baseQuarts: 1, roleColor: 'hsl(0 0% 70%)', frequencyBoost: [639], tier: 'core', nutrientKey: 'Ca', organic: 'Mined Natural' },
  { id: 'wormcast', name: 'Worm Castings', role: 'BRIDGE', baseQuarts: 1, roleColor: 'hsl(35 60% 50%)', tier: 'core', nutrientKey: 'Biology', organic: 'OMRI Listed' },
  { id: 'humates', name: 'Humates', role: 'SHELTER', baseQuarts: 1, roleColor: 'hsl(25 40% 40%)', frequencyBoost: [417], tier: 'core', nutrientKey: 'C', organic: 'Leonardite-Derived' },

  // ── TIER 2: MINERAL SPECTRUM (fills zone boost gaps) ──
  { id: 'fishbone', name: 'Fish Bone Meal', role: 'MINERAL', baseQuarts: 1, roleColor: 'hsl(0 55% 50%)', frequencyBoost: [396], tier: 'mineral', nutrientKey: 'P', organic: 'OMRI Organic' },
  { id: 'langbeinite', name: 'Langbeinite (Sul-Po-Mag)', role: 'MINERAL', baseQuarts: 0.5, roleColor: 'hsl(210 60% 55%)', frequencyBoost: [741], tier: 'mineral', nutrientKey: 'K-Mg-S', organic: 'Mined Natural (OMRI)' },
  { id: 'diatomaceous', name: 'Diatomaceous Earth (Food Grade)', role: 'MINERAL', baseQuarts: 0.5, roleColor: 'hsl(270 45% 55%)', frequencyBoost: [852], tier: 'mineral', nutrientKey: 'Si', organic: 'OMRI Listed' },
  { id: 'gypsum', name: 'Gypsum (Calcium Sulfate)', role: 'MINERAL', baseQuarts: 0.5, roleColor: 'hsl(300 45% 50%)', frequencyBoost: [963], tier: 'mineral', nutrientKey: 'S-Ca', organic: 'Mined Natural (OMRI)' },
  { id: 'epsom', name: 'Epsom Salt (Magnesium Sulfate)', role: 'MINERAL', baseQuarts: 0.25, roleColor: 'hsl(120 45% 50%)', frequencyBoost: [639], tier: 'mineral', nutrientKey: 'Mg', organic: 'USP Grade Natural' },

  // ── TIER 3: BIOLOGY & MICRONUTRIENTS ──
  { id: 'mycorrhizae', name: 'Mycorrhizal Inoculant (Endo/Ecto)', role: 'BIOLOGY', baseQuarts: 0.125, roleColor: 'hsl(35 50% 55%)', tier: 'biology', nutrientKey: 'Fungi', organic: 'OMRI Listed' },
  { id: 'azomite', name: 'Azomite (Volcanic Rock Dust)', role: 'MINERAL', baseQuarts: 0.5, roleColor: 'hsl(15 50% 50%)', tier: 'biology', nutrientKey: 'Fe-Zn-Cu-Mn-B-Mo', organic: 'OMRI Listed' },
  { id: 'neem', name: 'Neem Cake', role: 'SHIELD', baseQuarts: 0.5, roleColor: 'hsl(90 50% 45%)', frequencyBoost: [963], tier: 'biology', nutrientKey: 'N + Pest Defense', organic: 'Organic Cold-Pressed' },
];

// Base reference: 60ft × 2.5ft = 150 sq ft
export const BASE_AREA_SQ_FT = 150;

// ─── FREQUENCY / ZONE PROTOCOLS ──────────────────────────────────────
export interface FrequencyZone {
  name: string;
  color: string;
  focus: string;
  mineral: string;
  soilNote: string;
  targetPH: { min: number; max: number };
  nirTargets: { mineral: string; ppm_min: number; ppm_max: number }[];
}

export const FREQUENCY_PROTOCOLS: Record<number, FrequencyZone> = {
  396: {
    name: 'ROOT', color: 'hsl(0 60% 50%)',
    focus: '2× Kelp, Sea Minerals & Fish Bone Meal',
    mineral: 'Phosphorus (P) + Potassium (K)',
    soilNote: 'Heavy root anchoring — Fish Bone Meal provides slow-release P; Kelp adds K and cytokinins for mycorrhizal bridging',
    targetPH: { min: 6.0, max: 6.8 },
    nirTargets: [
      { mineral: 'P (Phosphorus)', ppm_min: 40, ppm_max: 80 },
      { mineral: 'K (Potassium)', ppm_min: 150, ppm_max: 300 },
    ],
  },
  417: {
    name: 'VINE', color: 'hsl(30 70% 50%)',
    focus: '2× Humates for moisture retention',
    mineral: 'Carbon (C) + Humic/Fulvic Acids',
    soilNote: 'High humate content retains moisture & chelates nutrients for vine crop uptake',
    targetPH: { min: 6.0, max: 7.0 },
    nirTargets: [
      { mineral: 'Organic Matter %', ppm_min: 5, ppm_max: 12 },
      { mineral: 'CEC (meq/100g)', ppm_min: 12, ppm_max: 25 },
    ],
  },
  528: {
    name: 'SOLAR', color: 'hsl(51 80% 50%)',
    focus: '2× Alfalfa & Soybean for N',
    mineral: 'Nitrogen (N) + Triacontanol',
    soilNote: 'Nitrogen-heavy for photosynthetic alchemy crops. Alfalfa also provides natural growth hormone triacontanol',
    targetPH: { min: 6.2, max: 7.0 },
    nirTargets: [
      { mineral: 'N (Nitrogen)', ppm_min: 40, ppm_max: 80 },
      { mineral: 'NO₃ (Nitrate)', ppm_min: 25, ppm_max: 50 },
    ],
  },
  639: {
    name: 'HEART', color: 'hsl(120 50% 45%)',
    focus: '2× Harmony Calcium & Epsom Salt',
    mineral: 'Calcium (Ca) + Magnesium (Mg)',
    soilNote: 'Calcium builds cell walls for brassica density. Epsom Salt (MgSO₄) provides Mg for chlorophyll core — critical Ca:Mg ratio target is 7:1',
    targetPH: { min: 6.5, max: 7.2 },
    nirTargets: [
      { mineral: 'Ca (Calcium)', ppm_min: 1500, ppm_max: 3000 },
      { mineral: 'Mg (Magnesium)', ppm_min: 200, ppm_max: 400 },
    ],
  },
  741: {
    name: 'THROAT', color: 'hsl(210 60% 50%)',
    focus: '2× Langbeinite (K-Mg-S)',
    mineral: 'Potassium (K) + Magnesium (Mg) + Sulfur (S)',
    soilNote: 'Langbeinite (Sul-Po-Mag) delivers triple-mineral punch: K drives Brix sugar transport, Mg powers chlorophyll, S for protein synthesis',
    targetPH: { min: 6.0, max: 6.8 },
    nirTargets: [
      { mineral: 'K (Potassium)', ppm_min: 200, ppm_max: 400 },
      { mineral: 'Brix (°Bx)', ppm_min: 12, ppm_max: 18 },
    ],
  },
  852: {
    name: 'VISION', color: 'hsl(270 50% 50%)',
    focus: '2× Diatomaceous Earth (Si)',
    mineral: 'Silica (Si) + Trace Minerals',
    soilNote: 'Food-grade DE provides bioavailable amorphous silica — strengthens cell walls, increases UV resilience, and improves stalk rigidity per NIR Spectroscopy',
    targetPH: { min: 6.0, max: 6.8 },
    nirTargets: [
      { mineral: 'Si (Silica)', ppm_min: 50, ppm_max: 150 },
      { mineral: 'Fe (Iron)', ppm_min: 50, ppm_max: 200 },
    ],
  },
  963: {
    name: 'SOURCE', color: 'hsl(300 50% 50%)',
    focus: '2× Gypsum & Neem Cake',
    mineral: 'Sulfur (S) + Calcium (Ca) + Azadirachtin',
    soilNote: 'Gypsum (CaSO₄) supplies S without altering pH. Neem Cake adds slow-release N plus azadirachtin for nematode and pest suppression — both OMRI organic',
    targetPH: { min: 6.0, max: 7.0 },
    nirTargets: [
      { mineral: 'S (Sulfur)', ppm_min: 15, ppm_max: 40 },
      { mineral: 'Ca (Calcium)', ppm_min: 1200, ppm_max: 2500 },
    ],
  },
};

// ─── HARMONIZATION RULES ─────────────────────────────────────────────
export interface HarmonizationRule {
  id: string;
  name: string;
  requiredHz: number;
  dependsOnHz: number;
  message: string;
  severity: 'warning' | 'info';
}

export const HARMONIZATION_RULES: HarmonizationRule[] = [
  { id: 'root_foundation', name: 'No Fruit Without Root', requiredHz: 528, dependsOnHz: 396, message: '528Hz (Solar) crops need 396Hz (Root) beds for phosphorus support via Fish Bone Meal', severity: 'warning' },
  { id: 'hydration_flow', name: 'Hydration Fuels Expression', requiredHz: 741, dependsOnHz: 417, message: '741Hz (Throat) needs 417Hz (Vine) water cycling — Humates retain moisture for K transport', severity: 'warning' },
  { id: 'bridge_foundation', name: 'Bridge Requires Foundation', requiredHz: 639, dependsOnHz: 396, message: '639Hz (Heart) Ca needs 396Hz (Root) P for uptake — maintain Ca:Mg ratio at 7:1', severity: 'info' },
  { id: 'vision_alchemy', name: 'Vision Requires Alchemy', requiredHz: 852, dependsOnHz: 528, message: '852Hz (Vision) Si from DE needs 528Hz (Solar) N for metabolizing silica into cell walls', severity: 'info' },
  { id: 'shield_active', name: 'Violet Shield Active', requiredHz: 963, dependsOnHz: 639, message: '963Hz (Source) S from Gypsum needs 639Hz (Heart) Ca for cell wall integrity', severity: 'info' },
  { id: 'expression_vision', name: 'Expression Feeds Vision', requiredHz: 852, dependsOnHz: 741, message: '852Hz (Vision) silica benefits from 741Hz Langbeinite Mg — Mg activates Si uptake enzymes', severity: 'info' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────
export const formatQuantity = (quarts: number): string => {
  if (quarts < 0.125) {
    const tbsp = Math.round(quarts * 4 * 16 * 10) / 10;
    return `${tbsp} tbsp`;
  }
  if (quarts < 0.25) {
    const tbsp = Math.round(quarts * 4 * 16 * 10) / 10;
    return `${tbsp} tbsp`;
  }
  if (quarts < 1) {
    const cups = Math.round(quarts * 4 * 10) / 10;
    return `${cups} ${cups === 1 ? 'cup' : 'cups'}`;
  }
  const rounded = Math.round(quarts * 10) / 10;
  return `${rounded} ${rounded === 1 ? 'quart' : 'quarts'}`;
};

export const formatVolume = (cubicFeet: number, percentage: number): string => {
  const portionCuFt = cubicFeet * (percentage / 100);
  if (portionCuFt < 0.1) {
    const cups = Math.round(portionCuFt * 7.48 * 16 * 10) / 10; // cu ft → gallons → cups
    return `~${cups} cups`;
  }
  const gallons = Math.round(portionCuFt * 7.48 * 10) / 10;
  if (gallons < 1) {
    const cups = Math.round(gallons * 16 * 10) / 10;
    return `~${cups} cups`;
  }
  return `~${gallons} gal`;
};
