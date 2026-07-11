import clsx from "clsx";
import { categoryBySlug } from "@/lib/data";

export function ProductImage({
  categorySlug,
  name,
  className,
  variant = "card",
}: {
  categorySlug: string;
  name?: string;
  className?: string;
  variant?: "card" | "detail";
  /** compat — não utilizado */
  iconSize?: number;
}) {
  const cat = categoryBySlug(categorySlug);
  const accent = cat?.accent ?? "#2E6B4F";
  const title = (name ?? cat?.name ?? "Manipulado")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/®|™/g, "")
    .trim();

  const detail = variant === "detail";

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#F1EFE8]",
        className
      )}
    >
      <div
        className={clsx("relative", detail ? "h-[94%]" : "h-[74%]")}
        style={{ aspectRatio: "448 / 557" }}
      >
        {/* frasco (imagem real, fundo transparente) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/frasco-tua.png"
          alt={`Frasco ${title} — Tua Pharma`}
          className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.18)]"
        />

        {/* rótulo (muda por produto) */}
        <div
          className={clsx(
            "absolute flex flex-col items-center justify-center text-center",
            detail ? "px-3" : "px-1.5"
          )}
          style={{ left: "18.5%", right: "18.5%", top: "39%", bottom: "22%" }}
        >
          <span
            className={clsx(
              "font-display font-light uppercase tracking-[0.3em] text-green-900",
              detail ? "text-base" : "text-[6.5px]"
            )}
          >
            Tua Pharma
          </span>
          <span
            className={clsx("my-1 border-t", detail ? "w-20" : "w-7")}
            style={{ borderColor: accent }}
          />
          <span
            className={clsx(
              "line-clamp-3 font-semibold leading-tight text-ink",
              detail ? "text-2xl" : "text-[9px]"
            )}
          >
            {title}
          </span>
          <span
            className={clsx(
              "mt-1.5 font-semibold uppercase tracking-wide",
              detail ? "text-sm" : "text-[6px]"
            )}
            style={{ color: accent }}
          >
            Manipulado
          </span>
          <span
            className={clsx(
              "mt-2 font-medium text-ink/50",
              detail ? "text-xs" : "text-[5.5px]"
            )}
          >
            30 cápsulas · 500 mg
          </span>
        </div>
      </div>
    </div>
  );
}
