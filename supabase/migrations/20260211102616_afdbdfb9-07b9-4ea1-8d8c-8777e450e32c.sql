
-- ═══════════════════════════════════════════════════════════════
-- GROUND COVER & ROOT LAYER CROPS for Food Forest 7-Layer Coverage
-- ═══════════════════════════════════════════════════════════════

-- RAMPS (Wild Leek) — Root Layer / 11th (Tension) sentinel allium
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('allium_tricoccum', 'Ramps (Wild Leek)', 396, 'Foundation', 'hsl(0 60% 50%)', 'Earth', 'Sustenance', '11th (Tension)', 'Sentinel', 'ROOT_FOCUS', 'Sulfur (S)', ARRAY['spring'], 365, '6', 8, 14, 'Bass', 3.0, 7.0, 'Food Forest Root Layer. Native woodland allium — thrives in deep shade under canopy trees. Slow to establish but self-propagating colony.', 'Wild-harvested perennial allium for forest understory'),

('allium_tricoccum_red', 'Ramps (Red)', 639, 'Heart', 'hsl(120 50% 45%)', 'Air', 'Sustenance', '11th (Tension)', 'Sentinel', 'HEART_FOCUS', 'Sulfur (S)', ARRAY['spring'], 365, '6', 8, 14, 'Bass', 3.0, 7.0, 'Food Forest Root Layer. Red-stemmed ramps variety — excellent calcium-rich woodland sentinel.', 'Red-stemmed wild leek for shade gardens');

-- CREEPING THYME — Ground Cover / 5th (Stabilizer)
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('thymus_serpyllum', 'Creeping Thyme', 528, 'Alchemy', 'hsl(51 80% 50%)', 'Fire', 'Nitrogen/Bio-Mass', '5th (Stabilizer)', 'Enhancer', 'SOLAR_FOCUS', 'Potassium (K)', ARRAY['spring','summer'], 90, '12', 6, 12, 'Synthesizers', 4.0, 9.0, 'Food Forest Ground Cover. Living mulch — suppresses weeds, attracts pollinators, tolerates foot traffic. Nitrogen pathway support.', 'Perennial ground cover thyme for pathways and bed edges'),

('thymus_praecox_coccineus', 'Red Creeping Thyme', 396, 'Foundation', 'hsl(0 60% 50%)', 'Fire', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'ROOT_FOCUS', 'Potassium (K)', ARRAY['spring','summer'], 90, '12', 6, 12, 'Synthesizers', 4.0, 9.0, 'Food Forest Ground Cover. Red-flowering ground cover — pollinator magnet, living mulch for root zone crops.', 'Red-flowering perennial ground cover');

-- ADDITIONAL STRAWBERRY VARIETIES — Ground Cover / Root (Lead) or 3rd (Triad)
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('fragaria_vesca', 'Alpine Strawberry', 528, 'Alchemy', 'hsl(51 80% 50%)', 'Fire', 'Sustenance', '3rd (Triad)', 'Enhancer', 'SOLAR_FOCUS', 'Calcium (Ca)', ARRAY['spring','summer','fall'], 90, '8', 10, 16, 'Electric Guitar', 3.0, 9.0, 'Food Forest Ground Cover. Everbearing woodland strawberry — ideal understory ground cover. No runners, clump-forming.', 'Compact woodland strawberry for understory ground cover'),

('fragaria_chiloensis', 'Beach Strawberry', 852, 'Vision', 'hsl(270 50% 50%)', 'Spirit', 'Sustenance', '3rd (Triad)', 'Enhancer', 'INTUITION_FOCUS', 'Silica (Si)', ARRAY['spring','summer'], 120, '12', 8, 14, 'Electric Guitar', 5.0, 9.0, 'Food Forest Ground Cover. Evergreen ground cover strawberry — salt-tolerant, thick mat-forming. Excellent erosion control.', 'Evergreen ground cover strawberry for coastal and sandy soils'),

('fragaria_virginiana', 'Wild Strawberry', 396, 'Foundation', 'hsl(0 60% 50%)', 'Earth', 'Sustenance', '3rd (Triad)', 'Enhancer', 'ROOT_FOCUS', 'Phosphorus (P)', ARRAY['spring','summer'], 90, '10', 10, 18, 'Electric Guitar', 3.0, 8.5, 'Food Forest Ground Cover. Native ground cover — aggressive runners create living mulch. Self-propagating colony.', 'Native wild strawberry for food forest ground layer');

