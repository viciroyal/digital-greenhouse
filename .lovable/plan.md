
## Aromatic Scent Corridor Visualization

### Overview
Add a new "Scent Corridor" panel to the Crop Oracle's utility toolbar (alongside Soil Protocol, Planting Calendar, and Modal Guide). This panel visualizes which aromatic, pest-deterrent, and fragrance species create biological barriers around the current food forest guild recipe.

### What It Shows
The panel will display a concentric ring diagram (styled as a retro-synth radar display) representing the three aromatic layers that surround a food forest guild:

1. **Inner Ring — Culinary Aromatics**: Herbs like Bee Balm, Shiso, Sweet Marjoram, Lemon Balm that serve dual culinary/pest-confusing roles
2. **Middle Ring — Pest Deterrent Barrier**: Sentinel species like Citronella Grass, Pyrethrum Daisy, Catnip, Feverfew that form biological exclusion zones
3. **Outer Ring — Fragrance Corridor**: Pollinator-attracting species like Star Jasmine, Honeysuckle, Sweet Woodruff, Anise Hyssop that draw beneficial insects

Each ring shows species available in the current frequency zone, with zone-colored accents and icons indicating their deterrent targets (mosquito, aphid, deer, etc.).

### User Experience
- A new **Shield icon** button appears in the toolbar next to Beaker/Calendar/Music (only visible in Food Forest mode or Pro mode)
- Clicking it opens an inline panel below the frequency bar
- The panel queries `master_crops` for entries with aromatic-related `library_note` tags
- Species already present in the current chord recipe are highlighted with a checkmark
- Users can tap any aromatic species to swap it into an open chord slot

### Technical Details

**1. New Component: `src/components/crop-oracle/ScentCorridorPanel.tsx`**
- Receives props: `frequencyHz`, `zoneColor`, `zoneName`, `chordCrops` (current recipe crops), `allCrops`, `onSwapRequest`
- Filters `allCrops` by frequency zone and aromatic classification using `library_note` patterns (`'Aromatic'`, `'Pest Barrier'`, `'Fragrance'`, `'Ground Cover'`) and `category === 'Dye/Fiber/Aromatic'`
- Groups species into three tiers: Culinary, Pest-Deterrent, Fragrance
- Each species row shows: name, role tag (Sentinel/Enhancer/Signal), deterrent target if applicable, and whether it's already in the recipe
- Collapsible accordion sections for each tier

**2. Modify `src/pages/CropOracle.tsx`**
- Add `'scent'` to the `activeToolPanel` union type: `'soil' | 'calendar' | 'modal' | 'scent'`
- Add a Shield (lucide) icon button to the toolbar array, conditionally shown when `environment === 'food-forest'` or `proMode`
- Add the `ScentCorridorPanel` render block inside the `AnimatePresence` for tool panels
- Import the new component and the `Shield` icon from lucide-react

**3. Panel Layout (matching retro-synth aesthetic)**
- Dark background (`hsl(0 0% 5%)`) with zone-colored border accents
- Three collapsible sections with zone-colored headers:
  - "CULINARY AROMATICS" with a leaf icon
  - "PEST DETERRENT BARRIER" with a shield icon  
  - "FRAGRANCE CORRIDOR" with a flower icon
- Each species rendered as a compact row with:
  - Aromatic type badge (Culinary / Sentinel / Fragrance)
  - Species name in mono font
  - Deterrent target tag if available (extracted from `library_note`)
  - Checkmark if already in the current chord recipe
  - Zone badge showing frequency
- Footer showing coverage stats: "3/5 aromatic roles filled" with a simple progress indicator

**4. Data Classification Logic**
Species classification based on existing `library_note` and `category` fields:
- **Culinary**: `library_note` contains "Aromatic Layer" (not "Pest") AND (`guild_role` = 'Enhancer')
- **Pest-Deterrent**: `library_note` contains "Pest Barrier" OR `guild_role` = 'Sentinel'
- **Fragrance**: `library_note` contains "Fragrance" OR "Ground Cover" OR "Pollinator"
- Falls back to `category === 'Dye/Fiber/Aromatic'` for uncategorized aromatics

No database changes are needed since the classification data already exists in `library_note` fields from the recent migrations.
