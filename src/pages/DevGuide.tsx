import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl mb-3 overflow-hidden print:border-muted" style={{ borderColor: 'hsl(0 0% 20%)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-['Staatliches'] text-base tracking-wider print:py-2"
        style={{ background: 'hsl(0 0% 6%)', color: 'hsl(45 90% 60%)' }}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-5 h-5 shrink-0 print:hidden" /> : <ChevronDown className="w-5 h-5 shrink-0 print:hidden" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 font-['Space_Mono'] text-xs leading-relaxed space-y-3 print:py-2" style={{ color: 'hsl(40 40% 75%)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden print:block px-5 py-3 font-['Space_Mono'] text-xs leading-relaxed space-y-2" style={{ color: 'hsl(0 0% 20%)' }}>
        {children}
      </div>
    </div>
  );
};

const Code = ({ children }: { children: string }) => (
  <pre className="rounded-lg px-4 py-3 text-[11px] leading-snug overflow-x-auto whitespace-pre-wrap" style={{ background: 'hsl(0 0% 8%)', color: 'hsl(120 40% 65%)', border: '1px solid hsl(0 0% 15%)' }}>
    {children}
  </pre>
);

const DevGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 4%)' }}>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:border-muted { border-color: #ccc !important; }
          .print\\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          * { color: #222 !important; background: white !important; }
          pre { background: #f5f5f5 !important; border: 1px solid #ddd !important; }
        }
      `}</style>

      <header className="no-print sticky top-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: 'hsl(0 0% 4% / 0.95)', borderBottom: '1px solid hsl(0 0% 15%)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-['Space_Mono'] text-xs" style={{ color: 'hsl(40 40% 70%)' }}>
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-['Space_Mono'] text-xs"
          style={{ background: 'hsl(45 90% 60%)', color: 'hsl(0 0% 5%)' }}
        >
          <Download className="w-4 h-4" /> EXPORT PDF
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-['Staatliches'] text-3xl md:text-4xl text-center tracking-widest mb-2" style={{ color: 'hsl(45 90% 60%)' }}>
          DEVELOPER GUIDE
        </h1>
        <p className="text-center font-['Space_Mono'] text-xs mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
          Technical documentation • File structure • Best practices • v2.0
        </p>

        <Section title="ARCHITECTURE OVERVIEW">
          <p>The app follows <strong>"The Mullet Strategy"</strong>: a creative landing page (World 1 / The Stage) and a functional 3-step crop planning wizard (World 2 / The Studio).</p>
          <p><strong>Stack:</strong> React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Lovable Cloud (Supabase)</p>
          <p><strong>State:</strong> React Query for server state (Infinity staleTime for static crop data), useState for local UI state. No Redux or Zustand needed.</p>
          <p><strong>Environments:</strong> Pot, Raised Bed, Farm (Pro), High Tunnel (Pro), Food Forest (Pro). Each environment applies custom recipe filtering logic.</p>
          <p><strong>Performance:</strong> All secondary routes use <code>React.lazy()</code> for code splitting. Only the landing page (Index) loads eagerly for instant first paint. CropRow components use <code>React.memo()</code> to prevent unnecessary re-renders. The Crop Library uses <code>@tanstack/react-virtual</code> for row virtualization.</p>
          <p><strong>Data completeness:</strong> All 1,684 crops have 100% population across all 6 AI-batch fields: growth_habit, scientific_name, planting_season, harvest_days, root_depth_inches, min_container_gal.</p>
        </Section>

        <Section title="FILE STRUCTURE">
          <Code>{`src/
├── pages/                  # Route-level components (lazy-loaded except Index)
│   ├── Index.tsx            # Landing page (The Stage) — eagerly loaded
│   ├── CropOracle.tsx       # 3-step wizard (The Studio) — MAIN feature
│   ├── CropLibrary.tsx      # Full crop registry + CSV export
│   ├── Auth.tsx             # Login / signup
│   ├── Profile.tsx          # Steward dashboard
│   ├── UserGuide.tsx        # User manual
│   ├── DevGuide.tsx         # Developer docs
│   ├── TestingSuiteDocs.tsx  # Testing documentation
│   └── NotFound.tsx         # 404 page
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, dialog...)
│   ├── almanac/             # Field Almanac engines (12 science engines)
│   │   └── engines/         # Soil, Vitality, Resonance, Companion, etc.
│   ├── ancestral/           # Ancestral path components (learning modules)
│   ├── audio/               # Music player, sound system
│   ├── bio-digital/         # Bioluminescent veins, Brix meters, overlays
│   ├── cosmogram/           # Grand Cosmogram visualization
│   ├── conductor/           # Bed grid, chord sheets
│   ├── crop-oracle/         # Sub-components for the Crop Oracle
│   │   └── GrowthHabitBadge.tsx  # Reusable growth habit pill badge
│   ├── crop-library/        # Refactored library components
│   │   ├── CropRow.tsx      # Memoized table row (React.memo)
│   │   ├── VirtualizedZoneTable.tsx  # @tanstack/react-virtual wrapper
│   │   ├── csvExport.ts     # CSV generation utility
│   │   └── constants.ts     # Zone order, table headers
│   ├── cursor/              # Custom cursor effects
│   ├── navigation/          # Chakra spine nav
│   ├── portal/              # Keyhole entry, pledge modal
│   ├── profile/             # Steward dashboard, blessings
│   ├── scrollytelling/      # Parallax scroll effects
│   ├── shop/                # E-commerce components
│   ├── track-detail/        # Track detail quadrants
│   └── community/           # Resonant chamber
├── hooks/
│   ├── useMasterCrops.ts    # Central data hook — single source of truth
│   ├── useGardenBeds.ts     # Garden bed CRUD + Jazz Voicing engine
│   ├── useLunarPhase.ts     # Real-time moon phase calculator
│   ├── useAutoGeneration.ts # Auto-populate beds from master data
│   ├── useWeatherAlert.ts   # Weather warning system
│   └── useAdminRole.ts      # Role-based access control
├── data/
│   ├── trackData.ts             # Album track → frequency zone mapping
│   ├── cropInstrumentMapping.ts # Crop category → instrument type
│   ├── jazzVoicingRecommendations.ts  # 11th/13th interval data
│   ├── almanacData.ts           # Field almanac content
│   ├── chordRecipes.ts          # Chord composition rules
│   └── harmonicZoneProtocol.ts  # Zone dependency rules
├── contexts/
│   ├── CircadianContext.tsx  # Day/night theme switching
│   ├── AudioBiomeContext.tsx # Sound environment state
│   ├── FieldModeContext.tsx  # Field vs. studio mode
│   └── ScienceModeContext.tsx  # Science overlay toggle
├── lib/
│   ├── astroCalculator.ts   # Birth chart calculations
│   ├── geocoding.ts         # Location → coordinates
│   └── utils.ts             # Tailwind merge utility
├── integrations/
│   └── supabase/            # Auto-generated — DO NOT EDIT
│       ├── client.ts
│       └── types.ts
└── test/                    # Test files
    ├── setup.ts
    ├── example.test.ts
    ├── soilCalculator.test.ts
    ├── lunarPhase.test.ts
    ├── cropOracle.test.ts
    ├── zoneProtocol.test.ts
    ├── jazzVoicingFungi.test.ts
    └── birthchart.test.ts`}</Code>
        </Section>

        <Section title="DATABASE SCHEMA">
          <p>All data lives in Lovable Cloud (Supabase). Key tables:</p>
          <Code>{`master_crops       — 1,684 crops with frequency_hz, zone, Brix targets, chord_interval,
                     spacing, growth_habit, root_depth_inches, min_container_gal,
                     scientific_name, hardiness zones, planting_season, harvest_days
