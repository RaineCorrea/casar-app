import Countdown from "../ui/Countdown";
import InputForm from "../ui/inputForm";
import Location from "../ui/Location";

export function Main() {
  const countDownDate = new Date("2026-11-18T00:00:00");

  return (
    <>
      <Countdown
        title="🎊 Contagem para o Casamento 🎊"
        targetDate={countDownDate}
      />
      <Location />
      <InputForm />
    </>
  );
}
