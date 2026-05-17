import { cn } from "@/lib/utils";

type Density = "sparse" | "med" | "dense";

interface TileConfig {
  cols: number;
  rows: number;
  w: number;
  h: number;
  gap: number;
}

const CONFIGS: Record<Density, TileConfig> = {
  sparse: { cols: 4, rows: 3, w: 16, h: 10, gap: 3.5 },
  med:    { cols: 6, rows: 4, w: 13, h: 8,  gap: 3   },
  dense:  { cols: 8, rows: 6, w: 10, h: 6,  gap: 2.5 },
};

const COLORS = ["#1E2A3A", "#234478", "#F3B033"];
const RADII  = [2, 2, 99];

interface MosaicoProps {
  density?: Density;
  opacity?: number;
  className?: string;
}

export function Mosaico({
  density = "med",
  opacity = 0.8,
  className,
}: MosaicoProps) {
  const { cols, rows, w, h, gap } = CONFIGS[density];

  const tiles: {
    x: number;
    y: number;
    color: string;
    rx: number;
    tileW: number;
    tileH: number;
  }[] = [];

  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 1 ? (w + gap) / 2 : 0;
    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) % 3;
      const x = c * (w + gap) + offset;
      const y = r * (h + gap);
      tiles.push({
        x,
        y,
        color: COLORS[idx],
        rx: RADII[idx],
        tileW: w,
        tileH: h,
      });
    }
  }

  const svgW = cols * (w + gap) - gap + (w + gap) / 2;
  const svgH = rows * (h + gap) - gap;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      {tiles.map((t, i) => (
        <rect
          key={i}
          x={t.x}
          y={t.y}
          width={t.tileW}
          height={t.tileH}
          rx={t.rx}
          fill={t.color}
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
