import { Plus } from "lucide-react";

interface TableAddButtonProps {
  label?: string;
  onClick: () => void;
  show?: boolean;
}

export default function TableAddButton({
  label = "Add",
  onClick,
  show = true,
}: TableAddButtonProps) {
  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition inline-flex items-center justify-center gap-2 shadow-sm touch-manipulation"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
