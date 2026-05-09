interface Props {
  label: string;
  title: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, center = false }: Props) {
  return (
    <div className={center ? "text-center mb-10" : "mb-10"}>
      <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
        {label}
      </p>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <div className={`w-12 h-1 bg-amber-400 rounded-full mt-3 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
