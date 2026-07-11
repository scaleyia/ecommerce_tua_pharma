"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { banners } from "@/lib/data";
import { Icon } from "./Icon";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const total = banners.length;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section className="container-tua pt-6">
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((b) => (
            <div
              key={b.id}
              className="relative min-w-full"
              style={{
                backgroundImage: `linear-gradient(120deg, ${b.gradient[0]}, ${b.gradient[1]})`,
              }}
            >
              {/* decoração */}
              <Icon
                name={b.icon}
                className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-gold/10 md:block"
                size={340}
                strokeWidth={0.6}
              />
              <span className="absolute right-24 top-10 h-40 w-40 rounded-full border border-gold/10" />

              <div className="relative flex min-h-[340px] flex-col justify-center gap-4 px-8 py-14 md:min-h-[420px] md:px-16 md:py-20 lg:max-w-2xl">
                <span className="eyebrow text-gold">{b.eyebrow}</span>
                <h1 className="font-display text-3xl font-light leading-tight text-white text-balance md:text-5xl">
                  {b.title}
                </h1>
                <p className="max-w-lg text-sm text-white/70 md:text-base">
                  {b.subtitle}
                </p>
                <div>
                  <Link href={b.ctaHref} className="btn-gold mt-2">
                    {b.ctaLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* controles */}
        <button
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-gold hover:text-green-900 md:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Próximo"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-gold hover:text-green-900 md:flex"
        >
          <ChevronRight size={20} />
        </button>

        {/* dots */}
        <div className="absolute bottom-5 left-8 flex gap-2 md:left-16">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
