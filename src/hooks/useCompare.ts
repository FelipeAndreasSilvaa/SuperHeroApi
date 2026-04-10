import { useState } from "react";
import { HeroSchema } from "@/schemas/hero";

export function useCompare() {
  const [compare, setCompare] = useState<HeroSchema[]>([]);

  const toggle = (hero: HeroSchema) => {
    setCompare((prev) => {
      if (prev.some((h) => h.id === hero.id)) {
        return prev.filter((h) => h.id !== hero.id);
      }
      if (prev.length >= 2) return prev;
      return [...prev, hero];
    });
  };

  const clear = () => setCompare([]);

  const isComparing = (id: number) =>
    compare.some((h) => h.id === id);

  return { compare, toggle, clear, isComparing };
}