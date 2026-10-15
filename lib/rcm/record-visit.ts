export function recordVisitHref(visit: { id: string; start: string; reason: string }, name: string) {
  const params = new URLSearchParams({
    appointment: visit.id,
    label: name,
    when: visit.start,
    reason: visit.reason,
  });
  return `/try/visits?${params.toString()}`;
}
