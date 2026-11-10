import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "min-h-11 rounded-[10px] bg-slash px-5 py-3 text-paper hover:bg-oxide-deep active:scale-[0.99]",
        secondary:
          "min-h-11 rounded-[10px] border border-line bg-card px-5 py-3 text-ink hover:bg-mist",
        ghost: "text-ink underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />;
}
