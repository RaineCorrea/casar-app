import { useState, useEffect } from "react";

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<CountdownProps>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "32px", fontWeight: "bold" }}>
          {timeLeft.days}
        </span>
        <p style={{ margin: 0, fontSize: "14px" }}>Dias</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "32px", fontWeight: "bold" }}>
          {timeLeft.hours}
        </span>
        <p style={{ margin: 0, fontSize: "14px" }}>Horas</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "32px", fontWeight: "bold" }}>
          {timeLeft.minutes}
        </span>
        <p style={{ margin: 0, fontSize: "14px" }}>Minutos</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "32px", fontWeight: "bold" }}>
          {timeLeft.seconds}
        </span>
        <p style={{ margin: 0, fontSize: "14px" }}>Segundos</p>
      </div>
    </div>
  );
}
