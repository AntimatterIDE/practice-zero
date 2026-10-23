"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand-mark";
import { useHideOnScroll } from "@/lib/use-hide-on-scroll";
import { cn } from "@/lib/utils";
import type { DesktopMenu, MobileMenu } from "@/components/marketing/site-header-menus";

type AudienceId = "practice" | "patient";

type MenuModule = {
  DesktopMenu: typeof DesktopMenu;
  MobileMenu: typeof MobileMenu;
};

const audiences = [
  { id: "practice", label: "Practice" },
  { id: "patient", label: "Patient" },
] as const satisfies readonly { id: AudienceId; label: string }[];

const practiceHrefs = ["/ehr", "/billing", "/marketing", "/ai", "/onboarding", "/research", "/specialties"];

function audienceActive(id: AudienceId, pathname: string) {
  if (id === "practice") {
    return practiceHrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
  }
  return (
    pathname === "/patient" ||
    pathname.startsWith("/patient/") ||
    pathname === "/portal" ||
    pathname.startsWith("/portal/")
  );
}

const flatLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<AudienceId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [menus, setMenus] = useState<MenuModule | null>(null);
  const menusLoading = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const hideChrome = useHideOnScroll(mobile || !!open);

  const ensureMenus = () => {
    if (menusLoading.current) return;
    menusLoading.current = true;
    void import("@/components/marketing/site-header-menus").then((mod) => {
      setMenus({ DesktopMenu: mod.DesktopMenu, MobileMenu: mod.MobileMenu });
    });
  };

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobile]);

  const clearClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const closeMega = () => {
    clearClose();
    setOpen(null);
  };

  const showAudience = (id: AudienceId) => {
    clearClose();
    ensureMenus();
    setOpen(id);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 -mx-4 bg-paper/95 px-4 backdrop-blur transition-transform duration-300 ease-out sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
          hideChrome && "-translate-y-full pointer-events-none",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="flex items-center justify-between gap-4 py-3">
          <span onMouseEnter={closeMega} onFocus={closeMega} className="inline-flex">
            <BrandMark size="md" />
          </span>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="practice zero">
            {audiences.map((audience) => {
              const shown = open === audience.id;
              const active = audienceActive(audience.id, pathname);
              return (
                <button
                  key={audience.id}
                  type="button"
                  aria-expanded={shown}
                  aria-haspopup="true"
                  aria-controls={shown ? `${audience.id}-menu` : undefined}
                  onMouseEnter={() => showAudience(audience.id)}
                  onClick={() => showAudience(audience.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm text-graphite transition-colors hover:text-ink",
                    (shown || active) && "text-ink",
                  )}
                >
                  {audience.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 text-graphite/70 transition-transform duration-200",
                      shown && "rotate-180 text-slash",
                    )}
                    aria-hidden
                  />
                </button>
              );
            })}
            {flatLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onMouseEnter={closeMega}
                onFocus={closeMega}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 text-sm text-graphite hover:text-ink",
                  pathname === link.href && "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/try"
              prefetch={false}
              onMouseEnter={closeMega}
              onFocus={closeMega}
              className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-slash px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Try the demo
            </Link>
            <Link
              href="/portal"
              prefetch={false}
              onMouseEnter={closeMega}
              onFocus={closeMega}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-graphite hover:text-ink"
            >
              See patient experience
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink xl:hidden"
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => {
              ensureMenus();
              setMobile((value) => !value);
            }}
          >
            {mobile ? "Close" : "Menu"}
          </button>
        </div>
        {menus ? <menus.DesktopMenu audienceId={open} onEnter={clearClose} /> : null}
      </header>

      {menus && mobile ? <menus.MobileMenu onClose={() => setMobile(false)} /> : null}
    </>
  );
}
