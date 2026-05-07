function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className ?? ""}`} />;
}

export default function SkeletonLoading() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-gray-200">
            <Bone className="h-3 w-24 mb-3" />
            <Bone className="h-7 w-36 mb-2" />
            <Bone className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Bone className="h-4 w-48 mb-4" />
        <Bone className="h-64 w-full" />
      </div>
    </>
  );
}
