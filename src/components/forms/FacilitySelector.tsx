import { ACADEMY_FACILITIES } from "../../types/academy";

interface FacilitySelectorProps {
  selected: string[];
  onToggle: (facility: string) => void;
}

export default function FacilitySelector({
  selected,
  onToggle,
}: FacilitySelectorProps) {
  return (
    <div className="facility-grid">
      {ACADEMY_FACILITIES.map((facility) => {
        const checked = selected.includes(facility);
        return (
          <label
            key={facility}
            className={`facility-chip ${checked ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(facility)}
            />
            <span>{facility}</span>
          </label>
        );
      })}
    </div>
  );
}
