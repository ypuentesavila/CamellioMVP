import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-[72px] w-[72px] text-xl",
};

const COLOR_PAIRS: [string, string][] = [
  ["bg-marigold-100", "text-marigold-500"],
  ["bg-azulejo-100", "text-azulejo-600"],
  ["bg-forest-100", "text-forest-600"],
  ["bg-amber-100", "text-amber-500"],
  ["bg-stone-100", "text-stone-600"],
  ["bg-paper-2", "text-stone-600"],
];

function hashName(name: string): number {
  let n = 0;
  for (let i = 0; i < name.length; i++) {
    n = (n + name.charCodeAt(i)) % COLOR_PAIRS.length;
  }
  return n;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const idx = hashName(name);
  const [bg, text] = COLOR_PAIRS[idx];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        sizeClasses[size],
        src ? "" : `${bg} ${text}`,
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{ name: string; src?: string }>;
  max?: number;
  size?: keyof typeof sizeClasses;
}

export function AvatarGroup({ avatars, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((a, i) => (
        <Avatar
          key={i}
          name={a.name}
          src={a.src}
          size={size}
          className="ring-2 ring-card"
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600 ring-2 ring-card",
            sizeClasses[size]
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
