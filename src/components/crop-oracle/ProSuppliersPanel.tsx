import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, FlaskConical, Bug, Shovel, ExternalLink, Globe } from 'lucide-react';

interface ProSuppliersPanelProps {
  zoneColor: string;
  zoneName: string;
}

type Category = 'gaLocal' | 'seeds' | 'irrigation' | 'soilLabs' | 'inputs' | 'biocontrol';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'gaLocal', label: 'GA LOCAL', icon: <Globe className="w-3.5 h-3.5" />, color: 'hsl(340 55% 55%)' },
  { id: 'seeds', label: 'SEEDS & STARTS', icon: <Shovel className="w-3.5 h-3.5" />, color: 'hsl(80 50% 50%)' },
  { id: 'irrigation', label: 'IRRIGATION & DRIP', icon: <Droplets className="w-3.5 h-3.5" />, color: 'hsl(200 55% 50%)' },
  { id: 'soilLabs', label: 'SOIL TESTING LABS', icon: <FlaskConical className="w-3.5 h-3.5" />, color: 'hsl(45 60% 55%)' },
  { id: 'inputs', label: 'ORGANIC INPUTS', icon: <Shovel className="w-3.5 h-3.5" />, color: 'hsl(120 40% 50%)' },
  { id: 'biocontrol', label: 'BIOCONTROL & IPM', icon: <Bug className="w-3.5 h-3.5" />, color: 'hsl(160 50% 50%)' },
];

const SUPPLIERS: Record<Category, { name: string; url: string; note: string; specialty: string }[]> = {
  gaLocal: [
    { name: 'Georgia Organics', url: 'https://georgiaorganics.org', note: 'Farmer services, grants, accelerator program & local food network', specialty: 'GA farmer hub' },
    { name: 'Rodale Institute SE', url: 'https://rodaleinstitute.org/about/facilities-and-campuses/regional-resource-centers/southeast-organic-center/', note: 'Southeast Organic Center in Chattahoochee Hills — research & education', specialty: 'Organic research' },
    { name: 'EcoGEM Atlanta', url: 'https://www.eco-gem.com/gypsum-atlanta-ga/', note: 'OMRI-certified gypsum, soil conditioner for regenerative & organic ag', specialty: 'Gypsum & calcium' },
    { name: 'Food Well Alliance', url: 'https://www.foodwellalliance.org', note: 'Community garden grants, compost deliveries, workshops in metro ATL', specialty: 'ATL gardens' },
    { name: 'UGA Extension', url: 'https://extension.uga.edu', note: 'Free soil testing, pest ID, and county-specific growing guides for GA', specialty: 'Free soil tests' },
    { name: 'Levity Farms', url: 'https://www.levityfarms.com', note: 'Local GA farm offering CSA shares — support regenerative land stewards', specialty: 'GA CSA' },
  ],
  seeds: [
    { name: 'Georgia Seed & Garden', url: 'https://georgiaseeds.com', note: 'GA-specific growing instructions with heirloom & open-pollinated seed', specialty: 'GA heirloom' },
    { name: 'Southern Exposure Seed Exchange', url: 'https://www.southernexposure.com', note: 'Heritage & heirloom varieties bred for the South — seed saving focus', specialty: 'Southern heritage' },
    { name: 'Sow True Seed', url: 'https://sowtrueseed.com', note: 'Appalachian-based, open-pollinated & organic seed for SE climate', specialty: 'SE organic seed' },
    { name: 'Seed Savers Exchange', url: 'https://www.seedsavers.org', note: 'Heirloom seed library — preserving 20,000+ rare & heritage varieties', specialty: 'Seed sovereignty' },
    { name: 'Fruition Seeds', url: 'https://www.fruitionseeds.com', note: 'Organic seeds with detailed growing guides & variety trial data', specialty: 'Growing guides' },
  ],
  irrigation: [
    { name: 'DripWorks', url: 'https://www.dripworks.com', note: 'Full drip irrigation kits, timers & fittings', specialty: 'Drip systems' },
    { name: 'Drip Depot', url: 'https://www.dripdepot.com', note: 'Affordable drip tape, emitters & micro-sprinklers', specialty: 'Budget drip' },
    { name: 'Jain Irrigation', url: 'https://www.jainsusa.com', note: 'Commercial-grade drip tape & micro-irrigation', specialty: 'Farm scale' },
    { name: 'Netafim', url: 'https://www.netafimusa.com', note: 'Precision drip irrigation for high tunnel & field', specialty: 'Precision ag' },
  ],
  soilLabs: [
    { name: 'Logan Labs', url: 'https://www.loganlabs.com', note: 'Standard & Mehlich-3 soil tests, tissue analysis', specialty: 'Mineral balancing' },
    { name: 'A&L Great Lakes', url: 'https://www.algreatlakes.com', note: 'Comprehensive soil, plant tissue & water testing', specialty: 'Full spectrum' },
    { name: 'Earthfort (formerly SFI)', url: 'https://earthfort.com', note: 'Soil food web / biological assay — bacteria, fungi ratios', specialty: 'Biology testing' },
    { name: 'Ward Labs', url: 'https://www.wardlab.com', note: 'Affordable baseline soil & water tests', specialty: 'Budget testing' },
  ],
  inputs: [
    { name: 'Seven Springs Farm', url: 'https://www.7springsfarm.com', note: 'Minerals, foliar sprays, bio-stimulants, fish hydrolysate', specialty: 'Mineral programs' },
    { name: 'Build-A-Soil', url: 'https://www.buildasoil.com', note: 'Living soil kits, worm castings, cover crop seed, amendments', specialty: 'Living soil' },
    { name: 'Fedco OGS', url: 'https://www.fedcoseeds.com/ogs', note: 'OMRI-listed organic fertilizers & amendments, bulk pricing', specialty: 'Northeast supply' },
    { name: 'KIS Organics', url: 'https://www.kisorganics.com', note: 'Biochar, nutrient packs, water-only soil mixes', specialty: 'No-till soil' },
    { name: 'Redmond Minerals', url: 'https://www.redmond.life', note: 'Real Salt, volcanic conditioner, trace mineral clay', specialty: 'Trace minerals' },
  ],
  biocontrol: [
    { name: 'Arbico Organics', url: 'https://www.arbico-organics.com', note: 'Beneficial insects, nematodes, organic pest control', specialty: 'Full IPM catalog' },
    { name: 'Koppert Biological', url: 'https://www.koppert.com', note: 'Commercial biocontrol — predatory mites, parasitic wasps', specialty: 'Commercial IPM' },
    { name: 'Insect Lore / BIOLINE', url: 'https://www.biolineagrosciences.com', note: 'Greenhouse-grade biocontrol for high tunnel production', specialty: 'High tunnel IPM' },
    { name: 'Peaceful Valley (PVFS)', url: 'https://www.groworganic.com', note: 'Beneficial insects, organic sprays, cover crop seed', specialty: 'Organic supply' },
  ],
};

