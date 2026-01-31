import Countdown from "../ui/Countdown";
import InputForm from "../ui/inputForm";
import Location from "../ui/Location";
import Welcome from "../ui/welcome";

export function Main() {
  const countDownDate = new Date("2026-11-18T00:00:00");

  return (
    <>
      <Welcome />
      <Countdown targetDate={countDownDate} />
      <Location />
      <InputForm />
    </>
  );
}
