import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  linkHref,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-1 font-display text-2xl font-light text-green-900 md:text-3xl">
          {title}
        </h2>
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="group hidden shrink-0 items-center gap-1 text-sm font-medium text-green-700 hover:text-gold-dark sm:flex"
        >
          {linkLabel ?? "Ver todos"}
          <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
