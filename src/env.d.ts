/// <reference types="vite/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly SUPABASE_SERVICE_ROLE_KEY?: string;
      readonly VITE_SUPABASE_URL?: string;

      readonly ADMIN_USERNAME?: string;
      readonly ADMIN_PASSWORD?: string;

      readonly NODE_ENV?: "development" | "production" | "test";
    }
  }
}

export {};
