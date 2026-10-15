"use client";

import Link from "next/link";
import { createContext, useContext } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Tilt = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
};

const TiltContext = createContext<Tilt | null>(null);

export function TiltFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 22, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 70, damping: 22, mass: 0.8 });

  return (
    <TiltContext.Provider value={{ sx, sy, reduce: !!reduce }}>
      <div
        className={className}
        onPointerMove={(event) => {
          if (reduce) return;
          const rect = event.currentTarget.getBoundingClientRect();
          px.set((event.clientX - rect.left) / rect.width - 0.5);
          py.set((event.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {children}
      </div>
    </TiltContext.Provider>
  );
}

export function Drift({
  dx,
  dy,
  className,
  children,
}: {
  dx: number;
  dy: number;
  className?: string;
  children: React.ReactNode;
}) {
  const tilt = useContext(TiltContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const x = useTransform(tilt?.sx ?? fallbackX, [-0.5, 0.5], [-dx, dx]);
  const y = useTransform(tilt?.sy ?? fallbackY, [-0.5, 0.5], [-dy, dy]);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function CategoryIntro({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-4 pt-16 lg:pt-24">
      <p className="kicker">{kicker}</p>
      <h1 className="mt-6 max-w-3xl font-sans text-5xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">{lede}</p>
    </div>
  );
}

export function CategorySection({
  eyebrow,
  title,
  body,
  children,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
  flip?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <motion.div
          className={flip ? "lg:order-2" : undefined}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="kicker">{eyebrow}</p>
          <h2 className="mt-4 font-sans text-4xl font-semibold lowercase leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-graphite sm:text-lg">{body}</p>
        </motion.div>
        <motion.div
          className={flip ? "lg:order-1" : undefined}
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function CategoryClose({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20">
        <h2 className="max-w-xl font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink sm:text-5xl">
          {title}
        </h2>
        <p className="max-w-lg text-lg text-graphite">{body}</p>
        <Link
          href="/try"
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Try the demo
        </Link>
      </div>
    </div>
  );
}
