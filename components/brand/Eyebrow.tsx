import * as React from "react";

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** "light" = cobalt on paper/mist; "dark" = foam on ink. */
  tone?: "light" | "dark";
}

/** The mono kicker above every headline ("THE AUTONOMOUS PRACTICE"). One style, everywhere. */
export function Eyebrow({ tone = "light", className = "", children, ...rest }: EyebrowProps) {
  return (
    <p
      className={`font-mono text-xs font-medium uppercase tracking-[0.14em] ${tone === "light" ? "text-slash" : "text-foam"} ${className}`.trim()}
      {...rest}
    >
      {children}
    </p>
  );
}
