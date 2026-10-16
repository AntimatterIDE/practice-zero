export function AdminPageHeader({
  title,
  lede,
  meta,
  actions,
}: {
  title: string;
  lede?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-line pb-6">
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">{title}</h1>
        {lede ? <div className="mt-2 text-sm leading-relaxed text-graphite">{lede}</div> : null}
        {meta ? <div className="mt-2 text-xs leading-relaxed text-graphite">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
