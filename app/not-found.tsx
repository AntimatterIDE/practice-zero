import type { Metadata } from "next";
import NotFound7 from "@/components/blocks/404-7";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFound7 />;
}
