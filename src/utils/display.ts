const DAY_LETTER: Record<string, string> = {
  sunday: "S",
  sun: "S",
  monday: "M",
  mon: "M",
  tuesday: "T",
  tue: "T",
  tues: "T",
  wednesday: "W",
  wed: "W",
  thursday: "T",
  thu: "T",
  thur: "T",
  thurs: "T",
  friday: "F",
  fri: "F",
  saturday: "S",
  sat: "S",
};

/** Convert "Mon, Wed, Fri" → "M, W, F" */
export function abbreviateDays(days: string): string {
  if (!days?.trim()) return "—";
  return days
    .split(/[,|/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const key = part.toLowerCase();
      if (DAY_LETTER[key]) return DAY_LETTER[key];
      // Already a single letter
      if (/^[smtwf]$/i.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase();
    })
    .join(", ");
}

/** Truncate long text; full value available via title tooltip. */
export function truncateText(value: string, max = 24): string {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}
