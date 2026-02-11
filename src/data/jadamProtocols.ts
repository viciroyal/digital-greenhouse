/**
 * JADAM (자연농업 / Jayeon Nongbeop) Fertilization Protocols
 * Ultra-low-cost, self-sufficient organic farming system from Korea.
 *
 * Each recipe is mapped to relevant Solfeggio frequency zones
 * based on its primary nutrient contribution and biological function.
 */

export type JadamProtocolId = 'JMS' | 'JLF' | 'JNP' | 'JS' | 'JWA';

export interface JadamIngredient {
  name: string;
  quantity: string;
  note?: string;
}

export interface JadamRecipeVariant {
  name: string;
  /** Which frequency zones this variant best supports */
  frequencyAffinity: number[];
  /** Primary nutrient or function */
  primaryFunction: string;
  ingredients: JadamIngredient[];
  ratio: string;
  fermentationDays: number | [number, number];
  applicationRate: string;
  applicationMethod: 'foliar' | 'drench' | 'both';
  notes?: string;
}

export interface JadamProtocol {
  id: JadamProtocolId;
  name: string;
  fullName: string;
  koreanName: string;
  emoji: string;
  description: string;
  scienceBasis: string;
  color: string;
  variants: JadamRecipeVariant[];
  safetyNotes: string[];
}

