import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/Header";
import { Toaster } from "../components/ui/sonner";

export const Route = createFileRoute("/_default")({
  component: () => (
    <>
      <Header />
      <Toaster />
      <Outlet />
    </>
  ),
});
