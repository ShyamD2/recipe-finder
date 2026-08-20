/** Slim recipe record as returned by search/filter list endpoints. */
export interface RecipeSummary {
  id: string;
  name: string;
  thumb: string;
  category?: string;
  area?: string;
}

export interface IngredientLine {
  ingredient: string;
  measure: string;
}

/** Full recipe record as returned by the lookup endpoint. */
export interface RecipeDetail extends RecipeSummary {
  instructions: string;
  tags: string[];
  youtube?: string;
  source?: string;
  ingredients: IngredientLine[];
}

export type BrowseMode = "search" | "category" | "cuisine" | "ingredient" | "favorites";

export interface FilterOption {
  name: string;
  thumb?: string;
  description?: string;
}

export type LoadState = "idle" | "loading" | "success" | "error" | "empty";
