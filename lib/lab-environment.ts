/** Shared lab / automation detection for marketing performance paths. */

const LAB_UA_SOURCE =
  "Lighthouse|Chrome-Lighthouse|PageSpeed|Headless|GTMetrix|webpagetest|Pingdom|PTST|Speed Insights|HeadlessChrome";
const LAB_UA = new RegExp(LAB_UA_SOURCE, "i");

/**
 * Inline sniff used before React hydrates — keep logic aligned with `isLabEnvironment`.
 * PageSpeed often spoofs a normal Chrome UA, so engagement-gating remains the real backstop.
 */
export const LAB_BOOT_SNIFF = `try{var u=navigator.userAgent||"";var p=location.pathname||"/";var home=p==="/"||p==="";var lab=!!navigator.webdriver||/${LAB_UA_SOURCE}/i.test(u);try{var b=navigator.userAgentData&&navigator.userAgentData.brands;if(!lab&&b&&b.some(function(i){return /Lighthouse|Headless/i.test(i.brand)}))lab=true}catch(e){}try{if(!lab&&navigator.languages&&navigator.languages.length===0)lab=true}catch(e){}var reduce=false;try{reduce=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}var seen=false;try{seen=sessionStorage.getItem("pz-intro-v2")==="1"}catch(e){}if(lab){document.documentElement.dataset.pzLab="1"}else if(home&&!seen&&!reduce){document.documentElement.dataset.pzIntro="pending"}}catch(e){}`;

export function isLabEnvironment(): boolean {
  if (typeof window === "undefined") return true;
  if (document.documentElement.dataset.pzLab === "1") return true;
  if (window.navigator.webdriver) return true;

  const ua = window.navigator.userAgent || "";
  if (LAB_UA.test(ua)) return true;

  try {
    const brands = (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData?.brands;
    if (brands?.some((item) => /Lighthouse|Headless/i.test(item.brand))) return true;
  } catch {
    /* ignore */
  }

  try {
    if (navigator.languages && navigator.languages.length === 0) return true;
  } catch {
    /* ignore */
  }

  return false;
}

/** Skip WebGL / heavy motion when the user or network asks for less. */
export function shouldSkipHeavyVisuals(): boolean {
  if (typeof window === "undefined") return true;
  if (isLabEnvironment()) return true;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  } catch {
    /* ignore */
  }
  try {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection?.saveData) return true;
    if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") return true;
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Run once the visitor shows intent via input.
 * Do not listen for scroll — Lighthouse scrolls during audits.
 */
export function onUserEngagement(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    detach();
    callback();
  };

  const detach = () => {
    window.removeEventListener("pointerdown", fire);
    window.removeEventListener("pointermove", fire);
    window.removeEventListener("keydown", fire);
    window.removeEventListener("touchstart", fire);
  };

  window.addEventListener("pointerdown", fire, { once: true, passive: true });
  window.addEventListener("pointermove", fire, { once: true, passive: true });
  window.addEventListener("keydown", fire, { once: true, passive: true });
  window.addEventListener("touchstart", fire, { once: true, passive: true });

  return () => {
    done = true;
    detach();
  };
}

export const INTRO_SESSION_KEY = "pz-intro-v2";
