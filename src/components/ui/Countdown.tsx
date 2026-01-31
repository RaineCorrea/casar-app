import { useState, useEffect, startTransition } from "react";
import TimeUnit from "./TimeUnit";
import { Element } from "react-scroll";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
  title?: string;
}

export default function Countdown({ targetDate, title }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft((prev) =>
          prev.days === 0 &&
          prev.hours === 0 &&
          prev.minutes === 0 &&
          prev.seconds === 0
            ? prev
            : { days: 0, hours: 0, minutes: 0, seconds: 0 },
        );
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      startTransition(() => {
        setTimeLeft({ days, hours, minutes, seconds });
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Element
      name="countdown"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--color-wheat) 0%, var(--color-linen) 50%, var(--color-cream) 100%)`,
      }}
    >
      <div className="absolute top-0 left-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-forest">
          <path d="M0 100 Q30 70 50 80 Q70 90 100 60 L100 100 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-sage">
          <path d="M100 0 Q70 30 80 50 Q90 70 60 100 L100 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-1/4 right-1/4 w-8 h-8 opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 32 32" className="text-forest">
          <path d="M16 2 Q24 12 16 22 Q8 12 16 2" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 left-1/5 w-6 h-6 opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 32 32" className="text-forest-light">
          <path d="M16 2 Q24 12 16 22 Q8 12 16 2" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="w-20 h-px bg-gradient-to-r from-transparent to-forest/40" />
          <svg className="w-8 h-8 text-terracotta" viewBox="0 0 32 32">
            <path d="M16 4 Q22 10 16 16 Q10 10 16 4" fill="currentColor" opacity="0.9" />
            <path d="M16 16 Q22 22 16 28 Q10 22 16 16" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="w-20 h-px bg-gradient-to-l from-transparent to-forest/40" />
        </div>

        {title && (
          <h2 className="font-display text-forest text-3xl md:text-4xl mb-4 font-medium">
            Contagem Regressiva
          </h2>
        )}

        <p className="font-body text-forest-dark text-lg mb-12 italic">
          Para o dia mais especial das nossas vidas
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <TimeUnit value={timeLeft.days} label="Dias" />
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>

        <div className="mt-12 pt-8 border-t border-forest/20">
          <p className="font-display text-forest-dark text-xl font-medium">
            18 de Novembro de 2026
          </p>
          <p className="text-forest/80 text-sm mt-2 tracking-wider uppercase font-semibold">
            Sábado, às 16h
          </p>
        </div>
      </div>
    </Element>
  );
}
