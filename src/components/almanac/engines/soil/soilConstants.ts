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
export type MixRole = 'VISION' | 'ALCHEMY' | 'ANCHOR' | 'STRUCTURE' | 'BRIDGE' | 'SHELTER';

export interface MasterMixComponent {
  id: string;
  name: string;
  role: MixRole;
  baseQuarts: number;
  roleColor: string;
  frequencyBoost?: number[];
}

export const MASTER_MIX_PROTOCOL: MasterMixComponent[] = [
  { id: 'promix', name: 'Pro-Mix (Peat Base)', role: 'VISION', baseQuarts: 5, roleColor: 'hsl(270 50% 55%)' },
  { id: 'alfalfa', name: 'Alfalfa Meal', role: 'ALCHEMY', baseQuarts: 2, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528] },
  { id: 'soybean', name: 'Soybean Meal', role: 'ALCHEMY', baseQuarts: 1, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528] },
  { id: 'kelp', name: 'Kelp Meal', role: 'ANCHOR', baseQuarts: 1, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396] },
  { id: 'seamineral', name: 'Sea Minerals', role: 'ANCHOR', baseQuarts: 0.5, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396] },
  { id: 'harmony', name: 'Harmony Calcium', role: 'STRUCTURE', baseQuarts: 1, roleColor: 'hsl(0 0% 70%)', frequencyBoost: [639] },
  { id: 'wormcast', name: 'Worm Castings', role: 'BRIDGE', baseQuarts: 1, roleColor: 'hsl(35 60% 50%)' },
  { id: 'humates', name: 'Humates', role: 'SHELTER', baseQuarts: 1, roleColor: 'hsl(25 40% 40%)', frequencyBoost: [417] },
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
}

export const FREQUENCY_PROTOCOLS: Record<number, FrequencyZone> = {
  396: { name: 'ROOT', color: 'hsl(0 60% 50%)', focus: '2× Kelp & Sea Minerals', mineral: 'Phosphorus (P)', soilNote: 'Heavy root anchoring — double kelp for mycorrhizal bridging' },
  417: { name: 'VINE', color: 'hsl(30 70% 50%)', focus: '2× Humates for moisture', mineral: 'Hydrogen/Carbon', soilNote: 'High humate content retains moisture for vine crops' },
  528: { name: 'SOLAR', color: 'hsl(51 80% 50%)', focus: '2× Alfalfa & Soybean for N', mineral: 'Nitrogen (N)', soilNote: 'Nitrogen-heavy for photosynthetic alchemy crops' },
  639: { name: 'HEART', color: 'hsl(120 50% 45%)', focus: '2× Harmony Calcium', mineral: 'Calcium (Ca)', soilNote: 'Calcium builds cell walls — critical for brassica density' },
  741: { name: 'THROAT', color: 'hsl(210 60% 50%)', focus: 'Standard Mix', mineral: 'Potassium (K)', soilNote: 'Potassium drives sugar transport for expression crops' },
  852: { name: 'VISION', color: 'hsl(270 50% 50%)', focus: 'Standard Mix', mineral: 'Silica (Si)', soilNote: 'Silica strengthens stalks and UV resilience' },
  963: { name: 'SOURCE', color: 'hsl(300 50% 50%)', focus: 'Standard Mix', mineral: 'Sulfur (S)', soilNote: 'Sulfur compounds for pest deterrence and preservation' },
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
  { id: 'root_foundation', name: 'No Fruit Without Root', requiredHz: 528, dependsOnHz: 396, message: '528Hz (Solar) crops need 396Hz (Root) beds for phosphorus support', severity: 'warning' },
  { id: 'hydration_flow', name: 'Hydration Fuels Expression', requiredHz: 741, dependsOnHz: 417, message: '741Hz (Throat) needs 417Hz (Vine) water cycling for potassium transport', severity: 'warning' },
  { id: 'bridge_foundation', name: 'Bridge Requires Foundation', requiredHz: 639, dependsOnHz: 396, message: '639Hz (Heart) calcium needs 396Hz (Root) phosphorus for uptake', severity: 'info' },
  { id: 'vision_alchemy', name: 'Vision Requires Alchemy', requiredHz: 852, dependsOnHz: 528, message: '852Hz (Vision) silica needs 528Hz (Solar) nitrogen for metabolism', severity: 'info' },
  { id: 'shield_active', name: 'Violet Shield Active', requiredHz: 963, dependsOnHz: 639, message: '963Hz (Source) sulfur needs 639Hz (Heart) calcium for cell integrity', severity: 'info' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────
export const formatQuantity = (quarts: number): string => {
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
