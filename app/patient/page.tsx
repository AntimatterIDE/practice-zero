import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { PatientLanding } from "@/components/marketing/patient/patient-landing";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Patient profile",
  description:
    "The patient portal and profile — login, messages, documents, updates, and a clear view of personal health information.",
  alternates: { canonical: "/patient" },
};

export default function PatientPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <PatientLanding />
      </main>
      <Footer11 />
    </div>
  );
}
