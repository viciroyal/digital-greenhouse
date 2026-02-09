/**
 * ZONE STATUS MATRIX
 * 
 * Maps Harmonic Zones (frequencies) to corresponding physical farm areas (Seven Pillars).
 * Bridges the energetic protocol with operational infrastructure.
 */

import { HarmonicZone, HARMONIC_ZONES, getZoneByFrequency } from './harmonicZoneProtocol';

export interface PillarArea {
  pillarNumber: number;
  pillarName: string;
  siteName: string;
  resonantFunction: string;
  dataPoint: string;
}

export interface ZoneAreaMapping {
  zone: HarmonicZone;
  pillar: PillarArea;
  statusIndicators: string[];
  actionTriggers: string[];
}

/**
 * Seven Pillars Infrastructure
 * Physical farm locations mapped to resonant functions
 */
export const SEVEN_PILLARS: PillarArea[] = [
  {
    pillarNumber: 1,
    pillarName: 'The Vortex',
    siteName: 'Compost Station',
    resonantFunction: 'Waste-to-Soil Transformation',
    dataPoint: 'Master Mix Inventory',
  },
  {
    pillarNumber: 2,
    pillarName: 'Sirius Master',
    siteName: 'Entrance/Security',
    resonantFunction: 'Access & Protection Gateway',
    dataPoint: 'Access Logs',
  },
  {
    pillarNumber: 3,
    pillarName: 'Solar Alchemist',
    siteName: 'Irrigation/Solar Array',
    resonantFunction: 'Energy & Water Distribution',
    dataPoint: 'Flow Rate & Energy Output',
  },
  {
    pillarNumber: 4,
    pillarName: 'Toltec Heart',
    siteName: 'Pavilion/Stage',
    resonantFunction: 'Frequency Playback & Gathering',
    dataPoint: 'Frequency Playback Status',
  },
  {
    pillarNumber: 5,
    pillarName: 'Dogon Signal',
    siteName: 'Wash/Pack Station',
    resonantFunction: 'Post-Harvest Processing',
    dataPoint: 'Post-Harvest Temp/Brix',
  },
  {
    pillarNumber: 6,
    pillarName: 'Aboriginal Vision',
    siteName: 'Tool Shed',
    resonantFunction: 'Technology & Observation',
    dataPoint: 'NIR Tech Inventory',
  },
  {
    pillarNumber: 7,
    pillarName: 'Hermetic Source',
    siteName: 'Perimeter Shield',
    resonantFunction: 'Boundary Protection',
    dataPoint: 'Perimeter Health Status',
  },
];

/**
 * ZONE ↔ PILLAR MATRIX
 * Maps each frequency zone to its corresponding physical pillar
 */
