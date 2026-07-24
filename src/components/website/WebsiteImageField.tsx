import { useRef } from "react";
import { Upload, X } from "lucide-react";

export const IMAGE_MAX_MB = 2.5;

/** Reads an image file into a data-URL for localStorage-backed website content. */
export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

interface WebsiteImageFieldProps {
  label: string;
  /** Recommended pixel size shown to the user, e.g. "400 × 400 px" */
  recommendedSize: string;
  /** Max file size in MB (default 2.5) */
  maxMb?: number;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}

export default function WebsiteImageField({
  label,
  recommendedSize,
  maxMb = IMAGE_MAX_MB,
  hint,
  value,
  onChange,
}: WebsiteImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxBytes = maxMb * 1024 * 1024;

  const onPick = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > maxBytes) {
      window.alert(
        `Image is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please keep it under ${maxMb} MB.`
      );
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      window.alert("Could not read that image. Try another file.");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2.5 text-xs text-indigo-900 space-y-1">
        <p>
          <span className="font-semibold">Recommended size:</span> {recommendedSize}
        </p>
        <p>
          <span className="font-semibold">Max file size:</span> {maxMb} MB
        </p>
        <p className="text-indigo-700/80">Formats: PNG, JPG, WEBP</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-28 w-full sm:w-44 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition flex flex-col items-center justify-center gap-1.5 text-indigo-600"
        >
          <Upload size={22} />
          <span className="text-xs font-semibold">Upload image</span>
          <span className="text-[10px] text-indigo-400">Max {maxMb} MB</span>
        </button>
        {value ? (
          <div className="relative h-28 flex-1 min-w-0 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
            <img src={value} alt="" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/90 border shadow-sm hover:bg-red-50 text-red-500"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="h-28 flex-1 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 px-3 text-center">
            No image selected
            <br />
            Use {recommendedSize}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/*"
        className="hidden"
        onChange={(e) => {
          void onPick(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-indigo-400"
      />
    </div>
  );
}
