import Countdown from "../ui/Countdown";
import InputForm from "../ui/inputForm";

export function Main() {
  const countDownDate = new Date("2026-11-18T00:00:00");

  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>🎊 Contagem para o Casamento 🎊</h1>
        <Countdown targetDate={countDownDate} />
      </div>
      <InputForm />
    </>
  );
}