export const JADAM_PROTOCOLS: JadamProtocol[] = [
  {
    id: 'JMS',
    name: 'JMS',
    fullName: 'JADAM Microbial Solution',
    koreanName: '자닮미생물',
    emoji: '🦠',
    description: 'Core microbial inoculant — fermented leaf mold that introduces billions of indigenous microorganisms (IMO) to colonize the rhizosphere and suppress pathogens.',
    scienceBasis: 'Competitive exclusion principle: beneficial microbes outcompete pathogenic fungi and bacteria for root-zone resources. Increases mycorrhizal colonization and nutrient cycling.',
    color: 'hsl(120 45% 45%)',
    variants: [
      {
        name: 'Standard JMS',
        frequencyAffinity: [396, 417, 528, 639, 741, 852, 963],
        primaryFunction: 'Microbial diversity / rhizosphere colonization',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '30 gallons', note: 'Rain or well water preferred' },
          { name: 'Leaf mold (forest floor)', quantity: '1 mesh bag (~2 lbs)', note: 'Collect from diverse hardwood forest floor' },
          { name: 'Sea salt', quantity: '1 tbsp', note: 'Unrefined — provides trace minerals' },
          { name: 'Potato (boiled)', quantity: '1 medium', note: 'Carbon source to jumpstart fermentation' },
        ],
        ratio: '30 gal water : 2 lbs leaf mold',
        fermentationDays: [3, 7],
        applicationRate: '1:20 dilution (JMS:water)',
        applicationMethod: 'both',
        notes: 'Bubbles indicate active fermentation. Ready when surface develops a biofilm. Apply within 7 days of maturity.',
      },
    ],
    safetyNotes: [
      'Use within 7 days of reaching maturity',
      'Store in shade — UV kills beneficial microbes',
      'Never mix with chemical fertilizers or fungicides',
    ],
  },
  {
    id: 'JLF',
    name: 'JLF',
    fullName: 'JADAM Liquid Fertilizer',
    koreanName: '자닮액비',
    emoji: '🧪',
    description: 'Nutrient-dense fermented extract from plant and animal materials. Different input materials target specific mineral deficiencies aligned with frequency zone protocols.',
    scienceBasis: 'Anaerobic fermentation breaks down complex proteins and minerals into plant-available ionic forms. Produces organic acids (lactic, acetic) that chelate micronutrients for rapid foliar absorption.',
    color: 'hsl(35 70% 50%)',
    variants: [
      {
        name: 'JLF — Fish (N-P boost)',
        frequencyAffinity: [396, 528],
        primaryFunction: 'Nitrogen + Phosphorus — root anchoring & solar metabolism',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '30 gallons' },
          { name: 'Fish scraps (heads, bones, guts)', quantity: '10 lbs', note: 'Fresh — not salted or preserved' },
          { name: 'Leaf mold (for JMS starter)', quantity: '1 mesh bag' },
          { name: 'Sea salt', quantity: '1 tbsp' },
        ],
        ratio: '3:1 water to fish by weight',
        fermentationDays: [30, 90],
        applicationRate: '1:30 dilution for drench, 1:50 for foliar',
        applicationMethod: 'both',
        notes: 'High nitrogen + phosphorus. Excellent for root establishment (396Hz) and vegetative growth (528Hz). Odor is strong — apply early morning.',
      },
      {
        name: 'JLF — Bone Meal (Ca-P boost)',
        frequencyAffinity: [396, 639],
        primaryFunction: 'Calcium + Phosphorus — structural integrity & mycorrhizal sync',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '30 gallons' },
          { name: 'Crushed bones (raw or roasted)', quantity: '8 lbs', note: 'Smaller pieces ferment faster' },
          { name: 'Leaf mold', quantity: '1 mesh bag' },
          { name: 'Brown sugar or molasses', quantity: '1 cup', note: 'Feeds fermentation microbes' },
        ],
        ratio: '4:1 water to bone by weight',
        fermentationDays: [60, 120],
        applicationRate: '1:20 dilution drench',
        applicationMethod: 'drench',
        notes: 'Slow-release calcium and phosphorus. Maps to 639Hz Heart zone (calcium) and 396Hz Root (phosphorus). Apply at transplant.',
      },
      {
        name: 'JLF — Seaweed (K-Si boost)',
        frequencyAffinity: [741, 852],
        primaryFunction: 'Potassium + Silica + trace minerals — Brix & medicinal density',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '30 gallons' },
          { name: 'Fresh or dried seaweed', quantity: '5 lbs', note: 'Rinse to remove excess salt' },
          { name: 'Leaf mold', quantity: '1 mesh bag' },
        ],
        ratio: '6:1 water to seaweed by weight',
        fermentationDays: [14, 30],
        applicationRate: '1:30 dilution foliar, 1:20 drench',
        applicationMethod: 'both',
        notes: 'Rich in potassium (741Hz Signal/Brix) and silica (852Hz Vision/medicinal density). Contains cytokinins and alginates that strengthen cell walls.',
      },
      {
        name: 'JLF — Comfrey (K-N-Ca)',
        frequencyAffinity: [528, 639, 741],
        primaryFunction: 'Multi-mineral — nitrogen, potassium, calcium from dynamic accumulator',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '20 gallons' },
          { name: 'Comfrey leaves (fresh)', quantity: '15 lbs', note: 'Bocking 14 variety ideal — deep taproots mine subsoil minerals' },
          { name: 'Leaf mold', quantity: '1 mesh bag' },
        ],
        ratio: '1.5:1 water to comfrey by weight',
        fermentationDays: [14, 21],
        applicationRate: '1:10 dilution drench, 1:20 foliar',
        applicationMethod: 'both',
        notes: 'Comfrey is a dynamic accumulator that mines potassium, calcium, and nitrogen from deep subsoil. Maps across Alchemy (528Hz), Heart (639Hz), and Signal (741Hz).',
      },
      {
        name: 'JLF — Eggshell (Ca boost)',
        frequencyAffinity: [639, 963],
        primaryFunction: 'Calcium — structural cell walls & blossom end rot prevention',
        ingredients: [
          { name: 'Non-chlorinated water', quantity: '5 gallons' },
          { name: 'Crushed eggshells', quantity: '2 lbs', note: 'Dried and crushed fine' },
          { name: 'Brown rice vinegar', quantity: '1 quart', note: 'Acetic acid dissolves calcium carbonate' },
          { name: 'Leaf mold', quantity: '1 small mesh bag' },
        ],
        ratio: '2.5:1 water to eggshell by weight',
        fermentationDays: [7, 14],
        applicationRate: '1:20 dilution drench',
        applicationMethod: 'drench',
        notes: 'Fast calcium delivery. Maps to 639Hz Heart zone (calcium) and 963Hz Source (rot prevention). Apply weekly during fruiting.',
      },
    ],
    safetyNotes: [
      'Always dilute before application — never apply concentrate',
      'Fish-based JLF will attract animals — store in sealed containers',
      'Apply foliar sprays in early morning or evening to prevent leaf burn',
    ],
  },
  {
    id: 'JNP',
    name: 'JNP',
    fullName: 'JADAM Natural Pesticide',
    koreanName: '자닮천연농약',
    emoji: '🛡️',
    description: 'Plant-based pest and disease control using JWA (wetting agent) as a carrier combined with specific plant extracts that disrupt pest feeding and reproduction.',
    scienceBasis: 'JWA (canola oil emulsion) acts as a physical suffocant that clogs insect spiracles. Plant extracts contain alkaloids, terpenes, and saponins that interfere with insect nervous systems and fungal cell membranes.',
    color: 'hsl(0 55% 50%)',
    variants: [
      {
        name: 'JNP — Garlic + Hot Pepper',
        frequencyAffinity: [963, 852],
        primaryFunction: 'Broad-spectrum pest deterrent — sulfur compounds + capsaicin',
        ingredients: [
          { name: 'JWA (see below)', quantity: '500ml' },
          { name: 'Garlic (crushed)', quantity: '500g', note: 'Allicin = natural fungicide' },
          { name: 'Hot pepper (dried, ground)', quantity: '200g', note: 'Capsaicin deters chewing insects' },
          { name: 'Water', quantity: '20 liters' },
        ],
        ratio: 'JWA 500ml + extracts per 20L water',
        fermentationDays: 0,
        applicationRate: 'Full strength spray — coat all leaf surfaces',
        applicationMethod: 'foliar',
        notes: 'Sulfur compounds from garlic map to 963Hz Source/Shield zone. Apply every 5-7 days during pest pressure. Best in evening.',
      },
      {
        name: 'JNP — Neem Seed',
        frequencyAffinity: [852, 741],
        primaryFunction: 'Anti-feedant + insect growth regulator — azadirachtin',
        ingredients: [
          { name: 'JWA', quantity: '500ml' },
          { name: 'Neem seed powder', quantity: '300g', note: 'Cold-pressed — heat degrades azadirachtin' },
          { name: 'Water', quantity: '20 liters' },
        ],
        ratio: 'JWA 500ml + neem per 20L',
        fermentationDays: 0,
        applicationRate: 'Full strength spray',
        applicationMethod: 'foliar',
        notes: 'Azadirachtin disrupts insect molting hormones. Maps to 852Hz Vision (medicinal complexity). Effective against aphids, whiteflies, caterpillars.',
      },
      {
        name: 'JNP — Sulfur (Fungal)',
        frequencyAffinity: [963],
        primaryFunction: 'Fungicide — disrupts fungal spore germination',
        ingredients: [
          { name: 'JWA', quantity: '500ml' },
          { name: 'Wettable sulfur', quantity: '100g', note: 'Agricultural grade' },
          { name: 'Water', quantity: '20 liters' },
        ],
        ratio: 'JWA 500ml + sulfur per 20L',
        fermentationDays: 0,
        applicationRate: 'Full strength spray — preventive application',
        applicationMethod: 'foliar',
        notes: 'Sulfur maps directly to 963Hz Source/Shield zone. Prevents powdery mildew, black spot, and rust. Do NOT apply above 85°F.',
      },
    ],
    safetyNotes: [
      'Do NOT apply sulfur-based JNP above 85°F — phytotoxicity risk',
      'Test on a few leaves before full application',
      'Wear eye protection when mixing hot pepper extracts',
      'Neem degrades in UV — apply in evening',
    ],
  },
  {
    id: 'JS',
    name: 'JS',
    fullName: 'JADAM Sulfur',
    koreanName: '자닮유황',
    emoji: '🔥',
    description: 'Homemade lime-sulfur fungicide. A powerful preventive and curative treatment for fungal diseases including powdery mildew, black spot, and anthracnose.',
    scienceBasis: 'Calcium polysulfide (CaSx) disrupts fungal cell membrane integrity and inhibits spore germination. The alkaline pH (10+) creates hostile conditions for fungal colonization on leaf surfaces.',
    color: 'hsl(50 80% 50%)',
    variants: [
      {
        name: 'Standard JS (Lime-Sulfur)',
        frequencyAffinity: [963, 639],
        primaryFunction: 'Calcium polysulfide — systemic fungicide + calcium delivery',
        ingredients: [
          { name: 'Water', quantity: '10 liters' },
          { name: 'Caustic soda (NaOH)', quantity: '200g', note: '⚠️ CAUSTIC — full PPE required' },
          { name: 'Sulfur powder', quantity: '1 kg', note: 'Agricultural grade' },
        ],
        ratio: '10L : 200g NaOH : 1kg S',
        fermentationDays: 0,
        applicationRate: '1:500 dilution for foliar spray',
        applicationMethod: 'foliar',
        notes: 'Cook at 100°C for 1 hour until deep red-brown. Maps to 963Hz (sulfur/shield) and 639Hz (calcium). EXTREMELY concentrated — always dilute 1:500.',
      },
    ],
    safetyNotes: [
      '⚠️ CAUSTIC — wear full PPE: goggles, gloves, long sleeves',
      'Prepare OUTDOORS with good ventilation — releases H₂S gas',
      'Add NaOH to water SLOWLY — exothermic reaction',
      'Never mix with acidic solutions',
      'Store in labeled glass or HDPE containers',
      'Keep away from children and animals',
    ],
  },
  {
    id: 'JWA',
    name: 'JWA',
    fullName: 'JADAM Wetting Agent',
    koreanName: '자닮전착제',
    emoji: '💧',
    description: 'Emulsified canola oil surfactant that acts as a carrier, sticker, and physical pest control agent. The foundation for all JNP applications.',
    scienceBasis: 'Oil-in-water emulsion reduces surface tension, enabling spray solutions to coat waxy leaf surfaces. Oil physically clogs insect spiracles (breathing pores), suffocating soft-bodied pests on contact.',
    color: 'hsl(200 50% 50%)',
    variants: [
      {
        name: 'Standard JWA',
        frequencyAffinity: [417],
        primaryFunction: 'Surfactant / carrier — enables all JNP applications',
        ingredients: [
          { name: 'Canola oil', quantity: '1 liter', note: 'Cold-pressed preferred' },
          { name: 'Caustic soda (NaOH)', quantity: '35g', note: '⚠️ Handle with care' },
          { name: 'Water', quantity: '1 liter', note: 'Warm — helps emulsification' },
        ],
        ratio: '1L oil : 35g NaOH : 1L water',
        fermentationDays: 0,
        applicationRate: '500ml per 20L spray solution',
        applicationMethod: 'foliar',
        notes: 'Dissolve NaOH in water first, then slowly add oil while stirring vigorously. Should form a smooth, milky emulsion. Maps to 417Hz Flow (water/hydration carrier).',
      },
    ],
    safetyNotes: [
      '⚠️ NaOH is caustic — wear gloves and eye protection',
      'Add NaOH to water, never water to NaOH',
      'Stir continuously during oil addition to prevent separation',
      'Store in airtight container — stable for months',
    ],
  },
];

/** Frequency zone labels for display */
export const ZONE_LABELS: Record<number, { name: string; color: string; note: string }> = {
  396: { name: 'Root', color: '#FF0000', note: 'C' },
  417: { name: 'Flow', color: '#FF7F00', note: 'D' },
  528: { name: 'Alchemy', color: '#FFFF00', note: 'E' },
  639: { name: 'Heart', color: '#00FF00', note: 'F' },
  741: { name: 'Signal', color: '#0000FF', note: 'G' },
  852: { name: 'Vision', color: '#9B59B6', note: 'A' },
  963: { name: 'Source', color: '#8B00FF', note: 'B' },
};

/** Get protocols relevant to a specific frequency zone */
export const getProtocolsForZone = (hz: number): { protocol: JadamProtocol; variant: JadamRecipeVariant }[] => {
  const results: { protocol: JadamProtocol; variant: JadamRecipeVariant }[] = [];
  for (const protocol of JADAM_PROTOCOLS) {
    for (const variant of protocol.variants) {
      if (variant.frequencyAffinity.includes(hz)) {
        results.push({ protocol, variant });
      }
    }
  }
  return results;
};
