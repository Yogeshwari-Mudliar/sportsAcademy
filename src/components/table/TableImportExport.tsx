import { useRef } from "react";
import { Download, Upload } from "lucide-react";

interface TableImportExportProps {
  onExport: () => void;
  onImportFile: (file: File) => void | Promise<void>;
  show?: boolean;
  accept?: string;
}

export default function TableImportExport({
  onExport,
  onImportFile,
  show = true,
  accept = ".csv,text/csv",
}: TableImportExportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExport}
        className="h-9 sm:h-10 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition inline-flex items-center gap-1.5"
      >
        <Download size={14} />
        Export
      </button>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-9 sm:h-10 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition inline-flex items-center gap-1.5"
      >
        <Upload size={14} />
        Import
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          await onImportFile(file);
        }}
      />
    </div>
  );
}
