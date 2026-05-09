interface Props {
  className?: string;
}

export default function SkeletonBox({ className }: Props) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className ?? ""}`} />
  );
}
