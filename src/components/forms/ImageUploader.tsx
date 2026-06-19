import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploaderProps {
  title: string;
  hint?: string;
  required?: boolean;
  multiple?: boolean;
  variant?: "square" | "wide";
}

export default function ImageUploader({
  title,
  hint,
  required,
  multiple = false,
  variant = "square",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setFileNames(Array.from(files).map((f) => f.name));
  };

  return (
    <div className="uploader-field">
      <label className="form-label">
        {title}
        {required && <span className="required">*</span>}
      </label>

      <button
        type="button"
        className={`uploader-dropzone ${variant}`}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={28} className="uploader-icon" />
        <span className="uploader-main">
          {fileNames.length > 0
            ? fileNames.join(", ")
            : title.toLowerCase().includes("logo")
            ? "Click to upload logo"
            : multiple
            ? "Click to upload images"
            : "Click to upload cover image"}
        </span>
        {multiple && (
          <span className="uploader-sub">You can upload multiple images</span>
        )}
        {hint && <span className="uploader-sub">{hint}</span>}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
