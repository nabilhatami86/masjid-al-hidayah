export function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function rupiahShort(n: number) {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)     return `Rp${(n / 1_000).toFixed(0)}rb`;
  return `Rp${n}`;
}

export function rupiahRaw(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}