garden_beds        — User garden beds with zone assignment, Brix readings, inoculants
bed_plantings      — Crops planted in specific beds with guild roles
saved_recipes      — User-saved chord recipes (environment + zone + chord data)
saved_soil_configs — Saved soil calculator configurations
soil_amendments    — Master Mix component quantities
modules            — Learning path modules (Ancestral Path)
lessons            — Individual lessons within modules
user_lesson_progress  — Completion tracking
user_module_progress  — Module unlock tracking
seven_pillars_status  — Infrastructure pillar tracking
user_roles         — Admin/moderator/user roles`}</Code>
          <p><strong>Key relationship:</strong> master_crops.frequency_hz links to garden_beds.frequency_hz. The useMasterCrops hook is the single source of truth for all crop data.</p>
          <p><strong>Zone colors:</strong> All zone_color values are normalized to canonical hex: #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF.</p>
          <p><strong>Zone names:</strong> Normalized to single words: Foundation, Flow, Alchemy, Heart, Signal, Vision, Source (no "/ Element" suffixes).</p>
        </Section>

        <Section title="MASTER CROP FIELDS">
          <p>Each crop in master_crops has the following fields:</p>
          <Code>{`name               — Internal identifier
common_name        — Display name (e.g., "Cherokee Purple Tomato")
scientific_name    — Binomial name (e.g., "Solanum lycopersicum")
frequency_hz       — Solfeggio zone: 396, 417, 528, 639, 741, 852, 963
zone_name          — Foundation, Flow, Alchemy, Heart, Signal, Vision, Source
zone_color         — Canonical hex: #FF0000 through #8B00FF
element            — Earth, Water, Fire, Air, Ether, Light, Spirit
category           — Sustenance, Sentinel/Miner, Nitrogen/Bio-Mass, Dye/Fiber/Aromatic
chord_interval     — Root (Lead), 3rd (Triad), 5th (Stabilizer), 7th (Signal)
focus_tag          — ROOT_FOCUS through SOURCE_FOCUS
growth_habit       — tree, shrub, bush, vine, herb, grass, ground cover, underground,
                     bulb, root, tuber, rhizome, aquatic, succulent, fungus, epiphyte
