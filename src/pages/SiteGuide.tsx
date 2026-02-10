import { motion } from 'framer-motion';
import { 
  BookOpen, Home, LogIn, Star, BarChart3, TreePine, Beaker, 
  Radio, Search, Music, Map, User, Shield, Download, 
  Mountain, Disc, ChevronLeft, Sprout, Zap, Moon, 
  Heart, Eye, Gem, Flame, Droplets, Sun as SunIcon, Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ZONE_TABLE = [
  { zone: 1, note: 'C', hz: '396 Hz', color: 'hsl(0 60% 50%)', name: 'Foundation', action: 'Root anchoring — add Phosphorus' },
  { zone: 2, note: 'D', hz: '417 Hz', color: 'hsl(30 70% 50%)', name: 'Flow', action: 'Water management — fungal networks' },
  { zone: 3, note: 'E', hz: '528 Hz', color: 'hsl(51 80% 50%)', name: 'Alchemy', action: 'Growth power — add Nitrogen' },
  { zone: 4, note: 'F', hz: '639 Hz', color: 'hsl(120 50% 45%)', name: 'Heart', action: 'Connect plant guilds — Calcium' },
  { zone: 5, note: 'G', hz: '741 Hz', color: 'hsl(210 60% 50%)', name: 'Signal', action: 'Check Brix quality (12-24 target)' },
  { zone: 6, note: 'A', hz: '852 Hz', color: 'hsl(270 50% 50%)', name: 'Vision', action: 'Medicinal plant monitoring' },
  { zone: 7, note: 'B', hz: '963 Hz', color: 'hsl(300 50% 50%)', name: 'Source', action: 'Garlic/Onion protection shield' },
];

const GLOSSARY = [
  { term: 'Brix', def: 'A number (0–24) measuring plant nutrition via sugar content. Higher = healthier.' },
  { term: 'Hz / Frequency', def: 'Each zone has a musical frequency. It organizes crops by biological function.' },
  { term: 'Chord', def: 'A group of 7 plants that work together, like musical notes in harmony.' },
  { term: 'Interval', def: 'The role a plant plays in the chord (1st, 3rd, 5th, 7th, 9th, 11th, 13th).' },
  { term: 'Guild', def: 'Plants that help each other grow when planted side by side.' },
  { term: 'Master Mix', def: 'The core soil recipe — 5 quarts per 60-foot bed.' },
  { term: 'Refractometer', def: 'A handheld tool that measures Brix by looking at a leaf\'s juice.' },
  { term: 'NIR Spectroscopy', def: 'Advanced lab tool for measuring nutrient density.' },
  { term: 'Solfeggio', def: 'Ancient musical frequencies (396, 417, 528, 639, 741, 852, 963 Hz).' },
  { term: 'CSA', def: 'Community Supported Agriculture — a subscription farming model.' },
  { term: 'Three Sisters', def: 'Ancient Native American polyculture: Corn + Beans + Squash.' },
  { term: 'Mycelium', def: 'Underground fungal network that connects plant roots like an internet.' },
  { term: 'Cowries', def: 'Points earned through progress in the system.' },
];

interface SectionProps {
  icon: React.ReactNode;
  route: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Section = ({ icon, route, title, subtitle, children }: SectionProps) => (
  <AccordionItem value={route} className="border rounded-xl mb-3 overflow-hidden" style={{ 
    borderColor: 'hsl(0 0% 100% / 0.08)',
    background: 'hsl(0 0% 100% / 0.03)',
  }}>
    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
          background: 'hsl(45 60% 55% / 0.15)',
          border: '1px solid hsl(45 60% 55% / 0.3)',
        }}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm tracking-wide" style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(45 60% 75%)' }}>
            {title}
          </h3>
          <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>{subtitle}</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-4 pb-4">
      <div className="text-xs leading-relaxed space-y-3 pt-2" style={{ color: 'hsl(0 0% 65%)', fontFamily: "'Space Mono', monospace" }}>
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'hsl(45 60% 65%)' }}>{children}</span>
);

