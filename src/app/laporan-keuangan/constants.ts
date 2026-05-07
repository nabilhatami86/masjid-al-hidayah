export const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
export const MONTHS_FULL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export const PIE_COLORS_KELUAR = ["#ef4444","#f97316","#eab308","#84cc16","#06b6d4","#8b5cf6"];
export const PIE_COLORS_MASUK  = ["#10b981","#3b82f6","#f59e0b","#a855f7","#14b8a6"];

export const KEYFRAMES = `
  @keyframes kSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes kScaleUp {
    from { opacity: 0; transform: scale(0.94) translateY(18px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes kFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes kRowIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes kAccent {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  .an-slide  { animation: kSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .an-scale  { animation: kScaleUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .an-fade   { animation: kFadeIn  0.5s ease-out both; }
  .an-row    { animation: kRowIn   0.22s cubic-bezier(0.22,1,0.36,1) both; }
  .an-accent { animation: kAccent  0.7s cubic-bezier(0.22,1,0.36,1) both; transform-origin: left; }
`;

export const BULAN_LIST = [
  { val: "semua", label: "Semua Bulan" },
  ...["01","02","03","04","05","06","07","08","09","10","11","12"].map((m, i) => ({
    val: m,
    label: MONTHS_FULL[i],
  })),
];

export const PER_PAGE = 10;