const ProSuppliersPanel = ({ zoneColor, zoneName }: ProSuppliersPanelProps) => {
  const [open, setOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('irrigation');

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5%)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left"
      >
        <Shovel className="w-4 h-4" style={{ color: `${zoneColor}90` }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}bb` }}>
          PRO SUPPLIERS & RESOURCES — {zoneName.toUpperCase()}
        </span>
        <ChevronDown
          className="w-3 h-3 ml-auto transition-transform"
          style={{
            color: 'hsl(0 0% 35%)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid hsl(0 0% 10%)' }}>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wide transition-all"
                      style={{
                        background: isActive ? `${cat.color}15` : 'hsl(0 0% 7%)',
                        border: `1.5px solid ${isActive ? cat.color : 'hsl(0 0% 15%)'}`,
                        color: isActive ? cat.color : 'hsl(0 0% 45%)',
                        boxShadow: isActive ? `0 0 10px ${cat.color}15` : 'none',
                      }}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Supplier cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {SUPPLIERS[activeCategory].map(supplier => {
                    const catColor = CATEGORIES.find(c => c.id === activeCategory)?.color || 'hsl(0 0% 60%)';
                    return (
                      <a
                        key={supplier.name}
                        href={supplier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group px-3 py-2.5 rounded-lg transition-all hover:scale-[1.01]"
                        style={{
                          background: 'hsl(0 0% 7%)',
                          border: '1px solid hsl(0 0% 14%)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold" style={{ color: catColor }}>
                            {supplier.name}
                          </span>
                          <ExternalLink
                            className="w-2.5 h-2.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: 'hsl(0 0% 40%)' }}
                          />
                        </div>
                        <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                          {supplier.note}
                        </p>
                        <span
                          className="inline-block mt-1 px-1.5 py-0.5 rounded text-[7px] font-mono"
                          style={{
                            background: `${catColor}10`,
                            color: `${catColor}`,
                            border: `1px solid ${catColor}25`,
                          }}
                        >
                          {supplier.specialty}
                        </span>
                      </a>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pro tip */}
              <div className="p-2.5 rounded-lg" style={{ background: 'hsl(45 20% 8%)', border: '1px solid hsl(45 30% 18%)' }}>
                <span className="text-[9px] font-mono tracking-widest block mb-1" style={{ color: 'hsl(45 60% 55%)' }}>
                  💡 PRO TIP
                </span>
                <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                  Get a soil test from Logan Labs or Earthfort <span className="font-bold">before</span> ordering amendments.
                  Match your inputs to actual deficiencies — not guesswork. A $30 test can save $300 in wrong amendments.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProSuppliersPanel;
