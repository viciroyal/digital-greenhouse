-- ═══════════════════════════════════════════════════════════════════════════
-- THE 7-ZONE OCTAVE SORTING PROTOCOL
-- ═══════════════════════════════════════════════════════════════════════════
-- Maps every crop to a Frequency ID with Focus Tags for filtering.

-- First, add a focus_tag column if it doesn't exist
ALTER TABLE master_crops ADD COLUMN IF NOT EXISTS focus_tag TEXT;

-- Clear existing data to rebuild with exact protocol
DELETE FROM master_crops;

-- ═══════════════════════════════════════════════════════════════════════════
-- 396Hz (RED) - ROOT_FOCUS: Tomatoes, Peppers, Melons
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Solanum lycopersicum', 'Tomato', 396, 'ROOT PULSE', 'hsl(0 60% 50%)', 'Earth', 'fruit', 'ROOT_FOCUS', 12, 24),
  ('Capsicum annuum', 'Pepper', 396, 'ROOT PULSE', 'hsl(0 60% 50%)', 'Earth', 'fruit', 'ROOT_FOCUS', 10, 20),
  ('Capsicum chinense', 'Habanero', 396, 'ROOT PULSE', 'hsl(0 60% 50%)', 'Earth', 'fruit', 'ROOT_FOCUS', 10, 18),
  ('Cucumis melo', 'Melon', 396, 'ROOT PULSE', 'hsl(0 60% 50%)', 'Earth', 'fruit', 'ROOT_FOCUS', 14, 22),
  ('Citrullus lanatus', 'Watermelon', 396, 'ROOT PULSE', 'hsl(0 60% 50%)', 'Earth', 'fruit', 'ROOT_FOCUS', 12, 18);

-- ═══════════════════════════════════════════════════════════════════════════
-- 417Hz (ORANGE) - FLOW_FOCUS: Sweet Potato, Squash, Carrots
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Ipomoea batatas', 'Sweet Potato', 417, 'STONE HUM', 'hsl(30 70% 50%)', 'Water', 'root', 'FLOW_FOCUS', 12, 20),
  ('Cucurbita pepo', 'Squash', 417, 'STONE HUM', 'hsl(30 70% 50%)', 'Water', 'fruit', 'FLOW_FOCUS', 10, 16),
  ('Cucurbita maxima', 'Butternut Squash', 417, 'STONE HUM', 'hsl(30 70% 50%)', 'Water', 'fruit', 'FLOW_FOCUS', 10, 18),
  ('Cucurbita moschata', 'Pumpkin', 417, 'STONE HUM', 'hsl(30 70% 50%)', 'Water', 'fruit', 'FLOW_FOCUS', 10, 16),
  ('Daucus carota', 'Carrot', 417, 'STONE HUM', 'hsl(30 70% 50%)', 'Water', 'root', 'FLOW_FOCUS', 12, 18);

-- ═══════════════════════════════════════════════════════════════════════════
-- 528Hz (YELLOW) - SOLAR_FOCUS: Corn, Beans, Sunflowers
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Zea mays', 'Corn', 528, 'THE SONGLINE', 'hsl(51 80% 50%)', 'Fire', 'grain', 'SOLAR_FOCUS', 12, 20),
  ('Phaseolus vulgaris', 'Beans', 528, 'THE SONGLINE', 'hsl(51 80% 50%)', 'Fire', 'legume', 'SOLAR_FOCUS', 10, 16),
  ('Phaseolus lunatus', 'Lima Bean', 528, 'THE SONGLINE', 'hsl(51 80% 50%)', 'Fire', 'legume', 'SOLAR_FOCUS', 10, 16),
  ('Helianthus annuus', 'Sunflower', 528, 'THE SONGLINE', 'hsl(51 80% 50%)', 'Fire', 'flower', 'SOLAR_FOCUS', 8, 14),
  ('Vigna unguiculata', 'Cowpea', 528, 'THE SONGLINE', 'hsl(51 80% 50%)', 'Fire', 'legume', 'SOLAR_FOCUS', 10, 16);

