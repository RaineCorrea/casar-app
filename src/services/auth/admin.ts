import { createServerFn } from "@tanstack/react-start";

interface LoginInput {
  username: string;
  password: string;
}

interface LoginSuccess {
  success: true;
  token: string;
}

interface LoginError {
  success: false;
  error: string;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: LoginInput) => input)
  .handler(async ({ data }) => {
    const { username, password } = data;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Credenciais admin não configuradas");
      return {
        success: false,
        error: "Credenciais admin não configuradas no servidor",
      } as LoginError;
    }

    if (username === adminUsername && password === adminPassword) {
      const token = Buffer.from(
        JSON.stringify({
          admin: true,
          timestamp: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        }),
      ).toString("base64");

      return {
        success: true,
        token,
      } as LoginSuccess;
    }

    return {
      success: false,
      error: "Credenciais inválidas",
    } as LoginError;
  });

export function validateAdminToken(token: string): boolean {
  try {
    let decoded: any;

    if (typeof window !== "undefined") {
      const decodedString = atob(token);
      decoded = JSON.parse(decodedString);
    } else {
      decoded = JSON.parse(Buffer.from(token, "base64").toString());
    }

    if (!decoded.admin || !decoded.timestamp || !decoded.expiresAt) {
      return false;
    }

    if (Date.now() > decoded.expiresAt) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
}
