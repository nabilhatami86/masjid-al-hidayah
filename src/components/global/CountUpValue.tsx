"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/lib/format";

interface Props {
  target: number;
  start: boolean;
  formatter?: (n: number) => string;
}

export default function CountUpValue({ target, start, formatter = rupiah }: Props) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1400;
    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);

  return <>{formatter(val)}</>;
}
