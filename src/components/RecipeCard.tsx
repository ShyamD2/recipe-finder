import type { RecipeSummary } from "../types";

interface RecipeCardProps {
  recipe: RecipeSummary;
  isFavorite: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (recipe: RecipeSummary) => void;
}

export function RecipeCard({ recipe, isFavorite, onOpen, onToggleFavorite }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button
        className="recipe-card__pin"
        type="button"
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe);
        }}
      >
        {isFavorite ? "\u2605" : "\u2606"}
      </button>

      <button className="recipe-card__body" onClick={() => onOpen(recipe.id)} type="button">
        <div className="recipe-card__thumb-wrap">
          <img
            className="recipe-card__thumb"
            src={`${recipe.thumb}/medium`}
            alt={recipe.name}
            loading="lazy"
          />
        </div>
        <div className="recipe-card__meta">
          <h3 className="recipe-card__title">{recipe.name}</h3>
          <div className="recipe-card__tags">
            {recipe.category && <span className="tag tag--category">{recipe.category}</span>}
            {recipe.area && <span className="tag tag--area">{recipe.area}</span>}
          </div>
        </div>
      </button>
    </article>
  );
}
