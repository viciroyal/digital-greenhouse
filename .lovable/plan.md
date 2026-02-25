

# Make Multi-Select Obvious on Both Wizards

## Problem
Both the First Garden and Advanced Planner already support multiple selections on their respective steps, but there is no visual indicator telling users they can pick more than one option.

## Changes

### 1. First Garden (`src/pages/FirstGarden.tsx`)
- Add a subtitle under "What do you want to grow?" (step 2) saying **"Select all that apply"**
- Show a count badge (e.g., "2 selected") when multiple goals are chosen

### 2. Advanced Planner (`src/pages/CropOracle.tsx`)
- Add a subtitle hint under "What energy do you need?" (step 2) saying **"Select up to 3 zones"**
- The multi-zone selection and count display already exist but the hint text will make it clearer

## Technical Details
- FirstGarden: Add a conditional `<p>` tag after the `<h2>` on step 2 with the hint text, styled to match existing subtitle patterns (`text-xs text-center`, muted color)
- CropOracle: Update the existing subtitle text on step 2 from just "STEP 2 -- THE VIBE" to include "Select up to 3" guidance

### Files Modified
- `src/pages/FirstGarden.tsx` -- Add hint text for step 2
- `src/pages/CropOracle.tsx` -- Update subtitle text for step 2

