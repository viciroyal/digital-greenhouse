import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-2xl mb-3 overflow-hidden print:border-muted" style={{ borderColor: 'hsl(0 0% 20%)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-['Staatliches'] text-base tracking-wider print:py-2"
        style={{ background: 'hsl(0 0% 6%)', color: 'hsl(120 50% 65%)' }}
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

const TestingSuiteDocs = () => {
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
          style={{ background: 'hsl(120 50% 40%)', color: 'hsl(0 0% 5%)' }}
        >
          <Download className="w-4 h-4" /> EXPORT PDF
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-['Staatliches'] text-3xl md:text-4xl text-center tracking-widest mb-2" style={{ color: 'hsl(120 50% 65%)' }}>
          TESTING SUITE DOCUMENTATION
        </h1>
        <p className="text-center font-['Space_Mono'] text-xs mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
          Technical reference • Vitest • 66+ automated tests • v2.0
        </p>

        <Section title="OVERVIEW">
          <p>The PharmBoi testing suite uses <strong>Vitest</strong> with TypeScript to validate core engine logic across four primary domains. Tests run via <code>bun run test</code> and execute in under 2 seconds.</p>
          <Code>{`# Run all tests
bun run test

# Run a specific test file
bunx vitest run src/test/soilCalculator.test.ts

# Watch mode
bunx vitest --watch`}</Code>
          <p><strong>Test runner:</strong> Vitest 3.x<br />
          <strong>Coverage domains:</strong> Soil calculation, Lunar phase, Crop-zone mapping, Instrument integrity<br />
          <strong>Total test count:</strong> 66+ unit tests across 7 files<br />
          <strong>Database:</strong> 1,684 crops across 7 Solfeggio zones (100% field population)<br />
          <strong>Crop Library:</strong> 19-column virtualized table (<code>@tanstack/react-virtual</code>) + 27-column CSV export<br />
          <strong>Performance:</strong> Row virtualization for zones &gt;30 crops, <code>React.memo()</code> on CropRow, print fallback for PDF<br />
          <strong>Data fields:</strong> All 6 AI-batch fields fully populated — growth_habit, scientific_name, planting_season, harvest_days, root_depth_inches, min_container_gal</p>
        </Section>

        <Section title="TEST FILE MAP">
          <Code>{`src/test/
├── setup.ts                    — Vitest setup (jsdom environment config)
├── soilCalculator.test.ts      — Soil Mix math & scaling (17 tests)
├── lunarPhase.test.ts          — Moon phase accuracy & gating (12 tests)
├── cropOracle.test.ts          — Zone mapping & chord intervals (11 tests)
├── zoneProtocol.test.ts        — Instrument mapping & octave integrity (8 tests)
├── jazzVoicingFungi.test.ts    — Fungi voicing recommendations
├── birthchart.test.ts          — Astro calculator validation
└── example.test.ts             — Smoke test`}</Code>
        </Section>

        <Section title="1 · SOIL CALCULATOR TESTS">
          <p><strong>File:</strong> <code>src/test/soilCalculator.test.ts</code></p>
          <p><strong>Purpose:</strong> Validates the Master Mix Protocol scaling, Pot Mix Recipe percentages, frequency zone definitions, harmonization rules, and unit formatting functions.</p>
          <Code>{`describe('Soil Calculator Constants')
  ✓ Master Mix has exactly 8 components
  ✓ base reference area is 150 sq ft (60ft × 2.5ft)
  ✓ all 7 frequency zones are defined
  ✓ each frequency zone has a mineral and soil note
  ✓ Pot Mix recipe totals 100%
  ✓ container sizes include standard 1-25 gallon + custom

describe('Soil Mix Scaling')
  ✓ scales Master Mix linearly by area ratio
  ✓ frequency boost doubles specific components
    → Validates 528Hz Solar zone boosts alfalfa & soybean 2×

describe('Harmonization Rules')
  ✓ has at least 5 dependency rules
  ✓ each rule references valid frequency zones
  ✓ 528Hz Solar depends on 396Hz Root

describe('formatQuantity')
  ✓ formats small amounts as tbsp
  ✓ formats sub-quart as cups
  ✓ formats 1+ as quarts

describe('formatVolume')
  ✓ formats small volumes as cups
  ✓ formats larger volumes as gallons`}</Code>
          <p><strong>Key assertion:</strong> The Master Mix scales linearly by area ratio. A 75 sq ft bed (half of the 150 sq ft reference) should yield exactly 0.5× of each component.</p>
        </Section>

        <Section title="2 · LUNAR PHASE TESTS">
          <p><strong>File:</strong> <code>src/test/lunarPhase.test.ts</code></p>
          <p><strong>Purpose:</strong> Ensures the moon phase calculator returns accurate phase labels, zodiac signs, planting type gates (leaf/fruit/root/harvest), and seasonal movement data.</p>
          <Code>{`describe('Lunar Phase Calculator')
  ✓ returns a valid phase object for today
  ✓ returns a valid zodiac sign (12 Western signs)
  ✓ returns a valid planting type (leaf|fruit|harvest|root)
  ✓ seasonal movement has valid structure (phase 0-3)
  ✓ returns consistent results for the same date

describe('isCropLunarReady')
  ✓ harvest phase accepts all crops
  ✓ leaf phase matches leafy greens
  ✓ root phase matches root crops
  ✓ fruit phase matches nightshades

describe('isZoneInSeason')
  ✓ cool octave allows 396Hz (Root zone)
  ✓ cool octave rejects 528Hz (Solar zone)
  ✓ solar peak allows 639Hz (Heart zone)
  ✓ inactive movement allows everything`}</Code>
          <p><strong>Key logic:</strong> The planting type gate uses a category-based matching system. <code>isCropLunarReady('nightshade', 'Tomato', 'fruit')</code> returns <code>true</code> because nightshades are fruit-bearing crops aligned with the fruit planting window.</p>
        </Section>

        <Section title="3 · CROP ORACLE TESTS">
          <p><strong>File:</strong> <code>src/test/cropOracle.test.ts</code></p>
          <p><strong>Purpose:</strong> Tests the pure logic of the Crop Oracle wizard: zone configuration, chord interval system, environment filtering, and pot spacing constraints.</p>
          <Code>{`describe('Crop Oracle Zone Configuration')
  ✓ all 7 zones have unique frequencies
  ✓ all zones have unique notes (C through B)
  ✓ all zones have a name, vibe, and color

describe('Chord Interval System')
  ✓ basic triad has 4 intervals (Root, 3rd, 5th, 7th)
  ✓ pro mode adds 3 more intervals (9th, 11th, 13th)
  ✓ each interval has a unique label and emoji

describe('Environment Configuration')
  ✓ has 5 environment options (pot, raised-bed, farm, high-tunnel, food-forest)
  ✓ pot max spacing is 12 inches

describe('Crop Filtering Logic')
  ✓ filters crops by frequency zone
  ✓ filters crops by chord interval
  ✓ pot mode filters out crops with spacing > 12"`}</Code>
          <p><strong>Key assertion:</strong> Pot mode excludes crops with spacing &gt; 12". This ensures container-inappropriate crops (e.g., Tomato at 24") are filtered out of the recipe builder.</p>
        </Section>

        <Section title="4 · ZONE PROTOCOL TESTS">
          <p><strong>File:</strong> <code>src/test/zoneProtocol.test.ts</code></p>
          <p><strong>Purpose:</strong> Validates the instrument-to-crop mapping integrity and verifies the 7-zone octave is complete and monotonically increasing.</p>
          <Code>{`describe('Zone Protocol Data Integrity')
  ✓ instrument mapping has entries for all major crop families
  ✓ each mapping has a valid instrument type
    → Valid: Electric Guitar, Percussion/Drums, Horn Section,
      Bass/Sub-Frequency, Synthesizers/Keys
  ✓ each mapping has frequency affinities within valid range
  ✓ each mapping has crops, a role, and a color (HSL format)

describe('7-Zone Octave Completeness')
  ✓ has exactly 7 zones
  ✓ frequencies increase monotonically (396→963)
  ✓ notes span C through B (the musical octave)`}</Code>
        </Section>

        <Section title="DATA CONTRACTS">
          <p>The tests enforce these critical data contracts:</p>
          <Code>{`┌──────────────────────┬─────────────────────────────────────┐
│ Contract             │ Enforcement                         │
├──────────────────────┼─────────────────────────────────────┤
│ 7 Solfeggio zones    │ Exact set: 396,417,528,639,741,     │
│                      │ 852,963                              │
├──────────────────────┼─────────────────────────────────────┤
│ Musical octave       │ Notes C→B in ascending Hz order      │
├──────────────────────┼─────────────────────────────────────┤
│ 8 soil components    │ Master Mix Protocol length = 8       │
├──────────────────────┼─────────────────────────────────────┤
│ 150 sq ft reference  │ BASE_AREA_SQ_FT = 150               │
├──────────────────────┼─────────────────────────────────────┤
│ Pot Mix = 100%       │ Sum of all percentages = 100         │
├──────────────────────┼─────────────────────────────────────┤
│ 4 planting types     │ leaf, fruit, harvest, root           │
├──────────────────────┼─────────────────────────────────────┤
│ 7 chord intervals    │ Root,3rd,5th,7th,9th,11th,13th      │
├──────────────────────┼─────────────────────────────────────┤
│ 5 environments       │ pot, raised-bed, farm, high-tunnel,  │
│                      │ food-forest                          │
├──────────────────────┼─────────────────────────────────────┤
│ Pot spacing limit    │ POT_MAX_SPACING = 12 inches          │
├──────────────────────┼─────────────────────────────────────┤
│ HSL color format     │ All zone colors match /^hsl\\(/       │
├──────────────────────┼─────────────────────────────────────┤
│ 16 growth habits     │ tree, shrub, bush, vine, herb, etc.  │
├──────────────────────┼─────────────────────────────────────┤
│ Canonical zone colors│ 7 hex values: #FF0000 → #8B00FF      │
├──────────────────────┼─────────────────────────────────────┤
│ 1,684 total crops    │ All zones populated, no gaps          │
└──────────────────────┴─────────────────────────────────────┘`}</Code>
        </Section>

        <Section title="EDGE FUNCTION TESTS">
          <p>The <code>populate-crop-data</code> edge function supports batch AI population for 6 fields:</p>
          <Code>{`Supported fields:
  growth_habit       — 16 plant habit categories
  scientific_name    — Binomial nomenclature (genus + species)
  planting_season    — Array of ["Spring", "Summer", "Fall", "Winter"]
  harvest_days       — Integer days to first harvest
  root_depth_inches  — Integer root depth in inches
  min_container_gal  — Numeric minimum container size in gallons

Each batch processes 50 crops using Lovable AI tool-calling.
Fields are populated only for crops where the value is NULL.
Status: All 6 fields are 100% populated across 1,684 crops.`}</Code>
        </Section>

        <Section title="ADDING NEW TESTS">
          <p>Follow this pattern to add tests for new features:</p>
          <Code>{`// src/test/myFeature.test.ts
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('does what it should', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedOutput);
  });
});

// Naming conventions:
// - Pure logic: [feature].test.ts
// - React components: [Component].test.tsx
// - Place all tests in src/test/`}</Code>
          <p><strong>Best practices:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Test pure functions, not React rendering</li>
            <li>Use mock data that mirrors the real database schema</li>
            <li>Validate data contracts (exact counts, valid ranges, required fields)</li>
            <li>Test boundary conditions (empty arrays, null inputs, edge frequencies)</li>
            <li>Include growth_habit and container sizing in crop fixture data</li>
          </ul>
        </Section>

        <Section title="CI / CD INTEGRATION">
          <Code>{`# package.json script
"test": "vitest run"

# Vitest config (vitest.config.ts)
- Uses vite.config.ts resolve aliases (@/ → src/)
- Runs in jsdom environment (via setup.ts)
- No coverage threshold configured (add as needed)

# Recommended CI step:
steps:
  - run: bun install
  - run: bun run test`}</Code>
        </Section>

        <p className="text-center font-['Space_Mono'] text-[10px] mt-8" style={{ color: 'hsl(0 0% 30%)' }}>
          PharmBoi Testing Suite Docs • v2.0 • {new Date().toISOString().split('T')[0]}
        </p>
      </main>
    </div>
  );
};

export default TestingSuiteDocs;
