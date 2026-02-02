import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/Header";
import CustomToastContainer from "../components/ui/ToastContainer";

export const Route = createFileRoute("/_default")({
  component: () => (
    <>
      <Header />
      <CustomToastContainer />
      <Outlet />
    </>
  ),
});
