import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { AgreementsSection } from "@/components/marketing/ehr/agreements";
import { IntakeSection } from "@/components/marketing/ehr/intake";
import { PatientsSection } from "@/components/marketing/ehr/patients";
import { RequestsSection } from "@/components/marketing/ehr/requests";
import { ScribeSection } from "@/components/marketing/ehr/scribe";
import { TasksSection } from "@/components/marketing/ehr/tasks";
import { VisitsSection } from "@/components/marketing/ehr/visits";
import { CategoryClose, CategoryIntro } from "@/components/marketing/depth";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "EHR",
  description:
    "Patients, visits, the scribe, e-prescribing, labs and results, intake, agreements, tasks, and requests.",
  alternates: { canonical: "/ehr" },
  openGraph: pageOpenGraph({
    title: "EHR · practice zero",
    description:
      "Patients, visits, the scribe, e-prescribing, labs and results, intake, agreements, tasks, and requests.",
    url: "/ehr",
  }),
};

export default function EhrPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <CategoryIntro
        kicker="EHR"
        title="the chart is already in the room."
        lede="Patients, visits, the scribe, e-prescribing, labs and results, intake, agreements, tasks, and requests. Wednesday morning is already underway."
      />
      <PatientsSection />
      <VisitsSection />
      <ScribeSection />
      <IntakeSection />
      <AgreementsSection />
      <TasksSection />
      <RequestsSection />
      <CategoryClose title="open the chart." body="Paul Wallace is in room 2. The note stays hidden until you ask to see it." />
      <Footer11 />
    </div>
  );
}
