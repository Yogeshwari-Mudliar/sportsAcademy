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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-100 mt-4">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <span className="text-xs text-gray-400 font-medium text-center sm:text-left">
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold inline-flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-xs text-gray-400 font-medium px-1 whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-9 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold inline-flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
