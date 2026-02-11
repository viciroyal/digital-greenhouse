
INSERT INTO public.master_crops (name, common_name, category, frequency_hz, zone_name, zone_color, element, chord_interval, guild_role, spacing_inches, harvest_days, description, dominant_mineral, focus_tag, instrument_type, planting_season) VALUES
-- 396Hz Foundation (Red energy)
('Knockout Rose', 'Knockout Rose', 'Ornamental', 396, 'Foundation', '#FF0000', 'Earth', '7th (Signal)', 'Signal', '36', 120, 'Hardy repeat-blooming shrub rose. Red fire energy anchors garden borders.', 'Phosphorus', 'Root anchoring / Double Kelp', 'Synthesizer', ARRAY['spring','summer','fall']),
('Azalea', 'Azalea', 'Ornamental', 396, 'Foundation', '#FF0000', 'Earth', '7th (Signal)', 'Signal', '36', 365, 'Acid-loving flowering shrub with vibrant red blooms. Foundation plantings.', 'Phosphorus', 'Root anchoring / Double Kelp', 'Synthesizer', ARRAY['spring']),

-- 417Hz Flow (Orange energy)
('Begonia', 'Begonia', 'Ornamental', 417, 'Flow', '#FF7F00', 'Water', '7th (Signal)', 'Signal', '8', 90, 'Shade-loving annual with waxy orange-red blooms. Thrives in moist flow zones.', 'Hydrogen/Carbon', 'High Humates', 'Synthesizer', ARRAY['spring','summer']),
('Canna Lily', 'Canna Lily', 'Ornamental', 417, 'Flow', '#FF7F00', 'Water', '13th (Top Note)', 'Aerial', '18', 90, 'Tropical rhizome with bold orange flowers and banana-like foliage.', 'Hydrogen/Carbon', 'High Humates', 'Synthesizer', ARRAY['spring','summer']),
('Croton', 'Croton', 'Ornamental', 417, 'Flow', '#FF7F00', 'Water', '7th (Signal)', 'Signal', '24', 365, 'Tropical foliage plant with vivid orange, red, and yellow variegation.', 'Hydrogen/Carbon', 'High Humates', 'Synthesizer', ARRAY['spring','summer']),

-- 528Hz Alchemy (Yellow energy)
('Snapdragon', 'Snapdragon', 'Ornamental', 528, 'Alchemy', '#FFFF00', 'Fire', '7th (Signal)', 'Signal', '8', 80, 'Cool-season annual with dragon-shaped blooms. Solar alchemy energy.', 'Nitrogen', 'The Three Sisters / Alfalfa-Soybean boost', 'Synthesizer', ARRAY['spring','fall']),
('Daylily', 'Daylily', 'Ornamental', 528, 'Alchemy', '#FFFF00', 'Fire', '7th (Signal)', 'Signal', '18', 365, 'Hardy perennial with golden trumpet blooms. Each flower lasts one solar day.', 'Nitrogen', 'The Three Sisters / Alfalfa-Soybean boost', 'Synthesizer', ARRAY['spring','summer']),
('Chrysanthemum', 'Mum', 'Ornamental', 528, 'Alchemy', '#FFFF00', 'Fire', '7th (Signal)', 'Signal', '18', 90, 'Classic fall bloomer with dense golden flower heads. Solar harvest signal.', 'Nitrogen', 'The Three Sisters / Alfalfa-Soybean boost', 'Synthesizer', ARRAY['fall']),

-- 639Hz Heart (Green energy)
('Hosta', 'Hosta', 'Ornamental', 639, 'Heart', '#00FF00', 'Air', '7th (Signal)', 'Companion', '18', 365, 'Shade-loving perennial grown for lush green foliage. Heart bridge of the garden.', 'Calcium', 'The Structure / Calcium boost', 'Synthesizer', ARRAY['spring','summer','fall']),
('Palm', 'Palm', 'Ornamental', 639, 'Heart', '#00FF00', 'Air', '13th (Top Note)', 'Aerial', '48', 365, 'Tropical canopy plant. Aerial heart connection between sky and earth.', 'Calcium', 'The Structure / Calcium boost', 'Synthesizer', ARRAY['spring','summer']),
('Elephant Ear', 'Elephant Ear', 'Ornamental', 639, 'Heart', '#00FF00', 'Air', '13th (Top Note)', 'Aerial', '36', 120, 'Dramatic tropical foliage with enormous heart-shaped leaves.', 'Calcium', 'The Structure / Calcium boost', 'Synthesizer', ARRAY['spring','summer']),
('Nandina', 'Nandina', 'Ornamental', 639, 'Heart', '#00FF00', 'Air', '7th (Signal)', 'Companion', '30', 365, 'Heavenly Bamboo. Evergreen shrub bridging seasons with color-shifting foliage.', 'Calcium', 'The Structure / Calcium boost', 'Synthesizer', ARRAY['spring','summer','fall']),
('Japanese Maple', 'Japanese Maple', 'Ornamental', 639, 'Heart', '#00FF00', 'Air', '13th (Top Note)', 'Aerial', '72', 365, 'Elegant ornamental tree with delicate heart-shaped leaf canopy.', 'Calcium', 'The Structure / Calcium boost', 'Synthesizer', ARRAY['spring','summer','fall']),

