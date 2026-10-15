export function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M1 7h12" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M7 1v12"
        stroke="currentColor"
        strokeWidth="1.35"
        className="origin-center transition-opacity duration-200 group-data-[state=open]:opacity-0 motion-reduce:transition-none"
      />
    </svg>
  );
}
