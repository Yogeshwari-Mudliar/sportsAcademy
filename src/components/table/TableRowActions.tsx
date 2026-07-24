import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Edit3, Eye, Layers, MoreVertical, UserCheck, UserX } from "lucide-react";

interface TableRowActionsProps {
  onView: () => void;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onAssignBatch?: () => void;
  /** When true, menu shows Deactivate; otherwise Activate */
  isActive?: boolean;
  showActions?: boolean;
  /** When false, only View is shown (no edit / activate) */
  canEdit?: boolean;
}

export default function TableRowActions({
  onView,
  onEdit,
  onToggleStatus,
  onAssignBatch,
  isActive = true,
  showActions = true,
  canEdit = true,
}: TableRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const showManage = canEdit && Boolean(onEdit || onToggleStatus);
  const menuHeight = onAssignBatch && canEdit ? 172 : showManage ? 132 : 52;
  const menuWidth = 160;

  const placeMenu = () => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8
    );

    if (openUpward) {
      setCoords({
        bottom: window.innerHeight - rect.top + 4,
        left,
      });
    } else {
      setCoords({
        top: rect.bottom + 4,
        left,
      });
    }
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setCoords(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCoords(null);
      }
    };
    const onScrollOrResize = () => {
      setOpen(false);
      setCoords(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  if (!showActions) return null;

  const run = (fn: () => void) => {
    setOpen(false);
    setCoords(null);
    fn();
  };

  return (
    <div ref={rootRef} className="relative inline-flex justify-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (open) {
            setOpen(false);
            setCoords(null);
            return;
          }
          placeMenu();
          setOpen(true);
        }}
        className="inline-flex items-center justify-center p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition touch-manipulation"
        aria-label="Actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[100] min-w-[160px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            style={{
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              icon={<Eye size={14} />}
              label="View"
              onClick={() => run(onView)}
            />
            {canEdit && onEdit && (
              <MenuItem
                icon={<Edit3 size={14} />}
                label="Edit"
                onClick={() => run(onEdit)}
              />
            )}
            {canEdit && onAssignBatch && (
              <MenuItem
                icon={<Layers size={14} />}
                label="Assign Batch"
                onClick={() => run(onAssignBatch)}
              />
            )}
            {canEdit && onToggleStatus && (
              <MenuItem
                icon={isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                label={isActive ? "Deactivate" : "Activate"}
                onClick={() => run(onToggleStatus)}
                danger={isActive}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="opacity-80">{icon}</span>
      {label}
    </button>
  );
}
