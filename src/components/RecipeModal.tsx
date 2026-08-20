import { useEffect, useState } from "react";
import type { RecipeDetail } from "../types";

interface RecipeModalProps {
  recipeId: string | null;
  detail: RecipeDetail | null;
  loading: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (recipe: RecipeDetail) => void;
}

export function RecipeModal({
  recipeId,
  detail,
  loading,
  isFavorite,
  onClose,
  onToggleFavorite,
}: RecipeModalProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setChecked(new Set());
  }, [recipeId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!recipeId) return null;

  const toggleIngredient = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const instructionSteps = (detail?.instructions ?? "")
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={detail?.name ?? "Recipe"}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-card__close" onClick={onClose} aria-label="Close" type="button">
          &times;
        </button>

        {loading || !detail ? (
          <div className="modal-card__loading">Pulling the card&hellip;</div>
        ) : (
          <>
            <div className="modal-card__hero">
              <img src={`${detail.thumb}/medium`} alt={detail.name} />
            </div>

            <div className="modal-card__content">
              <div className="modal-card__headline">
                <h2>{detail.name}</h2>
                <button
                  className="modal-card__fav"
                  aria-pressed={isFavorite}
                  onClick={() => onToggleFavorite(detail)}
                  type="button"
                >
                  {isFavorite ? "\u2605 Saved" : "\u2606 Save recipe"}
                </button>
              </div>

              <div className="modal-card__tags">
                {detail.category && <span className="tag tag--category">{detail.category}</span>}
                {detail.area && <span className="tag tag--area">{detail.area}</span>}
                {detail.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="modal-card__columns">
                <section className="modal-section">
                  <h3 className="modal-section__title">Ingredients</h3>
                  <ul className="ingredient-list">
                    {detail.ingredients.map((line, i) => {
                      const key = `${line.ingredient}-${i}`;
                      const isChecked = checked.has(key);
                      return (
                        <li key={key}>
                          <label className="ingredient-list__item">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleIngredient(key)}
                            />
                            <span className={isChecked ? "ingredient-list__done" : ""}>
                              <strong>{line.measure}</strong> {line.ingredient}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="modal-section modal-section--wide">
                  <h3 className="modal-section__title">Method</h3>
                  <ol className="method-list">
                    {instructionSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>

                  <div className="modal-card__links">
                    {detail.youtube && (
                      <a href={detail.youtube} target="_blank" rel="noreferrer">
                        Watch on YouTube &rarr;
                      </a>
                    )}
                    {detail.source && (
                      <a href={detail.source} target="_blank" rel="noreferrer">
                        Original source &rarr;
                      </a>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
