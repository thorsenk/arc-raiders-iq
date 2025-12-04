export type ItemCategory =
  | "safe-recycle"
  | "expedition-project"
  | "keep-quest"
  | "workshop-upgrade"
  | "other";

export type Rarity = "common" | "uncommon" | "rare" | "epic";

export interface Item {
  id: string; // slug, e.g. "rubber-parts"
  name: string; // display name
  categoryTags: ItemCategory[];
  rarity: Rarity;
  coinValue: number; // sell value
  notes?: string;
}

export type ScenarioType = "quest" | "expedition" | "workshop-upgrade";

export interface ScenarioRequirement {
  itemId: string;
  quantity: number;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  description?: string;
  station?: string; // for workshop upgrades (e.g. "Gunsmith")
  level?: number; // level for workshop upgrades
  requirements: ScenarioRequirement[];
}
