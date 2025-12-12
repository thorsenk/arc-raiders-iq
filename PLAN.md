# Implementation Plan: Complete ARC Raiders IQ Core Features

## Overview
Build the missing components and features to make the inventory planning dashboard functional. Based on the [ARC Raiders Wiki loot system](https://arcraiders.wiki/wiki/Loot) and gameplay mechanics, items can be recycled, used for quests, expeditions, and workshop upgrades.

---

## New Context Integration (Dec 2025): “Value per Slot” + Recycle/Donor Intelligence

This plan is updated to reflect two high-signal sources of context:

- **ARC Raiders Wiki Loot tables**: provide structured fields we can compute with (rarity, sell price, max stack size, recycle outputs, and “keep for quests/workshop” hints). Source: [ARC Raiders Wiki – Loot](https://arcraiders.wiki/wiki/Loot)
- **Gameplay “tips & tricks” transcript**: emphasizes practical inventory economics:
  - **Value density / stash management**: “pack the most value/materials into one square”
  - **Stack management**: small stacks aren’t worth it; big stacks drive profitability
  - **Recycle vs sell**: decision depends on what you need and which outcome is more valuable
  - **Donor targeting**: know what items break into (e.g., items that produce scarce materials)

### Key Product Principle

The app should support **two decision modes**:

1. **Goal-driven mode (Scenarios active)**: “What do I need for quests/expeditions/workshop right now?”
2. **Economy-driven mode (No scenarios / extra loot)**: “What is the best use of an inventory slot?”
   - Use **value-per-slot** and **recycle-yield-per-slot** metrics to guide “keep/sell/recycle” decisions.

---

## Phase 0: Expand Loot Data Model (Unblocks Better Decisions)

### 0.1 Add Loot Economics Fields to Items
- **File**: `data/types.ts`
- **Action**: Extend `Item` to include (as available from wiki or internal data):
  - `sellPrice?: number` (aka “Sell Price” on the wiki)
  - `maxStackSize?: number`
  - `recyclable?: boolean` (some items cannot be recycled)
  - `recyclesTo?: Array<{ materialId: string; quantity: number }>` *(or itemId-based if we model refined materials as items)*
- **Notes**:
  - Keep these optional initially so the app still works with partial data.
  - We can progressively enrich `sampleItems.ts` without blocking UI work.

### 0.2 Add Material Model (Optional but Recommended)
- **File**: `data/types.ts`
- **Action**: Introduce `Material` and/or treat “materials” as `Item`s with a `kind: "loot" | "material"` discriminator.
- **Why**: Donor targeting requires a stable target key (e.g., “springs”) and consistent yield modeling.

### 0.3 Add Derived Metrics Utility
- **File**: `lib/lootMetrics.ts` *(new)*
- **Action**: Pure helpers:
  - `getSellValuePerSlot(item) = sellPrice * maxStackSize` (when both exist)
  - `getRecycleYieldPerSlot(item)` (aggregate yields * stack size; if modeled)
  - `formatValue(n)` helper for UI
- **Output**: Used by Donors + ActionsTab (economy-driven mode).

---

## Phase 1: Fix Critical Blocker

### 1.1 Create Missing Input Component
- **File**: `components/ui/input.tsx`
- **Action**: Create shadcn/ui Input component matching the design system
- **Details**: Standard input with proper styling, forwardRef, className merging via `cn()` utility
- **Reference**: Follow pattern from `components/ui/tabs.tsx` (Radix UI primitive + styling)

---

## Phase 2: Scenario Selection System

### 2.1 Create useScenarioSelection Hook
- **File**: `lib/useScenarioSelection.ts`
- **Action**: Create hook similar to `useInventory` pattern
- **Features**:
  - State: `string[]` of active scenario IDs
  - localStorage key: `"arc-raiders-iq:active-scenarios"`
  - Functions: `toggleScenario(id)`, `setActiveScenarios(ids[])`
  - SSR-safe (check `typeof window`)
  - Initialize with empty array (unlike inventory which initializes all items to 0)

### 2.2 Create ScenariosTab Component
- **File**: `components/scenarios/ScenariosTab.tsx`
- **Action**: Replace placeholder in `app/page.tsx`
- **Features**:
  - Display all scenarios from `sampleScenarios`
  - Show scenario type badge (quest/expedition/workshop-upgrade)
  - Show name, description, station/level (if workshop)
  - Toggle checkboxes to activate/deactivate scenarios
  - Display requirements list per scenario (item name + quantity)
  - Visual distinction: active (checked) vs inactive scenarios
  - Use `useScenarioSelection` hook
  - Empty state: "Select scenarios to track requirements"

---

## Phase 3: ActionsTab with Decision Logic

### 3.1 Create Item Action Type
- **File**: `data/types.ts`
- **Action**: Add new type definition
```typescript
export type ItemAction = "farm" | "keep" | "keep-recycle-surplus" | "recycle" | "flexible";
```

### 3.2 Create Action Calculation Utility
- **File**: `lib/calculateItemActions.ts`
- **Action**: Create pure function to compute actions for all items
- **Logic** (based on transcript + wiki):
  1. Calculate total required quantity per item across active scenarios
  2. Get current inventory quantity
  3. Determine action based on priority (goal-driven mode):
     - **Farm**: `required > 0` AND `inventory < required` → Need to acquire more
     - **Keep**: `required > 0` AND `inventory >= required` AND item has `"keep-quest"` tag → Always keep some for future quests
     - **Keep & Recycle Surplus**: `required > 0` AND `inventory > required` AND item has `"safe-recycle"` tag → Keep required, recycle excess
     - **Recycle**: `required === 0` AND item has `"safe-recycle"` tag AND NOT `"keep-quest"` tag → Not needed, safe to recycle
     - **Flexible**: Default fallback for edge cases (e.g., `"other"` category, items with conflicting tags like `["keep-quest", "safe-recycle"]` but no active requirements)
- **Additional Logic (economy-driven mode)**:
  - When **no active scenarios**, do NOT default everything to recycle.
  - Instead, prefer:
    - **Keep** for items flagged as “keep for quests/workshop” (from tags or future data enrichment)
    - **Recycle** for items with strong recycle yield-per-slot (when modeled) *and* recyclable
    - **Flexible** when we lack sell/stack/yield data (so we don’t recommend wrong actions)
- **Input**: `items: Item[]`, `scenarios: Scenario[]`, `activeScenarioIds: string[]`, `inventory: Record<string, number>`
- **Output**: `Record<string, { action: ItemAction, required: number, owned: number, deficit?: number, surplus?: number }>`

### 3.3 Create ActionsTab Component
- **File**: `components/actions/ActionsTab.tsx`
- **Action**: Replace placeholder in `app/page.tsx`
- **Features**:
  - Group items by action type (Farm / Keep / Keep & Recycle Surplus / Recycle / Flexible)
  - Display item name, rarity badge, required quantity, owned quantity
  - Show deficit amounts for "Farm" items (e.g., "Need 5 more")
  - Show surplus amounts for "Keep & Recycle Surplus" items (e.g., "Can recycle 3")
  - Color-coded sections per action type:
    - Farm: Yellow/Orange (needs attention)
    - Keep: Green (good to go)
    - Keep & Recycle Surplus: Blue (optimize)
    - Recycle: Red/Gray (can clear out)
    - Flexible: Gray (review manually)
  - Empty state message if no active scenarios: "Select scenarios in the Scenarios tab to see recommended actions"
  - Sort items within each group by deficit (Farm) or surplus (Keep & Recycle Surplus)
  - Economy-driven hint (when no active scenarios):
    - Show optional columns if available: `sellPrice`, `maxStackSize`, and computed `valuePerSlot`
    - Add a small note: “When no goals are selected, recommendations use value/slot and recycle yields where available.”

---

## Phase 4: Donors + Value Density (Transcript-driven “Stack Management” Tools)

### 4.1 Create Donor Calculation Utility
- **File**: `lib/calculateDonors.ts` *(new)*
- **Action**: Given a `materialId`, rank donor items by efficiency:
  - `yieldPerItem`, `yieldPerStack`, `yieldPerSlot` (where stack size exists)
  - Provide “top donors” list and a fallback “unknown” bucket if yields are missing

### 4.2 Create DonorsTab Component
- **File**: `components/donors/DonorsTab.tsx` *(new)*
- **Action**: Replace placeholder in `app/page.tsx`
- **Features**:
  - Select a target material (e.g., “springs” once modeled)
  - Show best donor items and how many target units per slot they represent
  - Optionally show “sell vs recycle” callout if sell price is known

### 4.3 Add “Run Profile” Presets (Optional)
- **File**: `data/runProfiles.ts` *(new)*
- **Action**: Presets that shift prioritization (e.g., “Money Run / Lush Event” emphasizes high stack + high sell price).
- **Why**: Mirrors transcript logic that certain events/areas change what’s “best”.

---

## Phase 5: Update Main Page

### 5.1 Update app/page.tsx
- **File**: `app/page.tsx`
- **Actions**:
  - Import `ScenariosTab` and `ActionsTab`
  - Replace placeholder content for "scenarios" and "actions" tabs
  - Replace placeholder content for "donors" tab (DonorsTab)
  - Pass `sampleScenarios` to `ScenariosTab`
  - Update tab labels dynamically:
    - Scenarios: Show active count (e.g., "Scenarios (2/3)")
    - Actions: Show action counts (e.g., "Actions (3 Farm, 5 Keep)")

---

## Implementation Order

1. **Phase 1** (Critical): Create Input component → unblocks InventoryTab
2. **Phase 2**: Build scenario selection system → enables ActionsTab logic
3. **Phase 3**: Build ActionsTab (goal-driven) → core feature
4. **Phase 0**: Expand data model + metrics (can be done incrementally alongside UI; required for Donors/value density)
5. **Phase 4**: Donors + value density tools (transcript-driven)
6. **Phase 5**: Wire everything together → complete integration + better tab labels/counts

---

## Data Flow

```
User selects scenarios → useScenarioSelection → localStorage
User updates inventory → useInventory → localStorage
ActionsTab reads both → calculateItemActions → displays grouped actions
DonorsTab reads loot model → calculateDonors + lootMetrics → displays best donor items
```

---

## Decision Logic Examples (from sample data)

- **Metal Parts** (`safe-recycle`, `expedition-project`):
  - If active expedition needs 15, inventory = 10 → **Farm** (need 5)
  - If active expedition needs 15, inventory = 20 → **Keep & Recycle Surplus** (recycle 5)
  - If no active scenarios → **Recycle** (safe to recycle, not quest item)

- **Battery** (`keep-quest`, `safe-recycle`):
  - If active quest needs 6, inventory = 8 → **Keep** (has keep-quest tag, always keep some)
  - If no active scenarios → **Flexible** (has keep-quest tag, don't auto-recycle)

- **Leaper Pulse Unit** (`expedition-project`, `other`):
  - If active expedition needs 3, inventory = 1 → **Farm** (need 2)
  - If no active scenarios → **Flexible** (epic rarity, "other" category)

---

## Files to Create

1. `components/ui/input.tsx` - Input component
2. `lib/useScenarioSelection.ts` - Scenario selection hook
3. `components/scenarios/ScenariosTab.tsx` - Scenario selection UI
4. `lib/calculateItemActions.ts` - Action calculation logic
5. `components/actions/ActionsTab.tsx` - Actions display UI
6. `lib/lootMetrics.ts` - Value-per-slot and yield utilities
7. `lib/calculateDonors.ts` - Donor ranking logic
8. `components/donors/DonorsTab.tsx` - Donors UI
9. `data/runProfiles.ts` - Optional run prioritization presets

## Files to Modify

1. `data/types.ts` - Add `ItemAction` + loot economics fields (sell price, stack size, recycle outputs)
2. `data/sampleItems.ts` - Enrich items incrementally with sell/stack/recycle info
3. `app/page.tsx` - Wire up new components, update tab content

---

## Testing Considerations

- Test with 0 active scenarios (should show recycle/flexible states)
- Test with overlapping scenario requirements (sum quantities correctly)
- Test edge cases:
  - Items with `["keep-quest", "safe-recycle"]` but no active requirements → Flexible
  - Items with `["other"]` category → Flexible
  - Items needed by multiple scenarios → sum requirements
- Verify localStorage persistence across page refreshes
- Test SSR safety (window checks)
- Test action priority (Farm > Keep > Keep & Recycle Surplus > Recycle > Flexible)
- If sell/stack/yield fields are present:
  - Validate value-per-slot computation
  - Validate donors ranking for a target material
  - Validate that missing data falls back to “Flexible / Unknown” (avoid misleading recommendations)

---

## Notes

- All user data persists in localStorage (no backend)
- SSR-safe implementation required (check `typeof window`)
- Follow existing patterns from `useInventory` hook
- Use shadcn/ui component patterns for consistency
- Decision logic based on ARC Raiders gameplay mechanics and loot data from the community wiki: [ARC Raiders Wiki – Loot](https://arcraiders.wiki/wiki/Loot)

