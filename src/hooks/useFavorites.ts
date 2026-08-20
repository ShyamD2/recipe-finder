import { useCallback, useEffect, useState } from "react";
import type { RecipeSummary } from "../types";

const STORAGE_KEY = "recipe-finder:favorites";

function readStored(): RecipeSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecipeSummary[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<RecipeSummary[]>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage unavailable (e.g. private browsing quota) — fail silently
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((recipe: RecipeSummary) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === recipe.id)
        ? prev.filter((f) => f.id !== recipe.id)
        : [...prev, recipe]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
