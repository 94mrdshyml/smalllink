import { formatDay, formatNumber } from "@/lib/format";
import type { Day } from "@/lib/stats";

// Top of the y-scale: an even number, so the middle gridline is a whole number too.
function niceMax(max: number) {
  if (max <= 4) return 4;
  if (max <= 20) return Math.ceil(max / 2) * 2;
  const pow = 10 ** Math.floor(Math.log10(max));
  return ([1, 2, 5, 10].map((m) => m * pow).find((v) => v >= max) ?? max);
}

/**
 * Daily bars in plain HTML, so axis text stays 12px at any width.
 * Bars before `splitAt` are drawn grey (the comparison period), the rest in the data hue.
 */
export function BarChart({
  series,
  splitAt = 0,
  label,
}: {
  series: Day[];
  splitAt?: number;
  label: string;
}) {
  const top = niceMax(Math.max(...series.map((d) => d.n), 0));
  const dense = series.length > 14;

  return (
    <figure className="m-0">
      <div className="flex gap-2">
        <div className="relative w-8 shrink-0 text-right text-[12px] tabular-nums text-muted" aria-hidden="true">
          <span className="absolute right-0 top-0 -translate-y-1/2">{formatNumber(top)}</span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2">{formatNumber(top / 2)}</span>
          <span className="absolute bottom-0 right-0 translate-y-1/2">0</span>
          <div className="h-[132px]" />
        </div>

        <div
          role="img"
          aria-label={label}
          className="relative h-[132px] flex-1 border-b border-border"
        >
          <div className="absolute inset-x-0 top-0 border-t border-rule" />
          <div className="absolute inset-x-0 top-1/2 border-t border-rule" />
          <div className={`absolute inset-0 flex items-end ${dense ? "gap-[2px]" : "gap-1.5"}`}>
            {series.map((d, i) => (
              <div
                key={d.date}
                title={`${formatDay(d.date)}: ${formatNumber(d.n)}`}
                className="flex h-full flex-1 items-end"
              >
                {d.n > 0 && (
                  <div
                    className={`w-full rounded-t-[2px] ${i < splitAt ? "bg-prior" : "bg-hue"}`}
                    style={{ height: `${(d.n / top) * 100}%`, minHeight: 2 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-2 flex justify-between pl-10 text-[12px] text-muted">
        <span>{formatDay(series[0].date)}</span>
        <span>{formatDay(series[series.length - 1].date)}</span>
      </figcaption>
    </figure>
  );
}
