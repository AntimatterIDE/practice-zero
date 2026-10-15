import Link from "next/link";

const stories = [
  {
    kicker: "The morning",
    title: "The day is already moving.",
    body: "Today, the schedule, requests, and tasks are mid-morning. Four finished runs sit on the board: eligibility, a note, a queued claim, and a balance text.",
    href: "/try",
    label: "Open Today",
  },
  {
    kicker: "The chart",
    title: "The 9:00 patient is in a room.",
    body: "Jordan Hale has demographics, coverage, intake answers, and a signed consent. The visit note is ready when you ask for it.",
    href: "/try/patients/pt-hale",
    label: "Open Jordan Hale",
  },
  {
    kicker: "Getting paid",
    title: "The claim from that visit is a draft.",
    body: "Eligibility is already on file. Submit moves the draft to accepted in the browser. An older claim fills denials and payments.",
    href: "/try/claims/clm-hale",
    label: "Open the draft claim",
  },
  {
    kicker: "The practice",
    title: "The practice is two people and a profile.",
    body: "People and the practice profile are part of the same sample morning. Nothing here is a public clinic site.",
    href: "/try/practice",
    label: "Open the practice",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="font-display text-xl">
          Practice Zero
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/features" className="underline decoration-line underline-offset-4">
            Features
          </Link>
          <Link href="/try" className="rounded-full bg-pine px-4 py-2 text-paper">
            Try the demo
          </Link>
        </nav>
      </header>
      <main>
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-oxide-deep">Agentic EHR</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">Software for any independent practice.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Practice Zero is the company and the product. The demo is one fictional morning. You click through the practice software. Writes stay in the browser.
          </p>
        </section>
        <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20">
          {stories.map((story) => (
            <article key={story.href} className="rounded-3xl border border-line bg-card p-6 sm:p-8">
              <p className="text-sm font-medium text-oxide-deep">{story.kicker}</p>
              <h2 className="mt-2 font-display text-3xl">{story.title}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{story.body}</p>
              <Link href={story.href} className="mt-5 inline-flex text-sm font-medium underline underline-offset-4">
                {story.label}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
