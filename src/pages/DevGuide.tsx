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
          Technical documentation • File structure • Best practices
        </p>

        <Section title="ARCHITECTURE OVERVIEW">
          <p>The app follows <strong>"The Mullet Strategy"</strong>: a creative landing page (World 1 / The Stage) and a functional 3-step crop planning wizard (World 2 / The Studio).</p>
          <p><strong>Stack:</strong> React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Lovable Cloud (Supabase)</p>
          <p><strong>State:</strong> React Query for server state, useState for local UI state. No Redux or Zustand needed.</p>
        </Section>

        <Section title="FILE STRUCTURE">
          <Code>{`src/
├── pages/              # Route-level components
│   ├── Index.tsx        # Landing page (The Stage)
│   ├── CropOracle.tsx   # 3-step wizard (The Studio) — MAIN feature
│   ├── Auth.tsx         # Login / signup
│   ├── UserGuide.tsx    # User manual (this file)
│   ├── DevGuide.tsx     # Developer docs (this file)
│   └── NotFound.tsx     # 404 page
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, dialog...)
│   ├── almanac/         # Field Almanac engines (12 science engines)
│   │   └── engines/     # Soil, Vitality, Resonance, Companion, etc.
│   ├── ancestral/       # Ancestral path components (learning modules)
│   ├── audio/           # Music player, sound system
│   ├── bio-digital/     # Bioluminescent veins, Brix meters, overlays
│   ├── cosmogram/       # Grand Cosmogram visualization
│   ├── conductor/       # Bed grid, chord sheets
│   ├── crop-oracle/     # Sub-components for the Crop Oracle
│   ├── cursor/          # Custom cursor effects
│   ├── navigation/      # Chakra spine nav
│   ├── portal/          # Keyhole entry, pledge modal
│   ├── profile/         # Steward dashboard, blessings
│   ├── scrollytelling/  # Parallax scroll effects
│   ├── shop/            # E-commerce components
│   ├── track-detail/    # Track detail quadrants
│   └── community/       # Resonant chamber
├── hooks/
│   ├── useMasterCrops.ts    # Central data hook — single source of truth
│   ├── useGardenBeds.ts     # Garden bed CRUD + Jazz Voicing engine
│   ├── useLunarPhase.ts     # Real-time moon phase calculator
│   ├── useAutoGeneration.ts # Auto-populate beds from master data
│   ├── useWeatherAlert.ts   # Weather warning system
│   └── useAdminRole.ts      # Role-based access control
├── data/
│   ├── trackData.ts         # Album track → frequency zone mapping
│   ├── cropInstrumentMapping.ts  # Crop category → instrument type
│   ├── jazzVoicingRecommendations.ts  # 11th/13th interval data
│   ├── almanacData.ts       # Field almanac content
│   ├── chordRecipes.ts      # Chord composition rules
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
    ├── birthchart.test.ts
    └── jazzVoicingFungi.test.ts`}</Code>
        </Section>

        <Section title="DATABASE SCHEMA">
          <p>All data lives in Lovable Cloud (Supabase). Key tables:</p>
          <Code>{`master_crops       — 100+ crops with frequency_hz, zone, Brix targets, chord_interval, spacing
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
        </Section>

        <Section title="THE 7-ZONE OCTAVE SYSTEM">
          <p>All crops are organized by Solfeggio frequency. This is the core domain model:</p>
          <Code>{`396Hz (C) — Foundation / Root — Red    — Phosphorus
417Hz (D) — Flow / Vine      — Orange — Hydrogen/Carbon
528Hz (E) — Alchemy / Solar  — Yellow — Nitrogen
639Hz (F) — Heart            — Green  — Calcium
741Hz (G) — Signal           — Blue   — Potassium
852Hz (A) — Vision           — Indigo — Silica
963Hz (B) — Source           — Violet — Sulfur`}</Code>
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
          <p><strong>5. Keep CropOracle.tsx lean:</strong> Extract sub-components into <code>src/components/crop-oracle/</code> when sections exceed ~100 lines.</p>
          <p><strong>6. Font usage:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>Chewy</code> — Organic headers, playful titles</li>
            <li><code>Space Mono</code> — Body text, technical data</li>
            <li><code>Staatliches</code> — Ancestral headers, spiritual names</li>
          </ul>
        </Section>

        <Section title="ADDING A NEW CROP">
          <Code>{`-- Insert via Lovable Cloud SQL:
INSERT INTO master_crops (
  name, common_name, frequency_hz, zone_name, zone_color,
  element, category, chord_interval, focus_tag,
  spacing_inches, harvest_days
) VALUES (
  'Pepper (Carolina Reaper)', 'Carolina Reaper', 
  396, 'Root', '#FF0000', 'Earth', 'Sustenance',
  'Root (Lead)', 'ROOT_FOCUS', '24', 90
);`}</Code>
        </Section>

        <Section title="ADDING A NEW PAGE / ROUTE">
          <Code>{`// 1. Create src/pages/MyPage.tsx
// 2. Add route in src/App.tsx:
<Route path="/my-page" element={<MyPage />} />`}</Code>
        </Section>

        <Section title="TESTING">
          <p>Tests live in <code>src/test/</code> and use Vitest + React Testing Library.</p>
          <Code>{`# Run all tests
bun run test

# Key test files:
src/test/soilCalculator.test.ts   — Soil mix math
src/test/lunarPhase.test.ts       — Moon phase accuracy
src/test/jazzVoicingFungi.test.ts — Fungi mapping
src/test/birthchart.test.ts       — Astro calculator
src/test/zoneProtocol.test.ts     — Zone data integrity`}</Code>
          <p><strong>Test naming:</strong> <code>[feature].test.ts</code> for pure logic, <code>[Component].test.tsx</code> for UI.</p>
        </Section>

        <Section title="EDGE FUNCTIONS">
          <p>Backend functions live in <code>supabase/functions/</code>:</p>
          <Code>{`supabase/functions/
└── griot-oracle/index.ts  — AI advisor (Lovable AI gateway)`}</Code>
          <p>Edge functions deploy automatically. Use <code>LOVABLE_API_KEY</code> (auto-provisioned) for AI calls.</p>
        </Section>

        <Section title="PERFORMANCE TIPS">
          <ul className="list-disc pl-5 space-y-1">
            <li>React Query caches crop data for 5 min (<code>staleTime</code>) — don't refetch unnecessarily</li>
            <li>Use <code>useMemo</code> for expensive filtering (see CropOracle zone filtering)</li>
            <li>Lazy-load heavy components with <code>React.lazy()</code></li>
            <li>Images in <code>src/assets/</code> get bundled; use <code>public/</code> for static refs</li>
          </ul>
        </Section>

        <Section title="SECURITY">
          <ul className="list-disc pl-5 space-y-1">
            <li>All tables have RLS policies — user data is scoped by <code>auth.uid()</code></li>
            <li>Never expose private API keys in client code</li>
            <li><code>user_roles</code> table gates admin features</li>
            <li>Edge functions validate auth tokens server-side</li>
          </ul>
        </Section>

        <p className="text-center font-['Space_Mono'] text-[10px] mt-8" style={{ color: 'hsl(0 0% 30%)' }}>
          PharmBoi Developer Guide • v1.0 • {new Date().toISOString().split('T')[0]}
        </p>
      </main>
    </div>
  );
};

export default DevGuide;
