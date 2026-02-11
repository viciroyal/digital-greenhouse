

## Add Root Layer Crops for 741Hz (Expression) Zone

### Problem
The 741Hz (Expression/Signal) zone has only **one** 9th (Sub-bass) crop: Sweet Potato (Okinawan), which requires hardiness zones 8-11. This leaves a gap for stewards in cooler climates (zones 3-7) when building Food Forest recipes — the 9th slot shows "No match in registry."

### Solution
Insert **3 new cold-hardy root layer perennials** into the `master_crops` table at 741Hz with the `9th (Sub-bass)` chord interval:

| Crop | Scientific Key | Hardiness Range | Spacing | Why 741Hz |
|---|---|---|---|---|
| **Horseradish** | `armoracia_rusticana_741` | 3a - 9b | 18" | Potassium-rich root, strong volatile expression, pest deterrent |
| **Jerusalem Artichoke** | `helianthus_tuberosus_741` | 3a - 9b | 18" | Tall expressive stalks, inulin-rich tuber, potassium accumulator |
| **Skirret** | `sium_sisarum` | 5a - 8b | 12" | Historic perennial root vegetable, sweet flavor, shade-tolerant understory root |

### Important Notes
- Horseradish already exists at 963Hz (as a sentinel) and Jerusalem Artichoke at 528Hz (as a lead crop). These new entries are **separate records** at 741Hz with different ecological roles (Sub-bass root layer) — this follows the existing pattern where crops appear at multiple frequencies with different roles.
- All three are true perennials, making them ideal for the Food Forest 9th (Root Layer) slot.
- Combined with the existing Okinawan Sweet Potato (zones 8-11), these fill the full hardiness spectrum from zone 3a to 11.

### Data for Each Crop

**Horseradish (741Hz)**
- Category: Sustenance
- Chord Interval: 9th (Sub-bass)
- Guild Role: Miner
- Focus Tag: EXPRESSION_FOCUS
- Element: Ether | Zone: Signal | Color: hsl(210 60% 50%)
- Dominant Mineral: K (Potassium)
- Brix: 8-14
- Harvest Days: 150
- Planting Season: Spring, Fall
- Companion Crops: Gooseberry, Black Currant, Anise Hyssop
- Crop Guild: Hinnomaki Red Gooseberry, Titania Black Currant, Mexican Oregano
- Library Note: "Root Layer — Deep taproot mines potassium and sulfur. Volatile compounds deter soil-boring pests. Perennial root crop for Food Forest understory."

**Jerusalem Artichoke (741Hz)**
- Category: Sustenance
- Chord Interval: 9th (Sub-bass)
- Guild Role: Lead
- Focus Tag: EXPRESSION_FOCUS
- Element: Ether | Zone: Signal | Color: hsl(210 60% 50%)
- Dominant Mineral: K (Potassium)
- Brix: 10-16
- Harvest Days: 120
- Planting Season: Spring
- Companion Crops: Gooseberry, Black Currant, Jostaberry
- Crop Guild: Hinnomaki Red Gooseberry, Cascade Hops, Anise Hyssop
- Library Note: "Root Layer — Inulin-rich tuber, strong potassium accumulator. Tall stalks provide wind break and pollinator habitat. Perennial Food Forest root layer."

**Skirret**
- Category: Sustenance
- Chord Interval: 9th (Sub-bass)
- Guild Role: Miner
- Focus Tag: EXPRESSION_FOCUS
- Element: Ether | Zone: Signal | Color: hsl(210 60% 50%)
- Dominant Mineral: K (Potassium)
- Brix: 12-18
- Harvest Days: 180
- Planting Season: Spring, Fall
- Companion Crops: Gooseberry, Black Currant, Jostaberry
- Crop Guild: Hinnomaki Red Gooseberry, Titania Black Currant, Anise Hyssop
- Library Note: "Root Layer — Historic perennial root vegetable. Sweet, shade-tolerant understory root. Ideal Food Forest 9th voice for cool climates."

### Technical Details
Single data insert operation adding 3 rows to `master_crops`. No code changes needed — the Crop Oracle recipe engine already queries by `frequency_hz` and `chord_interval`, so these will automatically populate the 9th (Sub-bass) slot in Food Forest mode.
