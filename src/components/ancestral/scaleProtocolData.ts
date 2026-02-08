import { AccessScale } from './ScaleToggle';

/**
 * SCALE-ADAPTIVE PROTOCOL DATA
 * 
 * The Fractal Law: Science applies at every scale, but Tools change based on Access.
 * Each protocol adapts its tools and methods while preserving the core science.
 */

export interface ScaledProtocolStep {
  step: number;
  title: string;
  description?: string;
  tool?: string;
  action?: string;
  source?: string;
}

export interface ScaleProtocolConfig {
  science: string;
  steps: Record<AccessScale, ScaledProtocolStep[]>;
}

// Level 0: VORTEX/EARTH STAR - "The Battery of the Soil"
export const level0Protocol: ScaleProtocolConfig = {
  science: "Biochar is the coral reef of the soil. It provides the housing for the microbes. Without the house, the biology cannot stay. CEC (Cation Exchange Capacity) measures the soil's nutrient-holding power.",
  steps: {
    canopy: [
      { step: 1, title: 'Build the Carbon Kiln', tool: 'TLUD Kiln or Cone Pit', action: 'Stack bamboo scraps in pyramid. Light from top. Pyrolyze at 400-500°C for 3 hours.' },
      { step: 2, title: 'Quench the charcoal', tool: 'Water + Hose', action: 'Spray until steam stops. Crush to 1-inch chunks max. Never use dry — it steals nutrients.' },
      { step: 3, title: 'Inoculate with biology', tool: 'Compost Tea + JADAM JLF', action: 'Soak biochar in compost tea for 24-48 hours. The char is now "charged" with microbes.' },
      { step: 4, title: 'Apply to soil', tool: 'Wheelbarrow + Shovel', action: 'Top-dress at 5-10% by volume. Do not bury deep — keep in root zone.' },
    ],
    sprout: [
      { step: 1, title: 'Build the Hot Pile', tool: 'Pitchfork + Thermometer', source: 'Garden center', action: 'Layer Green (Nitrogen) and Brown (Carbon) 1:3. Add water until it drips when squeezed.' },
      { step: 2, title: 'Turn when hot', tool: 'Compost Thermometer', action: 'Turn the pile when it reaches 140°F (60°C). This kills pathogens and weed seeds.' },
      { step: 3, title: 'Add charcoal scraps', tool: 'BBQ Charcoal (lump, no additives)', source: 'Hardware store', action: 'Crush and mix in. The charcoal charges as the pile cooks.' },
      { step: 4, title: 'Apply finished compost', tool: 'Wheelbarrow', action: 'After 4-8 weeks, apply 2-inch layer to beds. The biochar-compost is your Terra Preta.' },
    ],
    seed: [
      { step: 1, title: 'Build the Worm Hotel', tool: 'Plastic Bin + Newspaper', source: 'Kitchen scavenger', action: 'Drill holes in bin. Layer damp newspaper. Add Red Wiggler worms (1 lb per sq ft).' },
      { step: 2, title: 'Feed the guests', tool: 'Kitchen Scraps', source: 'Kitchen', action: 'Add fruit/veggie scraps. No citrus, onion, or meat. Bury food under bedding.' },
      { step: 3, title: 'Harvest the castings', tool: 'Light + Patience', action: 'Shine light on bin. Worms dive down. Scoop castings from top. This is Xingu Gold.' },
      { step: 4, title: 'Top-dress your pots', tool: 'Your Hands', action: 'Sprinkle castings on soil surface. Water in. The CEC of your pot just tripled.' },
    ],
  },
};

