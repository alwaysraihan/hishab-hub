export interface DoughnutSegment {
  label: string;
  value: number;
  /** CSS colour (can be a CSS variable, e.g. "var(--primary)"). */
  color: string;
}

export interface DoughnutChartProps {
  segments: readonly DoughnutSegment[];
  /** Accessible description of the chart (Bangla). */
  ariaLabel: string;
  /** Text in the centre (e.g. a percentage). */
  centerLabel?: string;
  centerSub?: string;
  size?: number;
}

/** Pure-SVG doughnut chart (no chart library). */
export function DoughnutChart({ segments, ariaLabel, centerLabel, centerSub, size = 180 }: DoughnutChartProps) {
  const total = segments.reduce((a, s) => a + Math.max(s.value, 0), 0);
  // Geometry in a 100×100 viewBox.
  const strokeWidth = 14;
  const radius = 50 - strokeWidth / 2 - 1;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={ariaLabel} className="shrink-0">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      {total > 0
        ? segments.map((s) => {
            const len = (Math.max(s.value, 0) / total) * circumference;
            const el = (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
              />
            );
            offset += len;
            return el;
          })
        : null}
      {centerLabel ? (
        <text x="50" y={centerSub ? 48 : 53} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
          {centerLabel}
        </text>
      ) : null}
      {centerSub ? (
        <text x="50" y="62" textAnchor="middle" fontSize="7.5" fill="var(--muted)">
          {centerSub}
        </text>
      ) : null}
    </svg>
  );
}

/** Colour legend for a chart. */
export function ChartLegend({ items }: { items: ReadonlyArray<{ label: string; value: string; color: string }> }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2 text-[15px]">
          <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ background: i.color }} />
          <span className="text-muted">{i.label}:</span>
          <span className="tabular font-semibold text-text">{i.value}</span>
        </li>
      ))}
    </ul>
  );
}
