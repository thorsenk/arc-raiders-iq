"use client";

import { Input } from "@/components/ui/input";
import { Item } from "@/data/types";
import { useInventory } from "@/lib/useInventory";

interface InventoryTabProps {
  items: Item[];
}

export const InventoryTab = ({ items }: InventoryTabProps) => {
  const [inventory, updateItemQuantity] = useInventory();

  const handleQuantityChange = (itemId: string, value: string) => {
    const parsed = Number(value);
    updateItemQuantity(itemId, Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Track what you have on hand. Quantities are saved locally in your
        browser.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Categories</th>
              <th className="px-3 py-2 font-semibold">Rarity</th>
              <th className="px-3 py-2 font-semibold">Coin Value</th>
              <th className="px-3 py-2 font-semibold">Owned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-medium">{item.name}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {item.categoryTags.join(", ")}
                </td>
                <td className="px-3 py-2 capitalize text-muted-foreground">
                  {item.rarity}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{item.coinValue}</td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={inventory[item.id] ?? 0}
                    onChange={(event) =>
                      handleQuantityChange(item.id, event.target.value)
                    }
                    className="h-9 w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
