import clsx from "clsx";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { tua: "text-lg", line: "w-16", pharma: "text-[0.55rem]" },
    md: { tua: "text-2xl", line: "w-24", pharma: "text-[0.65rem]" },
    lg: { tua: "text-4xl", line: "w-40", pharma: "text-[0.8rem]" },
  }[size];

  return (
    <span
      className={clsx("inline-flex flex-col items-center leading-none", className)}
      aria-label="Tua Pharma"
    >
      <span
        className={clsx(
          "font-display font-light text-gold",
          "tracking-[0.35em] pl-[0.35em]",
          scale.tua
        )}
      >
        TUA
      </span>
      <span
        className={clsx(
          "my-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent",
          scale.line
        )}
      />
      <span
        className={clsx(
          "font-display font-light text-gold/85",
          "tracking-[0.5em] pl-[0.5em]",
          scale.pharma
        )}
      >
        PHARMA
      </span>
    </span>
  );
}
