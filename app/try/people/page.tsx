import { PageHeader } from "@/components/admin/rcm/ui";
import { sampleStaff } from "@/lib/rcm/seed";

export default function PeoplePage() {
  return (
    <main>
      <PageHeader kicker="Practice" title="People" lede="The two people who work this sample morning." />
      <ul className="mt-8 grid gap-3">
        {sampleStaff.map((person) => (
          <li key={person.id} className="rounded-2xl border border-line bg-card p-4">
            <p className="font-semibold">{person.name}</p>
            <p className="mt-1 text-sm text-muted">{person.role}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
