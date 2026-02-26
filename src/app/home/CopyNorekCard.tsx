"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyNorekCardProps {
  bank: string;
  norek: string;
  atas: string;
}

export default function CopyNorekCard({
  bank,
  norek,
  atas,
}: CopyNorekCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(norek.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full rounded-xl bg-white/15 px-4 py-3 text-left transition-colors hover:bg-white/20"
      aria-label={`Salin nomor rekening ${bank}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {bank}
        </p>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
          {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.2} />}
        </span>
      </div>
      <p className="mt-0.5 font-bold tracking-wider text-white">{norek}</p>
      <p className="text-[12px] text-white/80">a.n. {atas}</p>
    </button>
  );
}
