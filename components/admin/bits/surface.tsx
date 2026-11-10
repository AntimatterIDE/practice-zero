import Link from "next/link";
import { cn } from "@/lib/utils";

export const deskFrame =
  "flex flex-col gap-1 rounded-[12px] border border-line bg-mist p-1";

export const deskPanel =
  "rounded-[10px] border border-line bg-card";

export function MetricTile({
  href,
  label,
  value,
  detail,
}: {
  href?: string;
  label: string;
  value: string;
  detail: string;
}) {
  const body = (
    <>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-graphite">{label}</p>
      <p className="mt-2 font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-ink">{value}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-graphite">{detail}</p>
    </>
  );
  const className = "block px-4 py-4 transition-colors hover:bg-mist";
  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function MemberCard({
  href,
  initials,
  name,
  meta,
  note,
  live,
}: {
  href: string;
  initials: string;
  name: string;
  meta: string;
  note: string;
  live?: boolean;
}) {
  return (
    <li className={deskFrame}>
      <Link href={href} className={cn(deskPanel, "flex flex-1 flex-col items-center px-4 py-6 text-center hover:border-line")}>
        <span className="relative">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-[13px] font-medium text-graphite">
            {initials}
          </span>
          <span aria-hidden="true" className="absolute bottom-0 right-0 rounded-full bg-card p-0.5">
            <span className={cn("block h-2.5 w-2.5 rounded-full", live ? "bg-slash" : "bg-line")} />
          </span>
        </span>
        <p className="mt-3 w-full truncate text-[13px] font-medium text-ink">{name}</p>
        <p className="mt-0.5 w-full truncate text-xs text-graphite">{meta}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-graphite">{note}</p>
      </Link>
      <Link
        href={href}
        className="inline-flex h-10 w-full items-center justify-center rounded-[var(--rb-r-lg,10px)] bg-slash text-[13px] font-medium text-paper hover:bg-oxide-deep"
      >
        Open chart
      </Link>
    </li>
  );
}

export function ChartMast({
  initials,
  status,
  live,
  name,
  handle,
  line,
  stats,
  links,
}: {
  initials: string;
  status: string;
  live?: boolean;
  name: string;
  handle: string;
  line?: string;
  stats: { value: string; label: string }[];
  links: { href?: string; label: string; onClick?: () => void }[];
}) {
  return (
    <section className="overflow-hidden rounded-[var(--rb-r-4xl,18px)] border border-line bg-card">
      <div className="px-6 pb-6 pt-8 sm:px-8">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-mist px-3 py-1.5 text-xs font-medium text-graphite">
            <span className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-slash" : "bg-amber-500")} />
            {status}
          </span>
        </div>
        <div className="relative mx-auto mt-6 h-20 w-20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-mist text-lg font-medium text-graphite">
            {initials}
          </div>
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">{name}</h1>
          <p className="mt-1.5 text-sm text-graphite">{handle}</p>
          {line ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-graphite">{line}</p> : null}
        </div>
        <dl className="mt-6 flex items-stretch justify-center divide-x divide-line border-y border-line py-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 flex-1 px-3 text-center sm:px-5">
              <dt className="truncate text-lg font-semibold tabular-nums tracking-tight text-ink">{stat.value}</dt>
              <dd className="mt-0.5 text-xs text-graphite">{stat.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {links.map((link) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[13px] font-medium text-graphite hover:bg-mist"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href || "#"}
                className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[13px] font-medium text-graphite hover:bg-mist"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function ChartTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly (readonly [string, string])[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="sticky top-14 z-20 mt-4 overflow-x-auto rounded-full border border-line bg-mist p-1 lg:top-0" role="tablist" aria-label="Chart">
      <div className="flex min-w-max gap-1">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => onChange(key)}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium",
              active === key ? "bg-card text-ink shadow-sm" : "text-graphite hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
