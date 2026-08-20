import type { FilterOption, RecipeDetail, RecipeSummary } from "../types";

// TheMealDB's public test API key ("1") is free, rate-limit-friendly, and
// requires no signup — ideal for a drop-in demo. Swap this base URL for a
// licensed key / different provider for production use.
const BASE = "https://www.themealdb.com/api/json/v1/1";

interface RawMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string | null;
  strYoutube?: string;
  strSource?: string;
  [key: string]: string | null | undefined;
}

function toSummary(m: RawMeal): RecipeSummary {
  return {
    id: m.idMeal,
    name: m.strMeal,
    thumb: m.strMealThumb,
    category: m.strCategory,
    area: m.strArea,
  };
}

function toDetail(m: RawMeal): RecipeDetail {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = m[`strIngredient${i}`];
    const measure = m[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: (measure ?? "").trim(),
      });
    }
  }
  return {
    ...toSummary(m),
    instructions: m.strInstructions ?? "",
    tags: m.strTags ? m.strTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    youtube: m.strYoutube || undefined,
    source: m.strSource || undefined,
    ingredients,
  };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function searchRecipesByName(query: string): Promise<RecipeSummary[]> {
  const data = await getJson<{ meals: RawMeal[] | null }>(
    `${BASE}/search.php?s=${encodeURIComponent(query)}`
  );
  return (data.meals ?? []).map(toSummary);
}

export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
  const data = await getJson<{ meals: RawMeal[] | null }>(`${BASE}/lookup.php?i=${id}`);
  const meal = data.meals?.[0];
  return meal ? toDetail(meal) : null;
}

export async function getRandomRecipe(): Promise<RecipeDetail | null> {
  const data = await getJson<{ meals: RawMeal[] | null }>(`${BASE}/random.php`);
  const meal = data.meals?.[0];
  return meal ? toDetail(meal) : null;
}

export async function filterByCategory(category: string): Promise<RecipeSummary[]> {
  const data = await getJson<{ meals: RawMeal[] | null }>(
    `${BASE}/filter.php?c=${encodeURIComponent(category)}`
  );
  return (data.meals ?? []).map(toSummary);
}

export async function filterByArea(area: string): Promise<RecipeSummary[]> {
  const data = await getJson<{ meals: RawMeal[] | null }>(
    `${BASE}/filter.php?a=${encodeURIComponent(area)}`
  );
  return (data.meals ?? []).map(toSummary);
}

export async function filterByIngredient(ingredient: string): Promise<RecipeSummary[]> {
  const data = await getJson<{ meals: RawMeal[] | null }>(
    `${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`
  );
  return (data.meals ?? []).map(toSummary);
}

export async function listCategories(): Promise<FilterOption[]> {
  const data = await getJson<{
    categories: { strCategory: string; strCategoryThumb: string; strCategoryDescription: string }[];
  }>(`${BASE}/categories.php`);
  return data.categories.map((c) => ({
    name: c.strCategory,
    thumb: c.strCategoryThumb,
    description: c.strCategoryDescription,
  }));
}

export async function listAreas(): Promise<string[]> {
  const data = await getJson<{ meals: { strArea: string }[] }>(`${BASE}/list.php?a=list`);
  return data.meals.map((m) => m.strArea).sort((a, b) => a.localeCompare(b));
}

export async function listIngredients(): Promise<string[]> {
  const data = await getJson<{ meals: { strIngredient: string }[] }>(`${BASE}/list.php?i=list`);
  return data.meals.map((m) => m.strIngredient).filter(Boolean).sort((a, b) => a.localeCompare(b));
}
