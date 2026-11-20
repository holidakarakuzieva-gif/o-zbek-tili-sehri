export function GirihPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.045] dark:opacity-[0.055]"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="girih-tile" width="96" height="96" patternUnits="userSpaceOnUse">
            <path
              d="M48 4 L60 36 L92 48 L60 60 L48 92 L36 60 L4 48 L36 36 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <polygon
              points="48,18 68,28 78,48 68,68 48,78 28,68 18,48 28,28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle cx="48" cy="48" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-tile)" className="text-[var(--primary)]" />
      </svg>
    </div>
  );
}