-- 741Hz Signal (Blue energy)
('Hydrangea', 'Hydrangea', 'Ornamental', 741, 'Signal', '#0000FF', 'Ether', '7th (Signal)', 'Signal', '48', 365, 'pH-responsive shrub whose blue blooms signal soil acidity. Living Brix meter.', 'Potassium', 'The Alchemy / Alfalfa sugar boost', 'Synthesizer', ARRAY['spring','summer']),
('Salvia', 'Salvia', 'Ornamental', 741, 'Signal', '#0000FF', 'Ether', '7th (Signal)', 'Signal', '12', 80, 'Aromatic spire blooms that signal pollinators. Expression frequency plant.', 'Potassium', 'The Alchemy / Alfalfa sugar boost', 'Synthesizer', ARRAY['spring','summer','fall']),
('Dusty Miller', 'Dusty Miller', 'Ornamental', 741, 'Signal', '#0000FF', 'Ether', '7th (Signal)', 'Signal', '10', 90, 'Silver-blue foliage annual. Reflective signal plant for garden borders.', 'Potassium', 'The Alchemy / Alfalfa sugar boost', 'Synthesizer', ARRAY['spring','summer','fall']),

-- 852Hz Vision (Indigo energy)
('Purple Passion', 'Purple Passion', 'Ornamental', 852, 'Vision', '#4B0082', 'Light', '7th (Signal)', 'Signal', '12', 365, 'Velvety purple-haired foliage plant. Third eye activation through color.', 'Silica', 'The Master Mix / Sea Mineral complexity', 'Synthesizer', ARRAY['spring','summer']),
('Loropetalum', 'Loropetalum', 'Ornamental', 852, 'Vision', '#4B0082', 'Light', '7th (Signal)', 'Companion', '48', 365, 'Chinese Fringe Flower with deep purple foliage. Vision shrub for borders.', 'Silica', 'The Master Mix / Sea Mineral complexity', 'Synthesizer', ARRAY['spring','summer','fall']),
('Pansy', 'Pansy', 'Ornamental', 852, 'Vision', '#4B0082', 'Light', '7th (Signal)', 'Signal', '6', 60, 'Cool-season face flower in deep purple-indigo. Edible vision blooms.', 'Silica', 'The Master Mix / Sea Mineral complexity', 'Synthesizer', ARRAY['spring','fall']),

-- 963Hz Source (Violet/White energy)
('Impatiens', 'Impatiens', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Signal', '10', 80, 'Shade-loving annual with delicate violet-white blooms. Source energy in shadow.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['spring','summer']),
('New Guinea Impatiens', 'New Guinea Impatiens', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Signal', '12', 80, 'Sun-tolerant variety with larger blooms and darker foliage. Enhanced source.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['spring','summer']),
('Mini Rose', 'Mini Rose', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Signal', '12', 120, 'Miniature rose variety for containers. Concentrated source energy.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['spring','summer','fall']),
('Peony', 'Peony', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Signal', '36', 365, 'Heirloom perennial with voluptuous fragrant blooms. Divine source flower.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['spring']),
('Calla Lily', 'Calla Lily', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Signal', '12', 90, 'Elegant trumpet-shaped bloom. White/violet source channel flower.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['spring','summer']),
('Camellia', 'Camellia', 'Ornamental', 963, 'Source', '#8B00FF', 'Spirit', '7th (Signal)', 'Companion', '60', 365, 'Evergreen flowering shrub with rose-like blooms. Winter source guardian.', 'Sulfur', 'The Carry / Calcium for rot prevention', 'Synthesizer', ARRAY['winter','spring']),
('Hibiscus', 'Hibiscus', 'Ornamental', 528, 'Alchemy', '#FFFF00', 'Fire', '7th (Signal)', 'Signal', '36', 120, 'Tropical flowering shrub with large solar blooms. Edible alchemy flower for teas.', 'Nitrogen', 'The Three Sisters / Alfalfa-Soybean boost', 'Synthesizer', ARRAY['spring','summer']);
