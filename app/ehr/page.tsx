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

export const metadata: Metadata = {
  title: "EHR",
  description: "Patients, visits, the scribe, intake, agreements, tasks, and requests.",
};

export default function EhrPage() {
  return (
    <div className="min-h-full bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <CategoryIntro
        kicker="EHR"
        title="The chart is already in the room."
        lede="Patients, visits, the scribe, intake, agreements, tasks, and requests. Wednesday morning is already underway."
      />
      <PatientsSection />
      <VisitsSection />
      <ScribeSection />
      <IntakeSection />
      <AgreementsSection />
      <TasksSection />
      <RequestsSection />
      <CategoryClose title="Open the chart." body="Jordan Hale is in room 2. The note stays hidden until you ask to see it." />
      <Footer11 />
    </div>
  );
}
