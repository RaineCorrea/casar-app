import { StrictMode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./index.css";
import "./schemas/env";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const appRender = () => {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

export default appRender;
