import Link from "next/link";
import { ClipboardList, Mic, Stethoscope, User, type LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand-mark";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const columns: {
  title: string;
  links: { label: string; href: string; icon?: LucideIcon }[];
}[] = [
  {
    title: "EHR",
    links: [
      { label: "Patients", href: "/ehr", icon: User },
      { label: "Visits", href: "/ehr", icon: Stethoscope },
      { label: "Scribe", href: "/ehr", icon: Mic },
      { label: "Intake", href: "/ehr", icon: ClipboardList },
    ],
  },
  {
    title: "Billing",
    links: [
      { label: "Collect from payers", href: "/billing" },
      { label: "Eligibility", href: "/billing" },
      { label: "Claims", href: "/billing" },
      { label: "Payers", href: "/billing" },
    ],
  },
  {
    title: "Marketing",
    links: [
      { label: "Outreach", href: "/marketing" },
      { label: "Follow-up", href: "/marketing" },
      { label: "Scheduling", href: "/marketing" },
      { label: "Social", href: "/marketing" },
    ],
  },
  {
    title: "The morning",
    links: [
      { label: "Today", href: "/try" },
      { label: "Open Jordan Hale", href: "/try/patients/pt-hale" },
      { label: "The draft claim", href: "/try/claims/clm-hale" },
      { label: "The practice", href: "/try/practice" },
    ],
  },
  {
    title: "Patient",
    links: [
      { label: "Patient profile", href: "/patient" },
      { label: "See patient experience", href: "/portal" },
      { label: "Portal login", href: "/portal/login" },
      { label: "Messages & documents", href: "/portal/messages" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "AI", href: "/ai" },
      { label: "Research", href: "/research" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
      { label: "Try the demo", href: "/try" },
      { label: "See patient experience", href: "/portal" },
    ],
  },
];

export function Footer11() {
  return (
    <footer className="w-full bg-ink py-16 text-paper sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-10">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="min-w-0">
              <h3 className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper/80">
                {column.title}
              </h3>
              <ul className="space-y-3.5">
                {column.links.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`group inline-flex items-center gap-3 rounded-sm text-[17px] font-medium leading-snug tracking-tight text-paper transition-colors duration-200 hover:text-paper/80 ${focusRing}`}
                    >
                      {Icon ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-paper/20 bg-paper/10 text-paper transition-colors duration-200 group-hover:border-slash group-hover:text-slash">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-paper/10 pt-8 sm:mt-20">
          <BrandMark inverted href="/" />
          <p className="max-w-xl font-sans text-3xl font-semibold lowercase leading-tight tracking-[-0.03em] text-paper sm:text-4xl">
            from the first patient to the <span className="text-foam">claim</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer11;
