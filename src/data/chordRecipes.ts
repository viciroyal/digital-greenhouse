/**
 * Jazz 13th Chord Recipes — Curated 7-interval planting templates per zone.
 * Each recipe maps a frequency zone to a complete polyculture guild
 * with 7 musical intervals representing ecological roles.
 */

export interface ChordRecipeInterval {
  interval: string;       // e.g. "Root (1st)", "3rd", "5th", etc.
  role: string;           // ecological role label
  cropName: string;       // common_name from master_crops
  emoji: string;          // visual icon
}

export interface ChordRecipe {
  frequencyHz: number;
  zoneName: string;
  zoneColor: string;
  chordName: string;
  intervals: ChordRecipeInterval[];
}

export const CHORD_RECIPES: ChordRecipe[] = [
  {
    frequencyHz: 396,
    zoneName: 'Foundation',
    zoneColor: '#FF0000',
    chordName: 'The Root 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Heirloom Tomato',      emoji: '🍅' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Genovese Basil',       emoji: '🌿' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'Bush Beans',           emoji: '🫘' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Marigold (Sentinel)',  emoji: '🌼' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Red Carrots',          emoji: '🥕' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Red Onion',            emoji: '🧅' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Nasturtium (Trailing)', emoji: '🌺' },
    ],
  },
  {
    frequencyHz: 417,
    zoneName: 'Flow',
    zoneColor: '#FF7F00',
    chordName: 'The Flow 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Butternut Squash',     emoji: '🎃' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Dill (Bouquet)',       emoji: '🌿' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'Pole Beans',           emoji: '🫛' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Calendula',            emoji: '🌻' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Daikon Radish',        emoji: '🥬' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Garlic (Red)',         emoji: '🧄' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Sweet Potato Slips',   emoji: '🍠' },
    ],
  },
  {
    frequencyHz: 528,
    zoneName: 'Solar Alchemy',
    zoneColor: '#FFFF00',
    chordName: 'The Solar 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Glass Gem Corn',       emoji: '🌽' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Lemon Balm',           emoji: '🍋' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'Cowpea',               emoji: '🫘' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Mammoth Sunflower',    emoji: '🌻' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Jerusalem Artichoke',  emoji: '🥔' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Chives',               emoji: '🧅' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Seminole Pumpkin',     emoji: '🎃' },
    ],
  },
  {
    frequencyHz: 639,
    zoneName: 'Heart Integration',
    zoneColor: '#00FF00',
    chordName: 'The Heart 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Kale (Lacinato)',      emoji: '🥬' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Chamomile',            emoji: '🌼' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'White Clover',         emoji: '☘️' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Yarrow',               emoji: '🌾' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Beetroot',             emoji: '🟣' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Leek',                 emoji: '🧅' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Strawberry (Groundcover)', emoji: '🍓' },
    ],
  },
  {
    frequencyHz: 741,
    zoneName: 'Signal',
    zoneColor: '#0000FF',
    chordName: 'The Throat 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Blueberry',            emoji: '🫐' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Sage',                 emoji: '🌿' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'Hairy Vetch',          emoji: '🌱' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Borage',               emoji: '💙' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Burdock Root',         emoji: '🌰' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Shallot',              emoji: '🧅' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Comfrey',              emoji: '🍃' },
    ],
  },
  {
    frequencyHz: 852,
    zoneName: 'Vision',
    zoneColor: '#4B0082',
    chordName: 'The Vision 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Eggplant (Black Beauty)', emoji: '🍆' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'Holy Basil (Tulsi)',   emoji: '🌿' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'Soybean (Edamame)',    emoji: '🫛' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Echinacea',            emoji: '🌸' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Ashwagandha',          emoji: '🌰' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Garlic (Silverwhite)', emoji: '🧄' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Alyssum (Sweet)',      emoji: '🤍' },
    ],
  },
  {
    frequencyHz: 963,
    zoneName: 'Source Shield',
    zoneColor: '#8B00FF',
    chordName: 'The Source 13th',
    intervals: [
      { interval: '1st', role: 'Root / Canopy',         cropName: 'Garlic (Silverrose)',  emoji: '🧄' },
      { interval: '3rd', role: 'Flavor / Aromatic',     cropName: 'White Sage',           emoji: '🌿' },
      { interval: '5th', role: 'Stabilizer / Nitrogen', cropName: 'White Clover',         emoji: '☘️' },
      { interval: '7th', role: 'Vibe / Signal',         cropName: 'Echinacea',            emoji: '🌸' },
      { interval: '9th', role: 'Sub-bass / Tuber',      cropName: 'Ashwagandha',          emoji: '🌰' },
      { interval: '11th', role: 'Tension / Allium',     cropName: 'Leek',                 emoji: '🧅' },
      { interval: '13th', role: 'Top Note / Vine',      cropName: 'Moonflower (White)',   emoji: '🌙' },
    ],
  },
];