// Level 1: ROOT/STRUCTURE - "Don't invert the soil layers"
export const level1Protocol: ScaleProtocolConfig = {
  science: "Don't invert the soil layers. Aerobic life lives on top, anaerobic below. Mixing kills both.",
  steps: {
    canopy: [
      { step: 1, title: 'Assess soil compaction', tool: 'Penetrometer', action: 'Test at 3 depths (6", 12", 18")' },
      { step: 2, title: 'Broadfork the hardpan', tool: 'Broadfork', action: 'Step, hinge, and crack every 12 inches. No inversion.' },
      { step: 3, title: 'Plant bio-drills', tool: 'Daikon Radish Seed', action: 'Broadcast at 10 lbs/acre. Let winter-kill.' },
      { step: 4, title: 'Apply kelp meal', tool: 'Kelp Meal (50 lb bag)', source: 'Farm supply', action: 'Side-dress at root zone, 200 lbs/acre.' },
    ],
    sprout: [
      { step: 1, title: 'Test compaction by hand', tool: 'Garden Fork', action: 'Push down. If it stops at 6", you have a problem.' },
      { step: 2, title: 'Aerate the bed', tool: 'Garden Fork', action: 'Insert vertical, wiggle back and forth. Do not flip the soil.' },
      { step: 3, title: 'Plant bio-drills', tool: 'Daikon Radish Seeds', source: 'Garden center', action: 'Direct sow in fall. Let them rot in place.' },
      { step: 4, title: 'Apply seaweed extract', tool: 'Liquid Kelp Bottle', source: 'Garden center', action: 'Dilute per label, drench root zone.' },
    ],
    seed: [
      { step: 1, title: 'Test pot compaction', tool: 'Chopstick or Pencil', action: 'Push down. If it stops before 3", aerate.' },
      { step: 2, title: 'Aerate the pot', tool: 'Chopstick or Old Fork', action: 'Poke vertical holes every 2 inches. The roots need air, not just water.' },
      { step: 3, title: 'Add organic matter', tool: 'Kitchen Scraps', source: 'Your compost', action: 'Bury banana peels and coffee grounds at the edge.' },
      { step: 4, title: 'Mineral boost', tool: 'Seaweed from the beach or Kelp Snacks', source: 'Kitchen scavenger', action: 'Blend dried seaweed, dilute 1:100, water in.' },
    ],
  },
};

// Level 2: SACRAL/MINERALS - "Paramagnetism & Mineralization"
export const level2Protocol: ScaleProtocolConfig = {
  science: "Paramagnetism measures the soil's ability to attract atmospheric energy. Basalt rock dust adds 72 trace minerals and raises PCSM readings.",
  steps: {
    canopy: [
      { step: 1, title: 'Measure baseline paramagnetism', tool: 'PCSM Meter', action: 'Record CGS reading at 3 locations.' },
      { step: 2, title: 'Apply rock dust', tool: 'Basalt Rock Dust (Pallet)', source: 'Quarry delivery', action: 'Apply at 200-400 lbs/acre via spreader.' },
      { step: 3, title: 'Integrate with biology', tool: 'Irrigation System', action: 'Water in immediately to activate microbial bridging.' },
      { step: 4, title: 'Retest at 30 days', tool: 'PCSM Meter', action: 'Document CGS increase. Target: 200+ CGS.' },
    ],
    sprout: [
      { step: 1, title: 'Visual soil assessment', tool: 'Your Eyes', action: 'Grey/lifeless = low minerals. Dark/crumbly = better.' },
      { step: 2, title: 'Apply Azomite or basalt', tool: 'Azomite/Kelp Box', source: 'Garden center', action: 'Dust the surface like powdered sugar. 1 lb per 10 sq ft.' },
      { step: 3, title: 'Add sea minerals', tool: 'Sea-90 or Liquid Sea Mineral', source: 'Online order', action: 'Dilute per label, foliar spray at dusk.' },
      { step: 4, title: 'Observe plant response', tool: 'Your Eyes + Camera', action: 'Document color change over 2 weeks.' },
    ],
    seed: [
      { step: 1, title: 'Crushed eggshell calcium', tool: 'Eggshells', source: 'Kitchen scavenger', action: 'Dry, crush to powder, mix into top inch of potting soil.' },
      { step: 2, title: 'Sea salt trace minerals', tool: 'Unrefined Sea Salt', source: 'Kitchen pantry', action: 'Dilute 1 tsp in 1 gallon water. Contains 80+ trace minerals.' },
      { step: 3, title: 'Banana peel potassium', tool: 'Banana Peels', source: 'Kitchen scavenger', action: 'Dry, blend to powder. Top-dress around plant base.' },
      { step: 4, title: 'Wood ash minerals', tool: 'Fireplace/BBQ Ash', source: 'Home scavenger', action: 'Sprinkle lightly (1 tbsp per pot). High in potash and lime.' },
    ],
  },
};

