export default function Loader({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" id="loader">
      <div
        className={`${sizes[size]} border-dark-600 border-t-neon-purple rounded-full animate-spin`}
        style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.5))' }}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 border-2 border-dark-600 border-t-neon-purple rounded-full animate-spin"
          style={{ filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.5))' }}
        />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-dark-800/40 overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-3 w-full skeleton rounded-lg" />
        <div className="h-3 w-2/3 skeleton rounded-lg" />
        <div className="flex items-center justify-between mt-4 pt-4">
          <div className="h-6 w-24 skeleton rounded-lg" />
          <div className="h-9 w-24 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
