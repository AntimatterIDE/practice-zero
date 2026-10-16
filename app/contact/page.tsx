import type { Metadata } from "next";
import Contact10 from "@/components/blocks/contact-10";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a practice zero consultation for your independent practice.",
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph({
    title: "Contact · practice zero",
    description: "Request a practice zero consultation for your independent practice.",
    url: "/contact",
  }),
};

export default function ContactPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <Contact10 />
      </main>
      <Footer11 />
    </div>
  );
}