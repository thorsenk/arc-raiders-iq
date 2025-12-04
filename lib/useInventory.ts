"use client";

import { useEffect, useState } from "react";
import { sampleItems } from "@/data/sampleItems";

const STORAGE_KEY = "arc-raiders-iq:inventory";

const createEmptyInventory = (): Record<string, number> => {
  return sampleItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = 0;
    return acc;
  }, {});
};

const readInventoryFromStorage = (): Record<string, number> => {
  if (typeof window === "undefined") {
    return createEmptyInventory();
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createEmptyInventory();
  }

  try {
    const parsed = JSON.parse(stored) as Record<string, number> | null;
    if (parsed && typeof parsed === "object") {
      return {
        ...createEmptyInventory(),
        ...parsed,
      };
    }
  } catch (error) {
    console.warn("Failed to parse inventory from localStorage", error);
  }

  return createEmptyInventory();
};

const persistInventory = (inventory: Record<string, number>) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<Record<string, number>>(
    createEmptyInventory,
  );

  useEffect(() => {
    const initialInventory = readInventoryFromStorage();
    setInventory(initialInventory);
  }, []);

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setInventory((previous) => {
      const nextInventory = {
        ...previous,
        [itemId]: Number.isFinite(quantity) ? Math.max(0, quantity) : 0,
      };

      persistInventory(nextInventory);
      return nextInventory;
    });
  };

  return [inventory, updateItemQuantity] as const;
};
