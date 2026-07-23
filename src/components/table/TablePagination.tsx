import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100] as const;

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  label?: string;
  pageSizeOptions?: readonly number[];
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  label = "results",
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-100 mt-4">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <span className="text-xs text-gray-400 font-medium">
          Showing {start} to {end} of {totalItems} {label}
        </span>
        <label className="inline-flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span className="whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-lg text-xs outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, idx) =>
          page === "…" ? (
            <span key={`ellipsis-${idx}`} className="text-gray-400 px-1 font-semibold text-xs">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition ${
                page === currentPage
                  ? "bg-[var(--accent)] text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "…"> = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}
