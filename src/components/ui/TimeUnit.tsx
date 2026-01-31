import { memo } from "react";
import { FolhaCanto } from "../icons";

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = memo(function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="group relative">
      <div
        className="relative bg-cream rounded-2xl p-6 md:p-8 min-w-[100px] md:min-w-[130px] shadow-soft transition-all duration-300 hover:shadow-lifted hover:-translate-y-1"
        style={{
          background: 'linear-gradient(145deg, var(--color-cream) 0%, var(--color-wheat) 100%)',
        }}
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
          <FolhaCanto />
        </div>

        <span
          className="block font-display text-5xl md:text-6xl font-bold text-forest tabular-nums transition-colors duration-300 group-hover:text-terracotta"
          style={{
            textShadow: '1px 2px 4px rgba(45, 74, 62, 0.1)',
          }}
        >
          {String(value).padStart(2, "0")}
        </span>

        <p className="mt-2 text-forest/70 text-sm uppercase tracking-widest font-body font-semibold">
          {label}
        </p>

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-terracotta), transparent)',
          }}
        />
      </div>
    </div>
  );
});

export default TimeUnit;
