import type { BrowseMode } from "../types";

interface HeaderBoardProps {
  query: string;
  onQueryChange: (q: string) => void;
  mode: BrowseMode;
  onModeChange: (m: BrowseMode) => void;
  favoritesCount: number;
  onSurpriseMe: () => void;
}

const TABS: { id: BrowseMode; label: string }[] = [
  { id: "search", label: "Search" },
  { id: "category", label: "Categories" },
  { id: "cuisine", label: "Cuisines" },
  { id: "ingredient", label: "By ingredient" },
  { id: "favorites", label: "Favorites" },
];

export function HeaderBoard({
  query,
  onQueryChange,
  mode,
  onModeChange,
  favoritesCount,
  onSurpriseMe,
}: HeaderBoardProps) {
  return (
    <header className="board-header">
      <div className="board-header__top">
        <div className="board-header__brand">
          <span className="board-header__mark">&#127859;</span>
          <div>
            <h1 className="board-header__title">The Board</h1>
            <p className="board-header__tagline">a recipe finder, chalked up fresh</p>
          </div>
        </div>
        <button className="surprise-btn" onClick={onSurpriseMe} type="button">
          Surprise me
        </button>
      </div>

      <div className="board-header__search">
        <input
          className="search-input"
          type="search"
          placeholder="Search for a dish, e.g. &ldquo;chicken tikka&rdquo;&hellip;"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            if (mode !== "search") onModeChange("search");
          }}
          aria-label="Search recipes by name"
        />
      </div>

      <nav className="board-tabs" role="tablist" aria-label="Browse mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={mode === t.id}
            className={`board-tab${mode === t.id ? " board-tab--active" : ""}`}
            onClick={() => onModeChange(t.id)}
            type="button"
          >
            {t.label}
            {t.id === "favorites" && favoritesCount > 0 && (
              <span className="board-tab__badge">{favoritesCount}</span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
