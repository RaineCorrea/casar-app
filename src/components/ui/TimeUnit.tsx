import { memo } from "react";

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = memo(function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <p className="m-0 text-sm">{label}</p>
    </div>
  );
});

export default TimeUnit;
