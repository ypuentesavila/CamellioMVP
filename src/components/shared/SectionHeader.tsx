import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: { label: string; href: string };
}

export function SectionHeader({ title, count, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-text-primary">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-xs font-medium text-primary hover:text-blue-700 transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