-- GINGER VARIETIES — Root Layer / 9th (Sub-bass)
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('zingiber_myoga', 'Myoga Ginger', 417, 'Flow', 'hsl(30 70% 50%)', 'Water', 'Sustenance', '9th (Sub-bass)', 'Lead', 'FLOW_FOCUS', 'Hydrogen (H)', ARRAY['spring','summer'], 180, '12', 6, 12, 'Percussion', 7.0, 10.0, 'Food Forest Root Layer. Cold-hardy Japanese ginger — grows in deep shade, returns each spring. Edible flower buds.', 'Shade-tolerant perennial ginger for forest understory'),

('curcuma_longa_hawaiian', 'Turmeric (Hawaiian)', 852, 'Vision', 'hsl(270 50% 50%)', 'Spirit', 'Sustenance', '9th (Sub-bass)', 'Lead', 'INTUITION_FOCUS', 'Silica (Si)', ARRAY['spring','summer'], 270, '12', 6, 14, 'Percussion', 8.0, 11.0, 'Food Forest Root Layer. High-curcumin Hawaiian variety — needs deep humates and warmth. Excellent understory rhizome.', 'High-potency turmeric variety for tropical food forests');

-- SWEET POTATO VARIETIES — Root Layer / 9th (Sub-bass)
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('ipomoea_batatas_purple', 'Sweet Potato (Purple)', 963, 'Source', 'hsl(300 50% 50%)', 'Source', 'Sustenance', '9th (Sub-bass)', 'Lead', 'SOURCE_FOCUS', 'Sulfur (S)', ARRAY['summer'], 120, '12', 10, 16, 'Percussion', 5.0, 11.0, 'Food Forest Root Layer. Anthocyanin-rich purple sweet potato — dual-purpose ground cover and root crop.', 'Purple sweet potato variety with antioxidant-rich tubers'),

('ipomoea_batatas_okinawan', 'Sweet Potato (Okinawan)', 741, 'Signal', 'hsl(210 60% 50%)', 'Ether', 'Sustenance', '9th (Sub-bass)', 'Lead', 'EXPRESSION_FOCUS', 'Potassium (K)', ARRAY['summer'], 150, '12', 10, 18, 'Percussion', 8.0, 11.0, 'Food Forest Root Layer. Purple-fleshed Okinawan variety — vigorous ground cover vines suppress weeds.', 'Okinawan purple sweet potato for warm climate food forests');

-- ADDITIONAL GROUND COVER SPECIES
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('viola_odorata', 'Sweet Violet', 639, 'Heart', 'hsl(120 50% 45%)', 'Air', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'HEART_FOCUS', 'Calcium (Ca)', ARRAY['spring','fall'], 60, '8', 6, 12, 'Synthesizers', 4.0, 9.0, 'Food Forest Ground Cover. Edible flowers and leaves — shade-tolerant perennial ground cover. Self-seeds freely.', 'Edible perennial violet for food forest ground layer'),

('ajuga_reptans', 'Bugleweed', 417, 'Flow', 'hsl(30 70% 50%)', 'Water', 'Nitrogen/Bio-Mass', '5th (Stabilizer)', 'Enhancer', 'FLOW_FOCUS', 'Hydrogen (H)', ARRAY['spring','summer','fall'], 60, '10', 4, 8, 'Synthesizers', 3.0, 9.0, 'Food Forest Ground Cover. Aggressive perennial ground cover — excellent weed suppressor. Shade and sun tolerant.', 'Fast-spreading ground cover for weed suppression'),

('asarum_canadense', 'Wild Ginger (Native)', 396, 'Foundation', 'hsl(0 60% 50%)', 'Earth', 'Medicinal', '9th (Sub-bass)', 'Enhancer', 'ROOT_FOCUS', 'Phosphorus (P)', ARRAY['spring'], 365, '8', 4, 10, 'Percussion', 3.0, 7.0, 'Food Forest Root Layer. Native woodland ground cover — heart-shaped leaves form dense shade carpet. Medicinal rhizome.', 'Native wild ginger for shaded food forest ground layer');
