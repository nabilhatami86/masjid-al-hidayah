interface Props {
  label: string;
  title: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, center = false }: Props) {
  return (
    <div className={center ? "text-center mb-10" : "mb-10"}>
      <p className="text-stone-400 font-medium text-[11px] uppercase tracking-[0.22em] mb-2">
        {label}
      </p>
      <h2 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">{title}</h2>
    </div>
  );
}
