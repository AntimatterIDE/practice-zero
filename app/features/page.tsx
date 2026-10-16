import { redirect } from "next/navigation";

/** Old screens index — patient experience is the parallel demo now. */
export default function FeaturesRedirectPage() {
  redirect("/portal");
}
