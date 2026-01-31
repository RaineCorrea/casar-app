export function CircleDecoration() {
  return (
    <svg viewBox="0 0 100 100" className="text-sage-light">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
