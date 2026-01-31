export function LeafDecoration() {
  return (
    <svg viewBox="0 0 100 100" className="text-cream">
      <path d="M50 5 Q75 35 50 65 Q25 35 50 5" fill="currentColor" />
      <path
        d="M30 40 Q50 55 70 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M50 65 L50 95" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
