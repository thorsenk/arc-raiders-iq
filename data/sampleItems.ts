import { Item } from "./types";

export const sampleItems: Item[] = [
  {
    id: "rubber-parts",
    name: "Rubber Parts",
    categoryTags: ["keep-quest", "expedition-project"],
    rarity: "common",
    coinValue: 30, // TODO: confirm value from cheat sheet
    notes: "Flexible scraps commonly pulled from scavenged gear.",
  },
  {
    id: "metal-parts",
    name: "Metal Parts",
    categoryTags: ["safe-recycle", "expedition-project"],
    rarity: "common",
    coinValue: 25, // TODO: confirm value from cheat sheet
    notes: "Basic scrap used for most crafting and recycling jobs.",
  },
  {
    id: "arc-alloy",
    name: "ARC Alloy",
    categoryTags: ["workshop-upgrade", "expedition-project"],
    rarity: "rare",
    coinValue: 120, // TODO: confirm value from cheat sheet
    notes: "High-grade alloy salvaged from ARC tech.",
  },
  {
    id: "battery",
    name: "Battery",
    categoryTags: ["keep-quest", "safe-recycle"],
    rarity: "uncommon",
    coinValue: 40, // TODO: confirm value from cheat sheet
    notes: "Reusable power source for field repairs and tasks.",
  },
  {
    id: "light-bulb",
    name: "Light Bulb",
    categoryTags: ["keep-quest", "safe-recycle"],
    rarity: "common",
    coinValue: 15, // TODO: confirm value from cheat sheet
    notes: "Fragile bulbs often requested in simple errands.",
  },
  {
    id: "leaper-pulse-unit",
    name: "Leaper Pulse Unit",
    categoryTags: ["expedition-project", "other"],
    rarity: "epic",
    coinValue: 200, // TODO: confirm value from cheat sheet
    notes: "Specialized component harvested from Leapers.",
  },
  {
    id: "rocketeer-driver",
    name: "Rocketeer Driver",
    categoryTags: ["workshop-upgrade", "expedition-project"],
    rarity: "rare",
    coinValue: 160, // TODO: confirm value from cheat sheet
    notes: "Core drive salvaged from Rocketeer units.",
  },
  {
    id: "alarm-clock",
    name: "Alarm Clock",
    categoryTags: ["keep-quest", "safe-recycle"],
    rarity: "uncommon",
    coinValue: 35, // TODO: confirm value from cheat sheet
    notes: "Analog timers that occasionally surface in errands.",
  },
  {
    id: "accordion",
    name: "Accordion",
    categoryTags: ["other", "keep-quest"],
    rarity: "uncommon",
    coinValue: 50, // TODO: confirm value from cheat sheet
    notes: "Sentimental loot sometimes requested by settlers.",
  },
  {
    id: "water-pump",
    name: "Water Pump",
    categoryTags: ["keep-quest", "expedition-project"],
    rarity: "rare",
    coinValue: 90, // TODO: confirm value from cheat sheet
    notes: "Bulky component valued for settlement upkeep.",
  },
];
