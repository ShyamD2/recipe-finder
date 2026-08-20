import { useEffect, useMemo, useState } from "react";
import { HeaderBoard } from "./components/HeaderBoard";
import { ChipRail } from "./components/ChipRail";
import { RecipeGrid } from "./components/RecipeGrid";
import { RecipeModal } from "./components/RecipeModal";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useFavorites } from "./hooks/useFavorites";
import * as api from "./lib/api";
import type { BrowseMode, FilterOption, LoadState, RecipeDetail, RecipeSummary } from "./types";

export default function App() {
  const [mode, setMode] = useState<BrowseMode>("search");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [areas, setAreas] = useState<FilterOption[]>([]);
  const [ingredients, setIngredients] = useState<FilterOption[]>([]);
  const [filterListState, setFilterListState] = useState<LoadState>("idle");

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [gridState, setGridState] = useState<LoadState>("idle");

  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [openRecipeDetail, setOpenRecipeDetail] = useState<RecipeDetail | null>(null);
  const [openRecipeLoading, setOpenRecipeLoading] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Load filter option lists once, lazily, the first time each tab is visited.
  useEffect(() => {
    if (mode === "category" && categories.length === 0) {
      setFilterListState("loading");
      api
        .listCategories()
        .then((opts) => {
          setCategories(opts);
          setFilterListState("success");
        })
        .catch(() => setFilterListState("error"));
    }
    if (mode === "cuisine" && areas.length === 0) {
      setFilterListState("loading");
      api
        .listAreas()
        .then((names) => {
          setAreas(names.map((name) => ({ name })));
          setFilterListState("success");
        })
        .catch(() => setFilterListState("error"));
    }
    if (mode === "ingredient" && ingredients.length === 0) {
      setFilterListState("loading");
      api
        .listIngredients()
        .then((names) => {
          setIngredients(names.slice(0, 60).map((name) => ({ name })));
          setFilterListState("success");
        })
        .catch(() => setFilterListState("error"));
    }
  }, [mode, categories.length, areas.length, ingredients.length]);

  // Fetch the recipe grid whenever the active mode/query/filter changes.
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (mode === "favorites") return; // rendered directly from favorites state
      if (mode === "search") {
        if (!debouncedQuery.trim()) {
          setRecipes([]);
          setGridState("idle");
          return;
        }
        setGridState("loading");
        try {
          const results = await api.searchRecipesByName(debouncedQuery.trim());
          if (cancelled) return;
          setRecipes(results);
          setGridState(results.length ? "success" : "empty");
        } catch {
          if (!cancelled) setGridState("error");
        }
        return;
      }

      if (!activeFilter) {
        setRecipes([]);
        setGridState("idle");
        return;
      }

      setGridState("loading");
      try {
        const fetcher =
          mode === "category"
            ? api.filterByCategory
            : mode === "cuisine"
              ? api.filterByArea
              : api.filterByIngredient;
        const results = await fetcher(activeFilter);
        if (cancelled) return;
        setRecipes(results);
        setGridState(results.length ? "success" : "empty");
      } catch {
        if (!cancelled) setGridState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [mode, debouncedQuery, activeFilter]);

  function openRecipe(id: string) {
    setOpenRecipeId(id);
    setOpenRecipeDetail(null);
    setOpenRecipeLoading(true);
    api
      .getRecipeById(id)
      .then((detail) => setOpenRecipeDetail(detail))
      .finally(() => setOpenRecipeLoading(false));
  }

  async function surpriseMe() {
    setOpenRecipeLoading(true);
    setOpenRecipeDetail(null);
    const detail = await api.getRandomRecipe();
    setOpenRecipeId(detail?.id ?? "random");
    setOpenRecipeDetail(detail);
    setOpenRecipeLoading(false);
  }

  function handleModeChange(next: BrowseMode) {
    setMode(next);
    setActiveFilter(null);
    if (next !== "search") setGridState("idle");
  }

  const activeOptions = mode === "category" ? categories : mode === "cuisine" ? areas : ingredients;

  const emptyHint = useMemo(() => {
    if (mode === "search") return "Type a dish name above to start searching.";
    if (mode === "favorites") return "No saved recipes yet — tap the star on any card to pin it here.";
    return "Pick a chip above to see recipes.";
  }, [mode]);

  return (
    <div className="board">
      <HeaderBoard
        query={query}
        onQueryChange={setQuery}
        mode={mode}
        onModeChange={handleModeChange}
        favoritesCount={favorites.length}
        onSurpriseMe={surpriseMe}
      />

      <main className="board-main">
        {(mode === "category" || mode === "cuisine" || mode === "ingredient") && (
          <ChipRail
            options={activeOptions}
            active={activeFilter}
            onSelect={setActiveFilter}
            loading={filterListState === "loading"}
          />
        )}

        {mode === "favorites" ? (
          <RecipeGrid
            recipes={favorites}
            state={favorites.length ? "success" : "empty"}
            isFavorite={isFavorite}
            onOpen={openRecipe}
            onToggleFavorite={toggleFavorite}
            emptyHint={emptyHint}
          />
        ) : (
          <RecipeGrid
            recipes={recipes}
            state={gridState}
            isFavorite={isFavorite}
            onOpen={openRecipe}
            onToggleFavorite={toggleFavorite}
            emptyHint={emptyHint}
          />
        )}
      </main>

      <RecipeModal
        recipeId={openRecipeId}
        detail={openRecipeDetail}
        loading={openRecipeLoading}
        isFavorite={openRecipeDetail ? isFavorite(openRecipeDetail.id) : false}
        onClose={() => setOpenRecipeId(null)}
        onToggleFavorite={(detail) => toggleFavorite(detail)}
      />

      <footer className="board-footer">
        Recipe data from{" "}
        <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
          TheMealDB
        </a>
        . Favorites are saved in this browser only.
      </footer>
    </div>
  );
}
