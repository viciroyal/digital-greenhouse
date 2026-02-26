import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Collapsible Section ─── */
const Section = ({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl mb-3 overflow-hidden print:border-muted" style={{ borderColor: 'hsl(0 0% 20%)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-['Chewy'] text-lg print:py-2"
        style={{ background: 'hsl(0 0% 6%)', color: 'hsl(40 50% 95%)' }}
      >
        <span>{emoji} {title}</span>
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
            <div className="px-5 py-4 font-['Space_Mono'] text-sm leading-relaxed space-y-3 print:py-2" style={{ color: 'hsl(40 40% 80%)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Always render for print */}
      <div className="hidden print:block px-5 py-3 font-['Space_Mono'] text-sm leading-relaxed space-y-2" style={{ color: 'hsl(0 0% 20%)' }}>
        {children}
      </div>
    </div>
  );
};

const UserGuide = () => {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 4%)' }}>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:border-muted { border-color: #ccc !important; }
          .print\\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          * { color: #222 !important; background: white !important; }
        }
      `}</style>

      {/* Header */}
      <header className="no-print sticky top-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: 'hsl(0 0% 4% / 0.95)', borderBottom: '1px solid hsl(0 0% 15%)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-['Space_Mono'] text-xs" style={{ color: 'hsl(40 40% 70%)' }}>
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-['Space_Mono'] text-xs"
          style={{ background: 'hsl(350 75% 50%)', color: 'hsl(40 50% 95%)' }}
        >
          <Download className="w-4 h-4" /> EXPORT PDF
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-['Chewy'] text-3xl md:text-4xl text-center mb-2" style={{ color: 'hsl(40 50% 95%)' }}>
          🌿 PharmBoi User Guide
        </h1>
        <p className="text-center font-['Space_Mono'] text-sm mb-8" style={{ color: 'hsl(40 40% 60%)' }}>
          Everything you need to know — explained so a 5th grader can use it!
        </p>

        <Section title="What Is This App?" emoji="🤔">
          <p>PharmBoi is a <strong>garden planning tool</strong> that helps you figure out what to plant, where to plant it, and how to take care of your soil. Think of it like a recipe book — but for growing food!</p>
          <p>The app uses <strong>music ideas</strong> (like keys on a piano) to organize plants into groups called <strong>"Zones."</strong> Each zone has a color and a purpose, just like notes in a song work together.</p>
          <p>The registry contains <strong>2,188 crops</strong> across 7 Solfeggio frequency zones — from tomatoes and herbs to fruit trees and medicinal mushrooms. Every crop includes scientific names, growth habits, container sizing, root depth, hardiness zone data, and many have <strong>curated descriptions</strong> that appear when you hover over crop names.</p>
        </Section>

        <Section title="First Garden (Home Page)" emoji="🌱">
          <p>When you first open the app, you land on <strong>My First Garden</strong> — a friendly 5-step wizard that helps beginners pick their space, location, and first crops.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Step 1:</strong> Choose your space — Windowsill, Patio, Small Bed, or Big Yard</li>
            <li><strong>Step 2:</strong> Set your location and grow zone</li>
            <li><strong>Step 3-5:</strong> Follow the guided setup to get your first planting recipe</li>
          </ul>
          <p>Want to skip ahead? Tap <strong>"Skip to Advanced Studio →"</strong> at the bottom to jump straight to the Crop Oracle.</p>
        </Section>

        <Section title="The Stage (Landing Page)" emoji="🎤">
          <p>The <strong>Stage</strong> is the album-style landing page with artwork, music credits, and two entry buttons:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>🎵 Plant Seeds</strong> — Play the album</li>
            <li><strong>Enter the Garden</strong> — Go to the Crop Oracle</li>
          </ul>
          <p>You can always get back to The Stage by tapping the <strong>golden emblem</strong> in the bottom-left corner of any page.</p>
        </Section>

        <Section title="Growth Journal (Seed Tracker)" emoji="🌱">
          <p>The <strong>Growth Journal</strong> is the small seed icon in the top-left corner. It tracks your exploration progress as you visit different parts of the app.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The seed evolves through stages: <strong>Seed → Sprout → Sapling → Budding → Blooming → Flourishing</strong></li>
            <li>Your progress percentage is shown below the icon</li>
            <li>Tap the seed icon to open the <strong>Growth Journal</strong> panel — it shows which areas you've discovered</li>
            <li>New discoveries trigger a <strong>water droplet</strong> animation</li>
          </ul>
          <p>There are <strong>6 discoverable areas</strong>: First Garden, The Stage, Crop Oracle, Profile, User Guide, and playing music.</p>
        </Section>

        <Section title="Discovery Hints" emoji="🧭">
          <p><strong>Floating directional hints</strong> appear at the bottom of the screen, nudging you toward areas you haven't explored yet.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each hint shows which feature or page to visit next</li>
            <li>Tap the hint card to <strong>navigate directly</strong> to the suggested page</li>
            <li>Tap the <strong>✕</strong> button to dismiss a hint without navigating</li>
            <li>Hints auto-hide after 12 seconds and won't repeat once dismissed</li>
          </ul>
        </Section>

        <Section title="Sovereign Emblem & Progress Ring" emoji="🛡️">
          <p>The <strong>golden emblem</strong> in the bottom-left corner is your quick link back to The Stage. It also features a <strong>progress ring</strong> that fills as you discover more areas.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The ring fills from 0% to 100% as you explore</li>
            <li>When you reach <strong>100%</strong>, a celebration animation plays with golden particles and the tooltip changes to <strong>"✦ Fully Discovered"</strong></li>
            <li>Hover over the emblem to see a tooltip</li>
          </ul>
        </Section>

        <Section title="The Crop Oracle — Step by Step" emoji="🔮">
          <p>The Crop Oracle is a <strong>3-step wizard</strong> that builds a garden recipe for you.</p>
          <p><strong>Step 1: Pick Your Environment</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pot</strong> — For small containers on a patio or balcony</li>
            <li><strong>Raised Bed</strong> — Standard backyard garden boxes</li>
            <li><strong>Farm</strong> — Big fields with rows of crops (Pro Mode)</li>
            <li><strong>High Tunnel</strong> — A covered greenhouse structure (Pro Mode)</li>
            <li><strong>Food Forest</strong> — A multi-layer perennial ecosystem with fruit trees, berry bushes, and ground cover (Pro Mode)</li>
          </ul>
          <p><strong>Step 2: Pick Your Frequency (Key)</strong></p>
          <p>Choose a musical key (C through B). Each key maps to a frequency zone:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🔴 <strong>C = 396Hz (Foundation)</strong> — Root vegetables, grounding</li>
            <li>🟠 <strong>D = 417Hz (Flow)</strong> — Water-loving vines</li>
            <li>🟡 <strong>E = 528Hz (Alchemy)</strong> — Sun-powered growth crops</li>
            <li>🟢 <strong>F = 639Hz (Heart)</strong> — Leafy greens, community</li>
            <li>🔵 <strong>G = 741Hz (Signal)</strong> — Expression crops, herbs</li>
            <li>🟣 <strong>A = 852Hz (Vision)</strong> — Medicinal plants</li>
            <li>💜 <strong>B = 963Hz (Source)</strong> — Garlic, protective crops</li>
          </ul>
          <p><strong>Step 3: Your Recipe</strong></p>
          <p>The app builds a "chord" — a team of plants that work together:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🌟 <strong>The Star</strong> — Your main crop (the headliner)</li>
            <li>🌿 <strong>The Companion</strong> — Keeps pests away</li>
            <li>⚓ <strong>The Stabilizer</strong> — Feeds the soil</li>
            <li>🦋 <strong>The Signal</strong> — Attracts bees and butterflies</li>
          </ul>
          <p>You can <strong>lock</strong> any crop slot by clicking the 🔒 icon next to it. Locked crops stay put when you shuffle! Use <strong>LOCK ALL</strong> / <strong>UNLOCK ALL</strong> to manage all slots at once.</p>
        </Section>

        <Section title="Pro Mode (13th Chord)" emoji="🎹">
          <p>Toggle <strong>"Pro Mode"</strong> to unlock extra slots in your recipe:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🥔 <strong>The Underground</strong> — Root veggies beneath the surface</li>
            <li>🍄 <strong>The Sentinel</strong> — Fungi building underground networks</li>
            <li>🌻 <strong>The Aerial</strong> — Tall plants providing shade above</li>
          </ul>
          <p>Pro Mode gives you a complete 7-layer garden — like a jazz chord with all the notes!</p>
          <p>Pro Mode also unlocks the <strong>Farm</strong>, <strong>High Tunnel</strong>, and <strong>Food Forest</strong> environments.</p>
        </Section>

        <Section title="Food Forest Mode" emoji="🌳">
          <p>The <strong>Food Forest</strong> environment creates recipes using a layered perennial ecosystem model:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🌳 <strong>Canopy Tree</strong> — Fruit or nut trees forming the forest ceiling</li>
            <li>🫐 <strong>Understory</strong> — Berry bushes and small trees beneath the canopy</li>
            <li>🌱 <strong>N-Fixer</strong> — Nitrogen-fixing plants that feed the whole ecosystem</li>
            <li>🐝 <strong>Pollinator</strong> — Perennial flowers and herbs for beneficial insects</li>
            <li>🫚 <strong>Root Layer</strong> — Deep-rooted nutrient miners</li>
            <li>🍄 <strong>Fungal Net</strong> — Mycelial networks connecting trees underground</li>
            <li>🍇 <strong>Vine Layer</strong> — Climbing vines filling canopy gaps</li>
          </ul>
          <p>The system prioritizes perennial crops, fruit trees, and nitrogen-fixing understory plants automatically.</p>
        </Section>

        <Section title="Growth Habit Badges" emoji="🏷️">
          <p>Every crop shows a <strong>growth habit badge</strong> — a small colored pill that tells you what kind of plant it is:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>🌳 <strong>Tree</strong> — Large perennial plants (fruit trees, nut trees)</li>
            <li>🫐 <strong>Shrub</strong> — Berry bushes and small woody plants</li>
            <li>🧗 <strong>Vine</strong> — Climbing plants (grapes, passionflower, kiwi)</li>
            <li>🌱 <strong>Herb</strong> — Most vegetables and herbs</li>
            <li>🥕 <strong>Root</strong> / 🥔 <strong>Tuber</strong> / 🧄 <strong>Bulb</strong> — Underground crops</li>
            <li>🍄 <strong>Fungus</strong> — Mushrooms and mycelial organisms</li>
            <li>💧 <strong>Aquatic</strong> — Water-loving plants (watercress, rice)</li>
            <li>🌺 <strong>Epiphyte</strong> — Air plants that grow on other plants</li>
          </ul>
          <p>These badges help you quickly identify what kind of space each crop needs!</p>
        </Section>

        <Section title="Container Sizing" emoji="🪴">
          <p>All <strong>2,188 crops</strong> include <strong>root depth</strong> and <strong>minimum container size</strong> data:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Root Depth (inches)</strong> — How deep the roots go. Shallow herbs are 6-12", deep trees 36-72"+</li>
            <li><strong>Min Container (gallons)</strong> — The smallest pot that will work. Small herbs need 1-2 gal, trees need 15-25+ gal</li>
          </ul>
          <p>When you choose <strong>Pot</strong> environment, the app uses this data to filter out crops that won't fit!</p>
        </Section>

        <Section title="Setting a Star Crop" emoji="⭐">
          <p>Don't like the auto-picked main crop? Click <strong>"Pick Star"</strong> to search and choose your own favorite. The rest of the recipe will rebuild around your Star.</p>
        </Section>

        <Section title="Locking & Shuffling Crops" emoji="🔒">
          <p>Click the <strong>lock icon</strong> (🔒) next to any crop to <strong>pin it in place</strong>. When you hit <strong>SHUFFLE VOICING</strong>, only unlocked slots change — your locked favorites stay put!</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>LOCK ALL</strong> — Locks every slot (shuffle won't change anything)</li>
            <li><strong>UNLOCK ALL</strong> — Frees every slot for a full shuffle</li>
            <li>Lock 2 of 3 slots to experiment with just one position</li>
            <li>The shuffle counter shows how many slots are locked (e.g., "2 LOCKED")</li>
          </ul>
          <p>The shuffle algorithm maximizes diversity — it penalizes recently used plant families so you get fresh suggestions every time!</p>
        </Section>

        <Section title="Crop Descriptions & Tooltips" emoji="💬">
          <p><strong>Hover over any crop name</strong> in the recipe to see a tooltip with a description. Crops with curated descriptions show evocative 1-2 sentence profiles. Others display a metadata summary (scientific name, category, growth habit, dominant mineral).</p>
        </Section>

        <Section title="Swapping Crops" emoji="🔄">
          <p>Click <strong>"Swap"</strong> next to any crop slot to replace it with another option from the same zone. You can also hit <strong>"Reset"</strong> to undo all your changes.</p>
        </Section>

        <Section title="Saving Your Recipe" emoji="💾">
          <p>Log in with your account, then click <strong>"Save"</strong> to store your recipe. You can load saved recipes later from the <strong>📋 Saved Recipes</strong> panel.</p>
        </Section>

        <Section title="Changing Keys" emoji="🎵">
          <p>On the recipe screen, you'll see colored buttons labeled <strong>C through B</strong>. Tap any button to switch to a different zone. The recipe rebuilds instantly!</p>
        </Section>

        <Section title="Lunar Gate" emoji="🌙">
          <p>The app checks the <strong>moon phase</strong> and tells you what type of planting is best right now — leaves, fruits, roots, or harvest. Look for the moon icon on each crop card.</p>
        </Section>

        <Section title="Weather Alerts" emoji="🌡️">
          <p>If extreme weather is detected for your area, a warning banner appears at the top. It pulls real-time data so you know when to protect your plants.</p>
        </Section>

        <Section title="The Griot Oracle (AI Advisor)" emoji="🧙">
          <p>The <strong>Griot Oracle</strong> is an AI chat helper that floats in the corner. Ask it any question about your garden, soil, or crops. It knows all about the frequency zones and soil science!</p>
        </Section>

        <Section title="Music Player" emoji="🎶">
          <p>The mini music player at the bottom plays tracks from the PharmBoi album. Each track corresponds to a frequency zone — listen while you plan!</p>
        </Section>

        <Section title="Crop Library & CSV Export" emoji="📊">
          <p>Visit the <strong>Crop Library</strong> (/crop-library) to see all <strong>2,188 crops</strong> organized by frequency zone in a high-density, printable table.</p>
          <p><strong>Filters:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Search by name, family, mineral, or season</li>
            <li>Filter by frequency zone, category, or growth habit</li>
            <li>Filter by <strong>USDA Hardiness Zone</strong> — select your zone or state to see only crops that grow in your climate</li>
          </ul>
          <p><strong>CSV Export (27 columns):</strong> Download the full registry as a spreadsheet with all crop data including companions, descriptions, and hardiness zones.</p>
          <p><strong>Actions:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click <strong>"Export CSV"</strong> to download the full registry as a spreadsheet</li>
            <li>Click <strong>"Print / Export PDF"</strong> to save a printable reference</li>
            <li>Each crop displays its <strong>growth habit badge</strong> (🌳 Tree, 🌱 Herb, 🍄 Fungus, etc.)</li>
          </ul>
        </Section>

        <Section title="Quick Tips" emoji="💡">
          <ul className="list-disc pl-5 space-y-1">
            <li>Start with <strong>Raised Bed</strong> and <strong>Key of F (Heart/639Hz)</strong> if you're new — it's the friendliest zone!</li>
            <li>Try <strong>Food Forest</strong> mode if you want to plan a perennial garden with fruit trees!</li>
            <li>Use the <strong>search bar</strong> in swap mode to find specific crops fast</li>
            <li>Look for the <strong>growth habit badge</strong> to know if a crop is a tree, vine, herb, or fungus</li>
            <li>Check <strong>container size</strong> before picking crops for pots — not all crops fit in small containers!</li>
            <li>Companion badges (🤝) mean crops help each other — try to keep them!</li>
            <li>The 🌙 moon icon turns green when it's a good time to plant that crop</li>
            <li>Export your crop data as CSV from the <strong>Crop Library</strong> for offline planning</li>
          </ul>
        </Section>

        <p className="text-center font-['Space_Mono'] text-xs mt-8" style={{ color: 'hsl(0 0% 30%)' }}>
          PharmBoi User Guide • v4.0 • Artwork by Alyssa Best • © {new Date().getFullYear()} — The Charles Legend
        </p>
      </main>
    </div>
  );
};

export default UserGuide;