root_depth_inches  — Typical mature root depth (integer, 6-72+)
min_container_gal  — Minimum container size in gallons (numeric, 1-25+)
instrument_type    — Electric Guitar, Percussion, Horn Section, Bass, Synthesizers
dominant_mineral   — Phosphorus, Calcium, Potassium, etc.
brix_target_min/max — Brix refractometer target range
hardiness_zone_min/max — USDA zones with sub-zones (8.0=8a, 8.5=8b)
harvest_days       — Days to first harvest
spacing_inches     — Plant spacing requirement
planting_season    — Array: ["Spring", "Summer", "Fall", "Winter"]
companion_crops    — Array of companion plant names
crop_guild         — Array of guild members
guild_role         — Lead, Sentinel, Miner, Enhancer
soil_protocol_focus — Zone-specific soil strategy
cultural_role      — Cultural/traditional significance
library_note       — Additional notes
description        — Detailed description`}</Code>
        </Section>

        <Section title="THE 7-ZONE OCTAVE SYSTEM">
          <p>All crops are organized by Solfeggio frequency. This is the core domain model:</p>
          <Code>{`396Hz (C) — Foundation — Red (#FF0000)    — Earth  — Phosphorus  — 250 crops
417Hz (D) — Flow       — Orange (#FF7F00) — Water  — H/Carbon    — 175 crops
528Hz (E) — Alchemy    — Yellow (#FFFF00) — Fire   — Nitrogen    — 243 crops
639Hz (F) — Heart      — Green (#00FF00)  — Air    — Calcium     — 271 crops
741Hz (G) — Signal     — Blue (#0000FF)   — Ether  — Potassium   — 312 crops
852Hz (A) — Vision     — Indigo (#4B0082) — Light  — Silica      — 249 crops
963Hz (B) — Source     — Violet (#8B00FF) — Spirit — Sulfur      — 184 crops`}</Code>
        </Section>

        <Section title="CHORD INTERVAL SYSTEM">
          <p>Each garden bed is a "chord" composed of crops at different intervals:</p>
          <Code>{`Root (Lead)      — Main harvest crop (The Star)
3rd (Triad)      — Pest defense companion
5th (Stabilizer) — Deep mineral puller / nitrogen fixer
7th (Signal)     — Pollinator / aromatic herb
9th (Sub-bass)   — Underground root layer (Pro Mode)
11th (Tension)   — Fungal inoculant (Pro Mode)
13th (Top Note)  — Aerial overstory (Pro Mode)`}</Code>
        </Section>

        <Section title="FOOD FOREST ENVIRONMENT">
          <p>When <code>environment === 'food-forest'</code>, the recipe engine remaps chord slots to forest layers:</p>
          <Code>{`Root (Lead)      → Canopy Tree   — Fruit/nut trees (perennials prioritized)
3rd (Triad)      → Understory    — Berry bushes, comfrey, small trees
5th (Stabilizer) → N-Fixer       — Clover, beans, vetch (nitrogen fixers)
7th (Signal)     → Pollinator    — Perennial flowers/herbs
9th (Sub-bass)   → Root Layer    — Deep nutrient miners (comfrey, dandelion)
11th (Tension)   → Fungal Net    — Mycelium, shiitake, reishi
13th (Top Note)  → Vine Layer    — Grapes, passion fruit, kiwi`}</Code>
          <p>Filtering: perennials, fruit trees, and nitrogen-fixers are sorted to top of pool. Labels, emojis, and hints override via <code>FOOD_FOREST_LAYERS</code> constant.</p>
        </Section>

        <Section title="GROWTH HABIT SYSTEM">
          <p>The <code>GrowthHabitBadge</code> component renders a colored pill with emoji for each crop's growth habit:</p>
          <Code>{`16 supported habits:
tree, shrub, bush, vine, herb, grass, ground cover, underground,
bulb, root, tuber, rhizome, aquatic, succulent, fungus, epiphyte

Usage:
import GrowthHabitBadge from '@/components/crop-oracle/GrowthHabitBadge';
<GrowthHabitBadge habit={crop.growth_habit} size="sm" />`}</Code>
          <p>The badge auto-maps habits to emojis (🌳 tree, 🍄 fungus, 🧗 vine, etc.) and HSL-based colors.</p>
        </Section>

        <Section title="CSV EXPORT (CROP LIBRARY)">
          <p><code>csvExport.ts</code> generates a 27-column CSV export:</p>
          <Code>{`common_name, scientific_name, frequency_hz, zone_name, element, category,
growth_habit, chord_interval, instrument_type, dominant_mineral, brix_min,
brix_max, hardiness_zone_min, hardiness_zone_max, harvest_days,
spacing_inches, root_depth_inches, min_container_gal, planting_season,
guild_role, focus_tag, companion_crops, crop_guild, soil_protocol_focus,
cultural_role, description, library_note`}</Code>
          <p>Arrays (companion_crops, crop_guild, planting_season) use semicolon separators. Fields with commas/quotes are properly escaped.</p>
        </Section>

        <Section title="PERFORMANCE ARCHITECTURE">
          <p><strong>Route splitting:</strong> All secondary pages use <code>React.lazy()</code> with <code>Suspense</code> fallbacks. Only Index.tsx loads eagerly.</p>
          <Code>{`// App.tsx
const CropOracle = lazy(() => import("./pages/CropOracle"));
const CropLibrary = lazy(() => import("./pages/CropLibrary"));
// ... all other routes

<Route path="/crop-oracle" element={
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <CropOracle />
  </Suspense>
} />`}</Code>
          <p><strong>Row virtualization:</strong> <code>VirtualizedZoneTable</code> uses <code>@tanstack/react-virtual</code> to virtualize zones with &gt;30 crops. Only visible rows render in the DOM, maintaining 60fps scrolling across 1,684 entries. A hidden <code>print:table</code> fallback renders all rows for PDF export.</p>
          <p><strong>Memoization:</strong> <code>CropRow</code> uses <code>React.memo()</code> to prevent re-renders. Zone grouping uses <code>useMemo</code>.</p>
          <p><strong>Query caching:</strong> All crop/amendment queries use <code>staleTime: Infinity</code> since this is static reference data that doesn't change during a session.</p>
          <p><strong>Pagination:</strong> <code>useMasterCrops</code> fetches all crops using range-based pagination to bypass the 1,000-row default limit.</p>
        </Section>

        <Section title="BEST PRACTICES">
          <p><strong>1. Never edit auto-generated files:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>src/integrations/supabase/client.ts</code></li>
            <li><code>src/integrations/supabase/types.ts</code></li>
            <li><code>.env</code></li>
            <li><code>supabase/config.toml</code></li>
          </ul>
          <p><strong>2. Use design tokens, not raw colors:</strong></p>
          <Code>{`// ✅ Good
className="bg-primary text-primary-foreground"

// ❌ Bad  
className="bg-red-500 text-white"`}</Code>
          <p><strong>3. All colors must be HSL:</strong></p>
          <Code>{`// ✅ Good
style={{ color: 'hsl(350 75% 50%)' }}

// ❌ Bad
style={{ color: '#ff0000' }}`}</Code>
          <p><strong>4. Use useMasterCrops for crop data:</strong></p>
          <Code>{`import { useMasterCrops } from '@/hooks/useMasterCrops';
const { data: crops, isLoading } = useMasterCrops();`}</Code>
          <p><strong>5. Component decomposition:</strong> Extract sub-components into dedicated directories when sections exceed ~100 lines. Example: <code>crop-library/CropRow.tsx</code>, <code>crop-library/csvExport.ts</code>.</p>
          <p><strong>6. Memoize list items:</strong> Any component rendered inside a large list (100+ items) should use <code>React.memo()</code>.</p>
          <p><strong>7. Font usage:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>Chewy</code> — Organic headers, playful titles</li>
            <li><code>Space Mono</code> — Body text, technical data</li>
            <li><code>Staatliches</code> — Ancestral headers, spiritual names</li>
          </ul>
        </Section>

        <Section title="ADDING A NEW CROP">
          <Code>{`-- Insert via Lovable Cloud SQL:
INSERT INTO master_crops (
  name, common_name, scientific_name, frequency_hz, zone_name, zone_color,
  element, category, chord_interval, focus_tag, growth_habit,
  root_depth_inches, min_container_gal, spacing_inches, harvest_days
) VALUES (
  'Pepper (Carolina Reaper)', 'Carolina Reaper', 'Capsicum chinense',
  396, 'Foundation', '#FF0000', 'Earth', 'Sustenance',
  'Root (Lead)', 'ROOT_FOCUS', 'herb', 18, 5, '24', 90
);`}</Code>
        </Section>

        <Section title="ADDING A NEW PAGE / ROUTE">
          <Code>{`// 1. Create src/pages/MyPage.tsx
// 2. Add lazy import in src/App.tsx:
const MyPage = lazy(() => import("./pages/MyPage"));

// 3. Add route with Suspense:
<Route path="/my-page" element={
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <MyPage />
  </Suspense>
} />`}</Code>
        </Section>

        <Section title="EDGE FUNCTIONS">
          <p>Backend functions live in <code>supabase/functions/</code>:</p>
          <Code>{`supabase/functions/
├── griot-oracle/index.ts       — AI advisor (Lovable AI gateway)
├── populate-crop-data/index.ts — Batch AI data population
├── populate-scientific-names/  — Scientific name population (legacy)`}</Code>
          <p>Edge functions deploy automatically. The <code>populate-crop-data</code> function supports batch-filling fields: <code>growth_habit</code>, <code>scientific_name</code>, <code>planting_season</code>, <code>harvest_days</code>, <code>root_depth_inches</code>, <code>min_container_gal</code>. All 6 fields are now <strong>100% populated</strong> across all 1,684 crops.</p>
          <Code>{`// Usage: POST /populate-crop-data
{ "field": "growth_habit" }  // Fills 50 crops per batch`}</Code>
        </Section>

        <Section title="TESTING">
          <p>Tests live in <code>src/test/</code> and use Vitest + React Testing Library.</p>
          <Code>{`# Run all tests
bun run test

# Key test files:
src/test/soilCalculator.test.ts   — Soil mix math (17 tests)
src/test/lunarPhase.test.ts       — Moon phase accuracy (12 tests)
src/test/cropOracle.test.ts       — Zone mapping & chords (11 tests)
src/test/zoneProtocol.test.ts     — Instrument integrity (8 tests)
src/test/jazzVoicingFungi.test.ts — Fungi mapping
src/test/birthchart.test.ts       — Astro calculator`}</Code>
          <p><strong>Test naming:</strong> <code>[feature].test.ts</code> for pure logic, <code>[Component].test.tsx</code> for UI.</p>
        </Section>

        <Section title="SECURITY">
          <ul className="list-disc pl-5 space-y-1">
            <li>All tables have RLS policies — user data is scoped by <code>auth.uid()</code></li>
            <li>Public tables (master_crops, garden_beds, lessons, modules) are read-only for non-admins</li>
            <li>Never expose private API keys in client code</li>
            <li><code>user_roles</code> table gates admin features via <code>has_role()</code> function</li>
            <li>Edge functions validate auth tokens server-side</li>
          </ul>
        </Section>

        <p className="text-center font-['Space_Mono'] text-[10px] mt-8" style={{ color: 'hsl(0 0% 30%)' }}>
          PharmBoi Developer Guide • v2.0 • {new Date().toISOString().split('T')[0]}
        </p>
      </main>
    </div>
  );
};

export default DevGuide;