// Level 3: SIGNAL/ANTENNA - "Atmospheric Nitrogen Collection"
export const level3Protocol: ScaleProtocolConfig = {
  science: "Copper spirals and paramagnetic towers act as antennas, collecting atmospheric nitrogen and subtle electromagnetic frequencies. The Fibonacci ratio (1.618) maximizes resonance.",
  steps: {
    canopy: [
      { step: 1, title: 'Build the Electroculture Tower', tool: '12-gauge Copper Wire + 6ft Wooden Dowel', action: 'Wind Fibonacci spiral (8-13-21 wraps) around dowel, point north.' },
      { step: 2, title: 'Ground the antenna', tool: 'Copper Grounding Rod (3ft)', action: 'Drive into moist earth, connect with copper wire to base of tower.' },
      { step: 3, title: 'Create antenna grid', tool: 'Multiple Towers', action: 'Place towers every 30 feet in grid pattern across field.' },
      { step: 4, title: 'Perform Agnihotra', tool: 'Copper Pyramid + Cow Dung + Ghee + Rice', action: 'At exact sunrise/sunset, amplify the atmospheric charge.' },
    ],
    sprout: [
      { step: 1, title: 'Simple copper spiral', tool: 'Copper Scrubbing Pad or Wire', source: 'Dollar store', action: 'Stretch pad into loose spiral, stake near tomato plant.' },
      { step: 2, title: 'Penny grounding', tool: 'Pre-1982 Penny (95% Copper)', action: 'Bury 3-4 inches deep near plant roots. Acts as micro-antenna.' },
      { step: 3, title: 'Sound activation', tool: 'Speaker or Your Voice', action: 'Play 432Hz music near plants. Sing to them. Sound opens stomata.' },
      { step: 4, title: 'Dawn/Dusk observation', tool: 'Your Presence', action: 'Be with plants at sunrise/sunset when atmospheric charge peaks.' },
    ],
    seed: [
      { step: 1, title: 'Kitchen copper antenna', tool: 'Pre-1982 Penny or Copper Wire Scrap', source: 'Kitchen scavenger', action: 'Place in pot to conduct the signal.' },
      { step: 2, title: 'Aluminum foil reflector', tool: 'Aluminum Foil', source: 'Kitchen drawer', action: 'Place behind pot to reflect light and energy to plant.' },
      { step: 3, title: 'Sound frequency', tool: 'Phone Speaker', action: 'Play 528Hz "Love Frequency" for 10 min/day near plant.' },
      { step: 4, title: 'Intentional watering', tool: 'Your Hands + Gratitude', action: 'Hold water, speak intention, then pour. Water holds memory.' },
    ],
  },
};

