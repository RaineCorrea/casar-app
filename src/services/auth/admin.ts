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

interface AdminToken {
  admin: boolean;
  timestamp: number;
  expiresAt: number;
}

// Rate limiting em memória para login
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutos

function checkRateLimit(identifier: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true };
  }

  // Verificar se ainda está no período de bloqueio
  if (now < record.resetTime) {
    const remainingMinutes = Math.ceil((record.resetTime - now) / 60000);
    return {
      allowed: false,
      error: `Muitas tentativas. Tente novamente em ${remainingMinutes} minutos.`,
    };
  }

  // Resetar se o período de bloqueio passou
  loginAttempts.delete(identifier);
  return { allowed: true };
}

function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + ATTEMPT_WINDOW });
    return;
  }

  // Se ainda está dentro da janela de tentativas
  if (now < record.resetTime) {
    const newCount = record.count + 1;
    if (newCount >= MAX_ATTEMPTS) {
      // Bloquear por LOCKOUT_DURATION
      loginAttempts.set(identifier, {
        count: newCount,
        resetTime: now + LOCKOUT_DURATION,
      });
    } else {
      loginAttempts.set(identifier, {
        count: newCount,
        resetTime: record.resetTime,
      });
    }
  } else {
    // Nova janela de tentativas
    loginAttempts.set(identifier, { count: 1, resetTime: now + ATTEMPT_WINDOW });
  }
}

function resetAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: LoginInput) => input)
  .handler(async ({ data }) => {
    const { username, password } = data;

    // Identificador para rate limiting (baseado em IP e username)
    const identifier = `${username}`;

    // Verificar rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: rateLimitCheck.error || "Muitas tentativas. Tente novamente mais tarde.",
      } as LoginError;
    }

    const adminUsername = import.meta.env.ADMIN_USERNAME;
    const adminPassword = import.meta.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Credenciais admin não configuradas");
      return {
        success: false,
        error: "Credenciais admin não configuradas no servidor",
      } as LoginError;
    }

    if (username === adminUsername && password === adminPassword) {
      // Resetar tentativas após login bem-sucedido
      resetAttempts(identifier);

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

    // Registrar tentativa falha
    recordFailedAttempt(identifier);

    return {
      success: false,
      error: "Credenciais inválidas",
    } as LoginError;
  });

export function validateAdminToken(token: string): boolean {
  try {
    let decoded: AdminToken;

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