export const ZONE_STATUS_MATRIX: ZoneAreaMapping[] = [
  {
    zone: HARMONIC_ZONES[0], // Zone 1: 396Hz - Foundation
    pillar: SEVEN_PILLARS[0], // Pillar 1: The Vortex
    statusIndicators: ['Compost Temperature', 'Carbon:Nitrogen Ratio', 'Mix Inventory Level'],
    actionTriggers: ['Low inventory → Replenish Master Mix', 'Temperature spike → Turn pile'],
  },
  {
    zone: HARMONIC_ZONES[1], // Zone 2: 417Hz - Flow
    pillar: SEVEN_PILLARS[2], // Pillar 3: Solar Alchemist
    statusIndicators: ['Water Flow Rate', 'Solar Array Output', 'Moisture Levels'],
    actionTriggers: ['Low flow → Check irrigation lines', 'Peak sun → Optimize watering schedule'],
  },
  {
    zone: HARMONIC_ZONES[2], // Zone 3: 528Hz - Alchemy
    pillar: SEVEN_PILLARS[3], // Pillar 4: Toltec Heart
    statusIndicators: ['Frequency Active', 'Growth Stage', 'Nitrogen Status'],
    actionTriggers: ['Seedling stage → Play 528Hz', 'Chlorosis → Apply nitrogen boost'],
  },
  {
    zone: HARMONIC_ZONES[3], // Zone 4: 639Hz - Heart
    pillar: SEVEN_PILLARS[3], // Pillar 4: Toltec Heart (shared - gathering/sync)
    statusIndicators: ['Mycorrhizal Network Status', 'Guild Connectivity', 'Calcium Levels'],
    actionTriggers: ['Network weak → Inoculate beds', 'Guild imbalance → Add companion crops'],
  },
  {
    zone: HARMONIC_ZONES[4], // Zone 5: 741Hz - Signal
    pillar: SEVEN_PILLARS[4], // Pillar 5: Dogon Signal
    statusIndicators: ['Brix Reading (12-24)', 'NIR Analysis', 'Harvest Readiness'],
    actionTriggers: ['Brix < 12 → Delay harvest', 'Brix ≥ 15 → Priority harvest'],
  },
  {
    zone: HARMONIC_ZONES[5], // Zone 6: 852Hz - Vision
    pillar: SEVEN_PILLARS[5], // Pillar 6: Aboriginal Vision
    statusIndicators: ['Alkaloid Density', 'Medicinal Compound Levels', 'NIR Spectrum'],
    actionTriggers: ['Low alkaloids → Adjust light exposure', 'Peak density → Document strain'],
  },
  {
    zone: HARMONIC_ZONES[6], // Zone 7: 963Hz - Source
    pillar: SEVEN_PILLARS[6], // Pillar 7: Hermetic Source
    statusIndicators: ['Perimeter Integrity', 'Garlic Shield Status', 'Pest Pressure'],
    actionTriggers: ['Breach detected → Deploy allium barrier', 'High pressure → Activate full shield'],
  },
];

// ============= Utility Functions =============

/**
 * Get the pillar area for a specific frequency zone
 */
export const getPillarForFrequency = (frequencyHz: number): PillarArea | undefined => {
  const mapping = ZONE_STATUS_MATRIX.find(m => m.zone.frequencyHz === frequencyHz);
  return mapping?.pillar;
};

/**
 * Get the zone mapping for a pillar number
 */
export const getZoneForPillar = (pillarNumber: number): ZoneAreaMapping | undefined => {
  return ZONE_STATUS_MATRIX.find(m => m.pillar.pillarNumber === pillarNumber);
};

/**
 * Get status indicators for a frequency zone
 */
export const getStatusIndicators = (frequencyHz: number): string[] => {
  const mapping = ZONE_STATUS_MATRIX.find(m => m.zone.frequencyHz === frequencyHz);
  return mapping?.statusIndicators || [];
};

/**
 * Get action triggers for a frequency zone
 */
export const getActionTriggers = (frequencyHz: number): string[] => {
  const mapping = ZONE_STATUS_MATRIX.find(m => m.zone.frequencyHz === frequencyHz);
  return mapping?.actionTriggers || [];
};

/**
 * Full matrix lookup by frequency
 */
export const getZoneAreaMapping = (frequencyHz: number): ZoneAreaMapping | undefined => {
  return ZONE_STATUS_MATRIX.find(m => m.zone.frequencyHz === frequencyHz);
};

/**
 * Get pillar by name
 */
export const getPillarByName = (name: string): PillarArea | undefined => {
  return SEVEN_PILLARS.find(p => 
    p.pillarName.toLowerCase() === name.toLowerCase() ||
    p.siteName.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Zone-to-Pillar quick reference map
 */
export const ZONE_PILLAR_MAP: Record<number, number> = {
  396: 1,  // Foundation → The Vortex
  417: 3,  // Flow → Solar Alchemist
  528: 4,  // Alchemy → Toltec Heart
  639: 4,  // Heart → Toltec Heart (shared)
  741: 5,  // Signal → Dogon Signal
  852: 6,  // Vision → Aboriginal Vision
  963: 7,  // Source → Hermetic Source
};
