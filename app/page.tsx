import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { sampleItems } from "@/data/sampleItems";
import { sampleScenarios } from "@/data/sampleScenarios";

type TabDefinition = {
  value: string;
  label: string;
  content: ReactNode;
};

const tabDefinitions: TabDefinition[] = [
  {
    value: "inventory",
    label: `Inventory (${sampleItems.length})`,
    content: <InventoryTab items={sampleItems} />,
  },
  {
    value: "scenarios",
    label: `Scenarios (${sampleScenarios.length})`,
    content: (
      <div className="space-y-2">
        <p>Scenario samples:</p>
        <ul className="list-disc pl-6">
          {sampleScenarios.map((scenario) => (
            <li key={scenario.id}>{scenario.name}</li>
          ))}
        </ul>
      </div>
    ),
  },
  { value: "actions", label: "Actions", content: <p>Actions placeholder.</p> },
  {
    value: "donors",
    label: "Donors",
    content: <p>Donor reference to be added.</p>,
  },
  { value: "maps", label: "Maps", content: <p>Maps and layouts are on the way.</p> },
];

export default function HomePage() {
  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="flex flex-wrap gap-2">
        {tabDefinitions.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabDefinitions.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="text-base text-muted-foreground">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
