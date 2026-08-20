import type { FilterOption } from "../types";

interface ChipRailProps {
  options: FilterOption[];
  active: string | null;
  onSelect: (name: string) => void;
  loading?: boolean;
}

export function ChipRail({ options, active, onSelect, loading }: ChipRailProps) {
  if (loading) {
    return (
      <div className="chip-rail chip-rail--loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <span className="chip chip--skeleton" key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="chip-rail">
      {options.map((opt) => (
        <button
          key={opt.name}
          type="button"
          className={`chip${active === opt.name ? " chip--active" : ""}`}
          onClick={() => onSelect(opt.name)}
          title={opt.description}
        >
          {opt.name}
        </button>
      ))}
    </div>
  );
}
