import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabDefinitions = [
  { value: "inventory", label: "Inventory", content: "Inventory content coming soon." },
  { value: "scenarios", label: "Scenarios", content: "Scenarios will live here." },
  { value: "actions", label: "Actions", content: "Actions placeholder." },
  { value: "donors", label: "Donors", content: "Donor reference to be added." },
  { value: "maps", label: "Maps", content: "Maps and layouts are on the way." }
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
          <p className="text-base text-muted-foreground">{tab.content}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
