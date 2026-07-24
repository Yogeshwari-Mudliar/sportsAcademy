interface StatusDotProps {
  status: "Active" | "Inactive" | string;
  className?: string;
}

/** Green/red status indicator shown next to a row name. */
export default function StatusDot({ status, className = "" }: StatusDotProps) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${
        isActive ? "bg-green-500" : "bg-red-500"
      } ${className}`}
      title={isActive ? "Active" : "Inactive"}
      aria-label={isActive ? "Active" : "Inactive"}
    />
  );
}