const SubHead = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-[11px] tracking-widest mt-3 mb-1" style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(45 60% 55%)' }}>
    {children}
  </h4>
);

const SiteGuide = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 4%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3" style={{
        background: 'hsl(0 0% 4% / 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
      }}>
        <Link to="/" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5" style={{ color: 'hsl(0 0% 50%)' }} />
        </Link>
        <BookOpen className="w-5 h-5" style={{ color: 'hsl(45 60% 55%)' }} />
        <h1 className="text-lg tracking-wider" style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(45 60% 75%)' }}>
          THE PHARMBOI FIELD MANUAL
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <motion.div
          className="p-4 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(45 30% 8%), hsl(30 20% 6%))',
            border: '1px solid hsl(45 60% 55% / 0.15)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-mono mb-2" style={{ color: 'hsl(45 60% 55%)' }}>
            YOUR COMPLETE GUIDE TO EVERY PAGE, TAB & FUNCTION
          </p>
          <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
            Written so a 5th grader can use every feature like a pro
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          className="p-4 rounded-xl"
          style={{ background: 'hsl(120 30% 8%)', border: '1px solid hsl(120 40% 30% / 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SubHead>🚀 QUICK START — YOUR FIRST 7 STEPS</SubHead>
          <ol className="list-decimal list-inside text-[11px] space-y-1.5 font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
            <li><Highlight>Sign up</Highlight> at the Auth page</li>
            <li>Do your <Highlight>Star Mapping</Highlight> → get your Resonance Report</li>
            <li>Open the <Highlight>Ancestral Path</Highlight> → Read Chapter I → Complete lessons</li>
            <li>Check the <Highlight>Field Almanac</Highlight> → Learn the Master Mix recipe</li>
            <li>Go to the <Highlight>Crop Oracle</Highlight> → Search a crop → See its zone & companions</li>
            <li>Open the <Highlight>Conductor</Highlight> → Click a bed → See what's planted</li>
            <li>Write in your <Highlight>Journal</Highlight> → Reflect on what you learned</li>
          </ol>
        </motion.div>

        {/* The 7 Zones Reference */}
        <motion.div
          className="p-4 rounded-xl"
          style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 100% / 0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <SubHead>🌈 THE 7 FREQUENCY ZONES</SubHead>
          <p className="text-[10px] font-mono mb-3" style={{ color: 'hsl(0 0% 45%)' }}>
            Every plant, task, and soil recipe is organized by these 7 musical notes
          </p>
          <div className="space-y-1.5">
            {ZONE_TABLE.map(z => (
              <div key={z.zone} className="flex items-center gap-2 text-[10px] font-mono">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: z.color }} />
                <span style={{ color: z.color, minWidth: '70px' }}>{z.note} / {z.hz}</span>
                <span style={{ color: 'hsl(0 0% 55%)', minWidth: '70px' }}>{z.name}</span>
                <span style={{ color: 'hsl(0 0% 40%)' }}>— {z.action}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Page-by-Page Guide */}
        <div>
          <h2 className="text-sm tracking-[0.2em] mb-3 font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
            PAGE-BY-PAGE GUIDE
          </h2>

          <Accordion type="multiple" className="space-y-0">
            <Section icon={<Home className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/" title="HOME PAGE" subtitle="/">
              <p>The front door — like a record album cover. You'll see the PharmBoi artwork, branding, and navigation links to every part of the site. Start here to explore.</p>
            </Section>

            <Section icon={<LogIn className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/auth" title="SIGN IN" subtitle="/auth">
              <p><Highlight>Sign Up</Highlight> with your email to create an account. <Highlight>Log In</Highlight> to access your personal progress, journal, and farm data. Without logging in, features like saving Brix readings won't work.</p>
            </Section>

            <Section icon={<Star className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/star-mapping" title="STAR MAPPING" subtitle="/star-mapping">
              <p>Your cosmic fingerprint based on when and where you were born.</p>
              <SubHead>HOW TO USE</SubHead>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter your <Highlight>full name</Highlight>, <Highlight>birth date</Highlight>, <Highlight>birth time</Highlight> (AM/PM), and <Highlight>city/state</Highlight></li>
                <li>The button glows gold once all fields are filled</li>
                <li>Click <Highlight>"CALCULATE RESONANCE"</Highlight> to generate your star map</li>
                <li>Your results show which frequency zones align with your birth chart</li>
              </ol>
              <p className="mt-2">Think of it as: "Based on your stars, here's where you'd shine brightest in the garden."</p>
            </Section>

            <Section icon={<BarChart3 className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/resonance-report" title="RESONANCE REPORT" subtitle="/resonance-report">
              <p>Your personal results after Star Mapping. View which of the 7 frequency zones align with your birth chart, and see crop/task recommendations suited to your cosmic energy.</p>
            </Section>

            <Section icon={<TreePine className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/ancestral-path" title="THE ANCESTRAL PATH" subtitle="/ancestral-path — Theory / Learning">
              <p>The <Highlight>THEORY / LEARNING</Highlight> side — your textbook and journal. One half of the dual-pillar system.</p>

              <SubHead>📜 THE LIVING ALMANAC (CHAPTERS)</SubHead>
              <p>Organized into Roman numeral chapters (I, II, III…). Each teaches a concept: soil biology, composting, planting guilds, seed saving. Chapters <Highlight>unlock sequentially</Highlight> — finish I to unlock II. Locked chapters shake when tapped.</p>

              <SubHead>🌡️ SAP RISE PROGRESS</SubHead>
              <p>Top-left thermometer showing curriculum progress. Fills up as you complete lessons. Goal: fill it to the top.</p>

              <SubHead>📓 JOURNAL VIEW</SubHead>
              <p>Personal reflection space. Write about what you observed in the garden. Prompts guide you through soil, weather, plants, and feelings.</p>

              <SubHead>🗺️ SOVEREIGNTY MAP</SubHead>
              <p>Visual ecosystem that grows as you do. Five layers light up as you log observations: Root (Soil), Flow (Water), Fire (Growth), Gold (Harvest), Seed (Legacy).</p>

              <SubHead>🧰 STEWARD'S UTILITY BELT</SubHead>
              <p>Fixed bottom bar with 5 culturally-rooted tools:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><Highlight>🧭 THE COMPASS</Highlight> (Polynesian) — Calendars & strategy</li>
                <li><Highlight>🛡️ THE SHIELD</Highlight> (Maasai) — Pest defense protocols</li>
                <li><Highlight>🎵 THE KORA</Highlight> (West African) — Storytelling & marketing</li>
                <li><Highlight>⚗️ THE MORTAR</Highlight> (Cherokee/Gullah) — Herbal recipes + Gullah Pot</li>
                <li><Highlight>🏺 THE KIVA</Highlight> (Hopi) — Seed inventory & saving</li>
              </ul>

              <SubHead>🔄 SCALE TOGGLE</SubHead>
              <p><Highlight>Seed</Highlight> = Beginner (simplest) | <Highlight>Sprout</Highlight> = Intermediate | <Highlight>Canopy</Highlight> = Advanced (full technical detail)</p>
            </Section>

            <Section icon={<Beaker className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/field-almanac" title="THE FIELD ALMANAC" subtitle="/field-almanac — Action / Utility">
              <p>The <Highlight>ACTION / UTILITY</Highlight> side — your recipe book and toolkit.</p>

              <SubHead>🧫 MASTER MIX (SOIL RECIPE)</SubHead>
              <p>5 quarts per 60-foot bed. "Tuning the instrument" — resets soil to Middle C (396Hz). Ingredients: worm castings, compost, kelp, minerals.</p>

              <SubHead>📏 BRIX VALIDATOR</SubHead>
              <p>Measures plant nutrition with a refractometer:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>🔴 <Highlight>Below 12</Highlight> = "Dissonant" (needs help)</li>
                <li>🟢 <Highlight>12–17</Highlight> = "In Tune" (good!)</li>
                <li>🥇 <Highlight>18–24</Highlight> = "High Fidelity" (exceptional!)</li>
              </ul>
              <p className="mt-1">You MUST check "White Reference Calibrated" before saving — ensures accuracy.</p>

              <SubHead>🌿 BEGINNER'S FIELD GUIDE</SubHead>
              <p>Simplified version for new users. Plain-language explanations of what to do and when.</p>
            </Section>

            <Section icon={<Radio className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/conductor" title="THE AGROMAJIC CONDUCTOR" subtitle="/conductor — Operations Hub">
              <p>Mission control for managing all <Highlight>44 garden beds</Highlight> in real time.</p>

              <SubHead>🟥 BED GRID</SubHead>
              <p>Visual grid of all 44 beds, color-coded by frequency zone. Click any bed for details.</p>

              <SubHead>🎵 CHORD SHEET</SubHead>
              <p>Each bed's current "chord" — which crops are planted and how they harmonize. Shows Tone (Hz), Master Mix recipe, and Voicing Density.</p>

              <SubHead>⚠️ DISSONANCE WARNING</SubHead>
              <p>Fires if you plant a wrong-zone crop. Animated frequency clash visuals. <Highlight>Jazz Mode toggle</Highlight> allows valid cross-zone companion planting (advanced).</p>

              <SubHead>📋 BED DETAIL PANEL</SubHead>
              <p>Click a bed to see: current plantings by interval, Brix readings, notes. Width: 30 inches (2.5 ft).</p>

              <SubHead>🏛️ SEVEN PILLARS SIDEBAR</SubHead>
              <p>7 physical farm infrastructure stations: Compost Vortex, Entrance, Solar/Irrigation, Pavilion, Wash/Pack, Tool Shed, Perimeter Shield.</p>
            </Section>

            <Section icon={<Search className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/crop-oracle" title="THE CROP ORACLE" subtitle="/crop-oracle — Intelligence Hub">
              <p>The research library and crop encyclopedia. 487 crops in the database.</p>

              <SubHead>ICON TOOLBAR</SubHead>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><Highlight>🌿 Leaf</Highlight> — Crop Profile (detailed info card)</li>
                <li><Highlight>👥 Users</Highlight> — Unified Guild (companions by chord interval)</li>
                <li><Highlight>🎵 Music</Highlight> — Compose (build your own 7-voice chord)</li>
                <li><Highlight>🌙 Moon</Highlight> — Timing (Lunar Gate + Seasonal Movements)</li>
                <li><Highlight>📐 Grid</Highlight> — Beds (organize crops into beds)</li>
                <li><Highlight>📏 Ruler</Highlight> — Strum (bed visualizer)</li>
              </ul>

              <SubHead>🌿 CROP PROFILE</SubHead>
              <p>Search any crop. See: name, zone, element, Brix targets, spacing, harvest days, guild role, instrument type.</p>
              <p><Highlight>Beginner/Pro toggle:</Highlight> Easy = common names & basics. Pro = full Hz, minerals, Brix targets.</p>

              <SubHead>👥 UNIFIED GUILD (MERGED VIEW)</SubHead>
              <p>Combined Harmonic Matrix + Companion Guild. Companions organized into 7 chord interval slots:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><Highlight>1st (Root)</Highlight> — Primary canopy crop</li>
                <li><Highlight>3rd (Triad)</Highlight> — Understory aromatics / trap crops</li>
                <li><Highlight>5th (Stabilizer)</Highlight> — Ground cover / nitrogen fixers</li>
                <li><Highlight>7th (Signal)</Highlight> — Pollinators / perimeter flowers</li>
                <li><Highlight>9th (Sub-bass)</Highlight> — Underground tubers</li>
                <li><Highlight>11th (Tension)</Highlight> — Sentinel alliums / fungi</li>
                <li><Highlight>13th (Top Note)</Highlight> — Aerial vines</li>
              </ul>

              <SubHead>🎵 COMPOSE</SubHead>
              <p>Build a custom 7-voice recipe for a specific bed. System calculates plant counts based on 30" bed width & spacing.</p>

              <SubHead>🌙 TIMING</SubHead>
              <p><Highlight>Lunar Gate:</Highlight> Current moon phase → optimal crop types (Waxing = Leaf, Full = Fruit, Waning = Root).</p>
              <p><Highlight>Seasonal Movements:</Highlight> 3 CSA phases — Cool Octave (Apr–May), Solar Peak (Jun–Aug), Harvest Signal (Aug–Oct).</p>
            </Section>

            <Section icon={<Music className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/chord-recipes" title="CHORD RECIPE GALLERY" subtitle="/chord-recipes — Greatest Hits">
              <p>Pre-made "Greatest Hits" planting recipes — one for each of the 7 zones. Each maps all 7 interval slots to specific crops. Think of these as "starter playlists" you can plant directly into a bed.</p>
            </Section>

            <Section icon={<Map className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/master-build" title="MASTER BUILD" subtitle="/master-build — Full Blueprint">
              <p>The advanced construction view with: <Highlight>Bed Map</Highlight> (spatial layout), <Highlight>Mixing Desk</Highlight> (adjust parameters), <Highlight>Seasonal Movements</Highlight> (3-phase CSA calendar), <Highlight>Artist Tracklist</Highlight> (full crop listing), and <Highlight>Transpose Toggle</Highlight>.</p>
            </Section>

            <Section icon={<Disc className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/liner-notes" title="LINER NOTES" subtitle="/liner-notes — Track Breakdowns">
              <p>Like the liner notes inside a vinyl record sleeve. Deep-dive into each "track" (crop/zone combination) with the <Highlight>Fidelity Meter</Highlight> quality score and the story behind each planting decision.</p>
            </Section>

            <Section icon={<User className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/pharmer-profile" title="PHARMER PROFILE" subtitle="/pharmer-profile — Your Stats">
              <p>Your personal dashboard.</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><Highlight>Songs Sung</Highlight> — Total bed resets completed</li>
                <li><Highlight>Resonance Score</Highlight> — Rolling 7-day Brix average</li>
                <li><Highlight>High Fidelity Badge</Highlight> — Awarded if average Brix ≥ 12</li>
                <li><Highlight>Farm Team Mode</Highlight> — Rocky (Infrastructure), River (Irrigation), Sunny (Planting), Spirit (Journaling)</li>
              </ul>
            </Section>

            <Section icon={<Shield className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/hogon-review" title="HOGON REVIEW" subtitle="/hogon-review — Elder Review">
              <p>Admin/elder review page where submitted field journal entries are reviewed for quality. Approve or give feedback on steward observations.</p>
            </Section>

            <Section icon={<Download className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/crop-export" title="CROP EXPORT" subtitle="/crop-export — Download Data">
              <p>Download the full 463-crop master registry as CSV. Includes all technical metadata, frequency assignments, botanical instruments, and companion arrays.</p>
            </Section>

            <Section icon={<Mountain className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />} route="/ascension-map" title="ASCENSION MAP" subtitle="/ascension-map — Curriculum Journey">
              <p>Visual demo of the full curriculum journey as a climbing path through the levels.</p>
            </Section>
          </Accordion>
        </div>

        {/* Glossary */}
        <motion.div
          className="p-4 rounded-xl"
          style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 100% / 0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SubHead>🔑 KEY CONCEPTS GLOSSARY</SubHead>
          <div className="space-y-2 mt-2">
            {GLOSSARY.map(g => (
              <div key={g.term} className="text-[10px] font-mono">
                <Highlight>{g.term}</Highlight>
                <span style={{ color: 'hsl(0 0% 40%)' }}> — {g.def}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 25%)' }}>
            THE PHARMBOI FIELD MANUAL • ALL DATA SOVEREIGN PROPERTY OF THE STEWARD
          </p>
        </div>
      </div>
    </div>
  );
};

export default SiteGuide;
