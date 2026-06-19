// src/components/dashboard/PageTitle.tsx

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({
  title,
  subtitle,
}: PageTitleProps) {
  return (
    <div>
      <h1>{title}</h1>

      {subtitle && (
        <p>{subtitle}</p>
      )}
    </div>
  );
}