// Level 4: ALCHEMY - "Fermentation & Brix"
export const level4Protocol: ScaleProtocolConfig = {
  science: "Brix (sugar content) measures plant health. Above 12 Brix = pest resistance. JADAM fermentation creates living biology that feeds the soil-plant-microbe loop.",
  steps: {
    canopy: [
      { step: 1, title: 'Collect Brix baseline', tool: 'Refractometer', action: 'Squeeze leaf sap, read Brix. Record at same time of day.' },
      { step: 2, title: 'Prepare JADAM Liquid Fertilizer', tool: '50-gallon barrel + Leaf Mold + Water', action: 'Fill barrel, add 2 lbs leaf mold, ferment 7 days (bubbling stops).' },
      { step: 3, title: 'Apply JLF foliar', tool: 'Backpack Sprayer', action: 'Dilute 1:30, foliar spray at dawn. Microbes enter stomata.' },
      { step: 4, title: 'Retest Brix at 14 days', tool: 'Refractometer', action: 'Target: 12+ Brix. Document improvement.' },
    ],
    sprout: [
      { step: 1, title: 'Estimate plant health', tool: 'Taste Test', action: 'Nibble a leaf. Bitter = low Brix. Sweet = high Brix.' },
      { step: 2, title: 'Make compost tea', tool: '5-gallon bucket + Compost + Molasses', source: 'Garden center compost', action: 'Add 1 cup compost + 1 tbsp molasses, bubble with aquarium pump 24-48 hrs.' },
      { step: 3, title: 'Foliar feed', tool: 'Hand Sprayer', action: 'Strain tea, spray leaves at dusk. Coat undersides.' },
      { step: 4, title: 'Observe pest behavior', tool: 'Your Eyes', action: 'Healthy plants repel pests. Document changes.' },
    ],
    seed: [
      { step: 1, title: 'Taste the leaf', tool: 'Your Tongue', action: 'Nibble. Bitter/bland = needs help. Sweet/spicy = thriving.' },
      { step: 2, title: 'Rice wash fertilizer', tool: 'Rice Rinsing Water', source: 'Kitchen scavenger', action: 'Save water from rinsing rice. Let sit 24 hrs. Pour on soil.' },
      { step: 3, title: 'Banana peel tea', tool: 'Banana Peels + Jar', source: 'Kitchen scavenger', action: 'Soak peels in water 48 hrs. Dilute 1:5, water plants.' },
      { step: 4, title: 'Egg shell calcium spray', tool: 'Eggshells + Vinegar', source: 'Kitchen', action: 'Dissolve crushed shells in vinegar 24 hrs. Dilute 1:50, foliar spray.' },
    ],
  },
};

// Level 5: CROWN/SOVEREIGNTY - "Seed Sovereignty"
export const level5Protocol: ScaleProtocolConfig = {
  science: "Open-pollinated seeds adapt to your specific microclimate over generations. Hybrid seeds cannot be saved. Seed sovereignty = food sovereignty.",
  steps: {
    canopy: [
      { step: 1, title: 'Select mother plants', tool: 'Flagging Tape', action: 'Mark healthiest 10% of crop. These carry the best genetics.' },
      { step: 2, title: 'Allow full maturation', tool: 'Patience', action: 'Do not harvest these plants. Let seeds fully ripen on stalk.' },
      { step: 3, title: 'Dry and process', tool: 'Seed Cleaning Screens', action: 'Thresh, winnow, and screen. Dry in shade 14 days (below 50% humidity).' },
      { step: 4, title: 'Store with lineage', tool: 'Glass Jars + Silica Gel + Labels', action: 'Label with date, variety, and source. Store cool and dark.' },
    ],
    sprout: [
      { step: 1, title: 'Choose best performer', tool: 'Your Observation', action: 'Which plant was healthiest? Mark it. Do not eat from it.' },
      { step: 2, title: 'Let it bolt', tool: 'Patience', action: 'Allow plant to flower and set seed. This may take weeks.' },
      { step: 3, title: 'Harvest when dry', tool: 'Paper Bag', action: 'Cut seed heads into bag. Hang upside down to finish drying.' },
      { step: 4, title: 'Store in fridge', tool: 'Envelope + Glass Jar', action: 'Seeds in paper envelope, envelope in jar with lid. Fridge keeps cool.' },
    ],
    seed: [
      { step: 1, title: 'Save from dinner', tool: 'Tomato/Pepper from meal', source: 'Kitchen', action: 'Scoop seeds from heirloom tomato or pepper you ate.' },
      { step: 2, title: 'Ferment tomato seeds', tool: 'Glass Jar + Water', action: 'Put seeds + pulp in jar with water. Ferment 3 days until scummy. Good mold = white.' },
      { step: 3, title: 'Rinse and dry', tool: 'Strainer + Paper Towel', action: 'Rinse seeds, spread on paper towel. Dry 7 days away from sun.' },
      { step: 4, title: 'Label and store', tool: 'Envelope + Marker + Fridge', action: 'Write variety + date. Store in fridge door. Plant next season.' },
    ],
  },
};

// Get protocol config by level
export const getProtocolByLevel = (level: number): ScaleProtocolConfig | null => {
  switch (level) {
    case 0: return level0Protocol;
    case 1: return level1Protocol;
    case 2: return level2Protocol;
    case 3: return level3Protocol;
    case 4: return level4Protocol;
    case 5: return level5Protocol;
    default: return null;
  }
};
