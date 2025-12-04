import { Scenario } from "./types";

export const sampleScenarios: Scenario[] = [
  {
    id: "expedition-project-sample",
    type: "expedition",
    name: "Expedition Project – Sample",
    description: "Lightweight expedition bundle to test requirement wiring.",
    requirements: [
      { itemId: "rubber-parts", quantity: 12 },
      { itemId: "metal-parts", quantity: 15 },
      { itemId: "arc-alloy", quantity: 4 },
      { itemId: "leaper-pulse-unit", quantity: 3 },
    ],
  },
  {
    id: "keep-for-quests-sample",
    type: "quest",
    name: "Keep for Quests – Sample",
    description: "Representative quest turn-ins pulled from the cheat sheet guidance.",
    requirements: [
      { itemId: "battery", quantity: 6 },
      { itemId: "light-bulb", quantity: 10 },
      { itemId: "alarm-clock", quantity: 5 },
      { itemId: "accordion", quantity: 3 },
    ],
  },
  {
    id: "gunsmith-upgrade-2",
    type: "workshop-upgrade",
    name: "Gunsmith Upgrade – Level 2",
    station: "Gunsmith",
    level: 2,
    description: "Seed data for a low-level Gunsmith upgrade path.",
    requirements: [
      { itemId: "rocketeer-driver", quantity: 6 },
      { itemId: "arc-alloy", quantity: 5 },
      { itemId: "water-pump", quantity: 4 },
      { itemId: "metal-parts", quantity: 12 },
    ],
  },
];