-- ═══════════════════════════════════════════════════════════════════════════
-- 639Hz (GREEN) - HEART_FOCUS: Kale, Broccoli, Apples
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Brassica oleracea var. acephala', 'Kale', 639, 'GOLD FLOW', 'hsl(120 50% 45%)', 'Air', 'leafy', 'HEART_FOCUS', 8, 16),
  ('Brassica oleracea var. italica', 'Broccoli', 639, 'GOLD FLOW', 'hsl(120 50% 45%)', 'Air', 'leafy', 'HEART_FOCUS', 8, 14),
  ('Brassica oleracea var. viridis', 'Collard Greens', 639, 'GOLD FLOW', 'hsl(120 50% 45%)', 'Air', 'leafy', 'HEART_FOCUS', 8, 14),
  ('Malus domestica', 'Apple', 639, 'GOLD FLOW', 'hsl(120 50% 45%)', 'Air', 'fruit', 'HEART_FOCUS', 14, 22),
  ('Spinacia oleracea', 'Spinach', 639, 'GOLD FLOW', 'hsl(120 50% 45%)', 'Air', 'leafy', 'HEART_FOCUS', 8, 16);

-- ═══════════════════════════════════════════════════════════════════════════
-- 741Hz (BLUE) - EXPRESSION_FOCUS: Blueberries, Grapes, Cucumbers
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Vaccinium corymbosum', 'Blueberry', 741, 'VOICE CHANNEL', 'hsl(210 60% 50%)', 'Ether', 'fruit', 'EXPRESSION_FOCUS', 14, 22),
  ('Vitis vinifera', 'Grape', 741, 'VOICE CHANNEL', 'hsl(210 60% 50%)', 'Ether', 'fruit', 'EXPRESSION_FOCUS', 16, 24),
  ('Cucumis sativus', 'Cucumber', 741, 'VOICE CHANNEL', 'hsl(210 60% 50%)', 'Ether', 'fruit', 'EXPRESSION_FOCUS', 8, 14),
  ('Rubus idaeus', 'Raspberry', 741, 'VOICE CHANNEL', 'hsl(210 60% 50%)', 'Ether', 'fruit', 'EXPRESSION_FOCUS', 10, 18),
  ('Fragaria ananassa', 'Strawberry', 741, 'VOICE CHANNEL', 'hsl(210 60% 50%)', 'Ether', 'fruit', 'EXPRESSION_FOCUS', 12, 20);

-- ═══════════════════════════════════════════════════════════════════════════
-- 852Hz (INDIGO) - INTUITION_FOCUS: Eggplant, Figs, Herbs
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Solanum melongena', 'Eggplant', 852, 'THIRD EYE', 'hsl(270 50% 50%)', 'Spirit', 'fruit', 'INTUITION_FOCUS', 8, 14),
  ('Ficus carica', 'Fig', 852, 'THIRD EYE', 'hsl(270 50% 50%)', 'Spirit', 'fruit', 'INTUITION_FOCUS', 16, 24),
  ('Ocimum basilicum', 'Basil', 852, 'THIRD EYE', 'hsl(270 50% 50%)', 'Spirit', 'herb', 'INTUITION_FOCUS', 10, 18),
  ('Salvia rosmarinus', 'Rosemary', 852, 'THIRD EYE', 'hsl(270 50% 50%)', 'Spirit', 'herb', 'INTUITION_FOCUS', 10, 18),
  ('Thymus vulgaris', 'Thyme', 852, 'THIRD EYE', 'hsl(270 50% 50%)', 'Spirit', 'herb', 'INTUITION_FOCUS', 10, 18);

-- ═══════════════════════════════════════════════════════════════════════════
-- 963Hz (VIOLET) - SOURCE_FOCUS: Garlic, Onions, Flowers
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, focus_tag, brix_target_min, brix_target_max)
VALUES 
  ('Allium sativum', 'Garlic', 963, 'SOURCE CODE', 'hsl(300 50% 50%)', 'Void', 'bulb', 'SOURCE_FOCUS', 12, 20),
  ('Allium cepa', 'Onion', 963, 'SOURCE CODE', 'hsl(300 50% 50%)', 'Void', 'bulb', 'SOURCE_FOCUS', 10, 18),
  ('Allium porrum', 'Leek', 963, 'SOURCE CODE', 'hsl(300 50% 50%)', 'Void', 'bulb', 'SOURCE_FOCUS', 10, 16),
  ('Rosa spp.', 'Rose', 963, 'SOURCE CODE', 'hsl(300 50% 50%)', 'Void', 'flower', 'SOURCE_FOCUS', 8, 14),
  ('Lavandula angustifolia', 'Lavender', 963, 'SOURCE CODE', 'hsl(300 50% 50%)', 'Void', 'flower', 'SOURCE_FOCUS', 10, 16);

-- Create index for fast focus_tag filtering
CREATE INDEX IF NOT EXISTS idx_master_crops_focus_tag ON master_crops(focus_tag);
CREATE INDEX IF NOT EXISTS idx_master_crops_frequency ON master_crops(frequency_hz);