

## Add Companion Planting Data for Aromatic Crops

### Overview
Update the `companion_crops` and `crop_guild` arrays for all 16 new aromatic species in the `master_crops` table. Each aromatic will be linked to the canopy trees, food crops, and guild partners it best protects or enhances within its frequency zone.

### Data Updates (by frequency zone)

**396Hz — Foundation**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Bee Balm (Scarlet) | Tomatoes, Peppers, Carrots, Beetroot | Desirable Pecan, Pawnee Pecan, Sweet Fern, Sweet Woodruff |
| Sweet Woodruff | Carrots, Beetroot, Ramps | Desirable Pecan, Pawnee Pecan, Bee Balm, Sweet Fern |
| Sweet Fern | Tomatoes, Peppers, Blueberry | Desirable Pecan, Pawnee Pecan, Bee Balm, Sweet Woodruff |

**417Hz — Flow**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Citronella Grass | Cucumber, Squash, Melon, Celery | Issai Hardy Kiwi, Comfrey, Shiso |
| Shiso (Red Perilla) | Cucumber, Eggplant, Okra | Issai Hardy Kiwi, Citronella Grass, Comfrey |

**528Hz — Alchemy**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Sweet Marjoram | Corn, Pole Beans, Squash, Peppers | Chicago Hardy Fig, Goumi Berry, Honeysuckle, Pyrethrum Daisy |
| Pyrethrum Daisy | Corn, Cabbage, Broccoli, Kale | Chicago Hardy Fig, Thornless Honey Locust, Sweet Marjoram |
| Honeysuckle (Japanese) | Corn, Pole Beans, Squash | Chicago Hardy Fig, Celeste Fig, Goumi Berry, Sweet Marjoram |

**639Hz — Heart**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Lemon Balm | Kale, Broccoli, Cabbage, Lettuce | Serviceberry, Mulberry, Star Jasmine, Catnip |
| Catnip | Collards, Kale, Cabbage, Squash | Serviceberry, Mulberry, Lemon Balm, Star Jasmine |
| Star Jasmine | Broccoli, Cabbage, Lettuce | Serviceberry, Mulberry, Lemon Balm, Catnip |

**741Hz — Expression**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Anise Hyssop | Gooseberry, Black Currant, Jostaberry | Hinnomaki Red Gooseberry, Titania Black Currant, Mexican Oregano |
| Mexican Oregano | Gooseberry, Black Currant, Peppers | Hinnomaki Red Gooseberry, Cascade Hops, Anise Hyssop |

**852Hz — Vision**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Feverfew | Pawpaw, Turmeric, Ginger | Pennsylvania Golden Pawpaw, Sunflower Pawpaw, Spicebush |

**963Hz — Source**
| Aromatic | companion_crops | crop_guild |
|---|---|---|
| Night-Blooming Jasmine | Persimmon, Elderberry | American Persimmon, York Elderberry, Southernwood |
| Southernwood | Persimmon, Elderberry, Garlic | American Persimmon, York Elderberry, Night-Blooming Jasmine |

### Technical Details

**Single database migration** using UPDATE statements to set `companion_crops` and `crop_guild` arrays for each of the 16 species, matched by their `name` (scientific name key).

No code changes are needed -- the existing `ScentCorridorPanel`, `CompanionEngine`, and `ChordComposer` components already read `companion_crops` and `crop_guild` from the `master_crops` table and will automatically display the new relationships.

