import Countdown from "../ui/Countdown";
import InputForm from "../ui/inputForm";
import Location from "../ui/Location";
import Products from "../ui/Products";
import Welcome from "../ui/welcome";
import { CartDrawer } from "../ui/CartDrawer";

export function Main() {
  const countDownDate = new Date("2026-11-18T00:00:00");

  return (
    <>
      <Welcome />
      <Countdown targetDate={countDownDate} />
      <Location />
      <Products/>
      <InputForm />
      <CartDrawer />
    </>
  );
}
