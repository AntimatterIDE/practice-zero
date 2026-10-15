import { ZeroDevice } from "@/components/marketing/brand-mark";

const lines = [
  "after-hours charting",
  "missed eligibility checks",
  "phone tag with payers",
  "unconfirmed mornings",
];

const tiles = [
  { tone: "ink" as const, title: "after-hours charting." },
  { tone: "paper" as const, title: "phone tag with payers." },
  { tone: "slash" as const, title: "unconfirmed mornings." },
];

export function HomeZeroOut() {
  return (
    <section className="border-t border-line bg-mist px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="kicker">What goes to zero</p>
          <h2 className="mt-5 max-w-[14ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
            the work that should not own the day.
          </h2>
          <p className="mt-4 max-w-md text-base text-graphite">
            Agents clear the backlog so the morning starts at <span className="font-medium text-slash">zero</span>.
          </p>
          <ul className="mt-10 space-y-5">
            {lines.map((line) => (
              <li
                key={line}
                className="relative flex items-center gap-3 text-2xl font-semibold lowercase tracking-[-0.03em] text-graphite sm:text-3xl"
              >
                <span className="font-mono text-slash">ø</span>
                <span className="relative">
                  {line}
                  <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-slash" />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4">
          {tiles.map((tile) => (
            <article
              key={tile.title}
              className={`flex min-h-36 flex-col justify-between rounded-[1.5rem] p-5 ${
                tile.tone === "ink"
                  ? "bg-ink text-paper"
                  : tile.tone === "slash"
                    ? "bg-slash text-paper"
                    : "border border-line bg-paper text-ink"
              }`}
            >
              <ZeroDevice
                tone={tile.tone === "ink" ? "ink" : "default"}
                className={tile.tone === "slash" ? "text-paper" : undefined}
              />
              <p className="font-sans text-xl font-semibold lowercase leading-tight tracking-[-0.03em]">{tile.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
