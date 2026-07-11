"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    // termina no fim do dia atual
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tick = () => setRemaining(Math.max(0, end.getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const total = remaining ?? 0;
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor((total % 3_600_000) / 60_000);
  const s = Math.floor((total % 60_000) / 1000);

  const box = (v: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-900 font-display text-lg text-gold tabular-nums">
        {pad(v)}
      </span>
      <span className="mt-1 text-[0.6rem] uppercase tracking-wider text-ink/50">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {box(h, "horas")}
      <span className="pb-4 font-display text-lg text-green-900">:</span>
      {box(m, "min")}
      <span className="pb-4 font-display text-lg text-green-900">:</span>
      {box(s, "seg")}
    </div>
  );
}
