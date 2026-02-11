
-- ═══════════════════════════════════════════════════════════════
-- SENSORY AROMATIC LAYERS — Culinary, Pest-Deterrent, Fragrance
-- Complete coverage across all 7 frequency zones
-- ═══════════════════════════════════════════════════════════════

-- ── CULINARY AROMATICS ───────────────────────────────────────

-- Lemon Balm — 639Hz Heart (calming, tea herb)
INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
('melissa_officinalis', 'Lemon Balm', 639, 'Heart', 'hsl(120 50% 45%)', 'Air', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'HEART_FOCUS', 'Calcium (Ca)', ARRAY['spring','summer','fall'], 70, '12', 6, 14, 'Synthesizers', 3.0, 9.0, 'Food Forest Aromatic Layer. Perennial lemon-scented herb — pollinator magnet, calming tea. Self-seeds vigorously in partial shade.', 'Perennial aromatic herb for understory scent corridors'),

-- Sweet Marjoram — 528Hz Alchemy
('origanum_majorana', 'Sweet Marjoram', 528, 'Alchemy', 'hsl(51 80% 50%)', 'Fire', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'SOLAR_FOCUS', 'Nitrogen (N)', ARRAY['spring','summer'], 80, '8', 8, 14, 'Synthesizers', 6.0, 9.0, 'Aromatic Layer. Sweet oregano relative — culinary essential with volatile oils that confuse pest navigation.', 'Culinary aromatic with pest-confusing volatile oils'),

-- Bee Balm / Monarda — 396Hz Foundation
('monarda_didyma', 'Bee Balm (Scarlet)', 396, 'Foundation', 'hsl(0 60% 50%)', 'Fire', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'ROOT_FOCUS', 'Phosphorus (P)', ARRAY['spring','summer'], 90, '12', 6, 12, 'Synthesizers', 3.0, 9.0, 'Food Forest Aromatic Layer. Native perennial — hummingbird and pollinator magnet. Edible flowers, medicinal tea. Strong aromatic pest deterrent.', 'Native aromatic perennial for hummingbird attraction'),

-- Shiso / Perilla — 417Hz Flow
('perilla_frutescens', 'Shiso (Red Perilla)', 417, 'Flow', 'hsl(30 70% 50%)', 'Water', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'FLOW_FOCUS', 'Hydrogen (H)', ARRAY['spring','summer'], 60, '10', 6, 12, 'Synthesizers', 5.0, 10.0, 'Aromatic Layer. Japanese culinary herb — intense aromatic oils. Red pigment for natural dye. Self-seeds freely.', 'Culinary aromatic herb with natural dye pigment'),

-- Mexican Oregano — 741Hz Signal
('lippia_graveolens', 'Mexican Oregano', 741, 'Signal', 'hsl(210 60% 50%)', 'Ether', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'EXPRESSION_FOCUS', 'Potassium (K)', ARRAY['spring','summer','fall'], 75, '18', 8, 16, 'Synthesizers', 8.0, 11.0, 'Aromatic Layer. Woody perennial shrub — stronger flavor than Mediterranean oregano. Drought-tolerant aromatic barrier.', 'Drought-tolerant aromatic shrub with intense flavor');

-- ── PEST-DETERRENT AROMATICS ─────────────────────────────────

INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
-- Citronella Grass — 417Hz Flow (mosquito deterrent)
('cymbopogon_nardus', 'Citronella Grass', 417, 'Flow', 'hsl(30 70% 50%)', 'Water', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Sentinel', 'FLOW_FOCUS', 'Hydrogen (H)', ARRAY['spring','summer'], 120, '24', 4, 10, 'Synthesizers', 9.0, 11.0, 'Aromatic Pest Barrier. True citronella — mosquito and flying pest deterrent. Perennial clumping grass with strong lemon scent.', 'Mosquito-deterrent aromatic grass for perimeter planting'),

-- Pyrethrum Daisy — 528Hz Alchemy (natural insecticide)
('tanacetum_cinerariifolium', 'Pyrethrum Daisy', 528, 'Alchemy', 'hsl(51 80% 50%)', 'Fire', 'Dye/Fiber/Aromatic', '3rd (Triad)', 'Sentinel', 'SOLAR_FOCUS', 'Nitrogen (N)', ARRAY['spring','summer'], 120, '12', 4, 10, 'Synthesizers', 5.0, 9.0, 'Aromatic Pest Barrier. Source of natural pyrethrin insecticide — companion-planted to create biological pest exclusion zones.', 'Natural insecticide daisy for organic pest management'),

-- Southernwood — 963Hz Source (moth/flea deterrent)
('artemisia_abrotanum', 'Southernwood', 963, 'Source', 'hsl(300 50% 50%)', 'Source', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Sentinel', 'SOURCE_FOCUS', 'Sulfur (S)', ARRAY['spring','summer'], 90, '24', 4, 8, 'Synthesizers', 4.0, 8.5, 'Aromatic Pest Barrier. Artemisia family — strong camphor scent deters moths, fleas, and cabbage butterflies. Perennial hedge plant.', 'Camphor-scented perennial for pest-deterrent hedging'),

-- Catnip — 639Hz Heart (10x more effective than DEET for mosquitoes)
('nepeta_cataria', 'Catnip', 639, 'Heart', 'hsl(120 50% 45%)', 'Air', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Sentinel', 'HEART_FOCUS', 'Calcium (Ca)', ARRAY['spring','summer','fall'], 60, '18', 4, 10, 'Synthesizers', 3.0, 9.0, 'Aromatic Pest Barrier. Nepetalactone is 10× more effective than DEET for mosquito deterrence. Also repels aphids, flea beetles, and squash bugs.', 'Scientifically proven mosquito deterrent — 10× more effective than DEET'),

-- Feverfew — 852Hz Vision (pest deterrent, medicinal)
('tanacetum_parthenium', 'Feverfew', 852, 'Vision', 'hsl(270 50% 50%)', 'Spirit', 'Medicinal', '7th (Signal)', 'Sentinel', 'INTUITION_FOCUS', 'Silica (Si)', ARRAY['spring','summer'], 90, '12', 4, 10, 'Synthesizers', 5.0, 9.0, 'Aromatic Pest Barrier. Bitter aromatic — repels aphids and mites. Traditional migraine remedy. Self-seeds readily in part shade.', 'Medicinal aromatic with aphid and mite deterrence');

-- ── FRAGRANCE & POLLINATOR AROMATICS ─────────────────────────

INSERT INTO public.master_crops (name, common_name, frequency_hz, zone_name, zone_color, element, category, chord_interval, guild_role, focus_tag, dominant_mineral, planting_season, harvest_days, spacing_inches, brix_target_min, brix_target_max, instrument_type, hardiness_zone_min, hardiness_zone_max, library_note, description)
VALUES
-- Sweet Woodruff — 396Hz Foundation (shade ground cover, fragrance)
('galium_odoratum', 'Sweet Woodruff', 396, 'Foundation', 'hsl(0 60% 50%)', 'Earth', 'Dye/Fiber/Aromatic', '5th (Stabilizer)', 'Enhancer', 'ROOT_FOCUS', 'Phosphorus (P)', ARRAY['spring','fall'], 120, '8', 4, 10, 'Synthesizers', 4.0, 8.0, 'Food Forest Aromatic Ground Cover. Coumarin-scented shade ground cover — fragrant when dried. Traditional Maibowle herb. Naturalizes under canopy.', 'Fragrant shade ground cover for woodland food forests'),

-- Confederate Jasmine — 639Hz Heart (vine fragrance)
('trachelospermum_jasminoides', 'Star Jasmine', 639, 'Heart', 'hsl(120 50% 45%)', 'Air', 'Dye/Fiber/Aromatic', '13th (Top Note)', 'Enhancer', 'HEART_FOCUS', 'Calcium (Ca)', ARRAY['spring','summer'], 365, '36', 4, 8, 'Synthesizers', 7.5, 10.0, 'Food Forest Aromatic Vine Layer. Intensely fragrant evergreen vine — creates scent corridors in food forest canopy gaps. Night-blooming fragrance attracts moths.', 'Fragrant evergreen vine for food forest scent corridors'),

-- Honeysuckle — 528Hz Alchemy (vine fragrance, pollinator)
('lonicera_japonica', 'Honeysuckle (Japanese)', 528, 'Alchemy', 'hsl(51 80% 50%)', 'Fire', 'Dye/Fiber/Aromatic', '13th (Top Note)', 'Enhancer', 'SOLAR_FOCUS', 'Nitrogen (N)', ARRAY['spring','summer','fall'], 365, '36', 4, 10, 'Synthesizers', 4.0, 9.0, 'Food Forest Aromatic Vine Layer. Vigorous fragrant vine — pollinator superhighway. Edible nectar. Use managed varieties to prevent invasiveness.', 'Fragrant pollinator vine — manage to prevent spread'),

-- Night-Blooming Jasmine — 963Hz Source (nocturnal fragrance)
('cestrum_nocturnum', 'Night-Blooming Jasmine', 963, 'Source', 'hsl(300 50% 50%)', 'Source', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'SOURCE_FOCUS', 'Sulfur (S)', ARRAY['spring','summer','fall'], 365, '36', 4, 8, 'Synthesizers', 8.0, 11.0, 'Food Forest Aromatic Layer. Intensely fragrant at night — attracts nocturnal pollinators (moths, bats). Creates twilight scent corridors.', 'Nocturnal fragrance plant for moth and bat pollination'),

-- Anise Hyssop — 741Hz Signal (licorice fragrance, bee plant)
('agastache_foeniculum', 'Anise Hyssop', 741, 'Signal', 'hsl(210 60% 50%)', 'Ether', 'Dye/Fiber/Aromatic', '7th (Signal)', 'Enhancer', 'EXPRESSION_FOCUS', 'Potassium (K)', ARRAY['summer','fall'], 90, '12', 8, 14, 'Synthesizers', 4.0, 9.0, 'Food Forest Aromatic Layer. Licorice-scented native perennial — top-tier bee plant. Edible flowers and leaves. Self-seeds in sunny edges.', 'Licorice-scented native perennial — premier bee forage plant'),

-- Sweet Fern — 396Hz Foundation (native aromatic shrub)
('comptonia_peregrina', 'Sweet Fern', 396, 'Foundation', 'hsl(0 60% 50%)', 'Earth', 'Nitrogen/Bio-Mass', '5th (Stabilizer)', 'Enhancer', 'ROOT_FOCUS', 'Phosphorus (P)', ARRAY['spring','summer'], 365, '36', 4, 8, 'Synthesizers', 2.0, 6.0, 'Food Forest Aromatic Layer. Nitrogen-fixing native shrub — aromatic leaves repel deer and browsing animals. Thrives in poor acidic soil.', 'Nitrogen-fixing aromatic native shrub for poor soils');
