import { formatNumber } from "@/lib/format";
import type { Tally } from "@/lib/stats";

// Ranked rows: label, count, and a thin bar sized against the top row.
export function BarList({ items, empty }: { items: Tally[]; empty: string }) {
  if (items.length === 0) {
    return <p className="px-4 py-4 text-muted">{empty}</p>;
  }
  const top = items[0].n;

  return (
    <ul className="divide-y divide-rule">
      {items.map((item) => (
        <li key={item.label} className="px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate">{item.label}</span>
            <span className="shrink-0 tabular-nums">{formatNumber(item.n)}</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-rule">
            <div
              className="h-1 rounded-full bg-ink"
              style={{ width: `${(item.n / top) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
