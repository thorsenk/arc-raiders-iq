import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleItems } from "@/data/sampleItems";
import { sampleScenarios } from "@/data/sampleScenarios";

const tabDefinitions = [
  {
    value: "inventory",
    label: `Inventory (${sampleItems.length})`,
    content: (
      <p className="text-base text-muted-foreground">
        Sample items loaded: {sampleItems.length}
      </p>
    ),
  },
  {
    value: "scenarios",
    label: `Scenarios (${sampleScenarios.length})`,
    content: (
      <div className="space-y-2 text-base text-muted-foreground">
        <p>Scenario samples:</p>
        <ul className="list-disc pl-6">
          {sampleScenarios.map((scenario) => (
            <li key={scenario.id}>{scenario.name}</li>
          ))}
        </ul>
      </div>
    ),
  },
  { value: "actions", label: "Actions", content: "Actions placeholder." },
  { value: "donors", label: "Donors", content: "Donor reference to be added." },
  { value: "maps", label: "Maps", content: "Maps and layouts are on the way." },
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
