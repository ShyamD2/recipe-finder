import type { LoadState, RecipeSummary } from "../types";
import { RecipeCard } from "./RecipeCard";

interface RecipeGridProps {
  recipes: RecipeSummary[];
  state: LoadState;
  isFavorite: (id: string) => boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (recipe: RecipeSummary) => void;
  emptyHint?: string;
}

export function RecipeGrid({
  recipes,
  state,
  isFavorite,
  onOpen,
  onToggleFavorite,
  emptyHint,
}: RecipeGridProps) {
  if (state === "loading") {
    return (
      <div className="recipe-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="recipe-card recipe-card--skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="board-message board-message--error">
        <p>Couldn&rsquo;t reach the recipe box. Check your connection and try again.</p>
      </div>
    );
  }

  if (state === "empty" || recipes.length === 0) {
    return (
      <div className="board-message">
        <p>{emptyHint ?? "Nothing here yet. Try a different search or filter."}</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((r) => (
        <RecipeCard
          key={r.id}
          recipe={r}
          isFavorite={isFavorite(r.id)}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
