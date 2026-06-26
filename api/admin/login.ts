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

export default async function handler(req: Request) {
  // Adicionar headers CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { username, password }: LoginInput = await req.json();

    // Identificador para rate limiting (baseado em IP e username)
    const identifier = `${username}`;

    // Verificar rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: rateLimitCheck.error || "Muitas tentativas. Tente novamente mais tarde.",
        } as LoginError),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Credenciais admin não configuradas");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Credenciais admin não configuradas no servidor",
        } as LoginError),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (username === adminUsername && password === adminPassword) {
      // Resetar tentativas após login bem-sucedido
      resetAttempts(identifier);

      const tokenData: AdminToken = {
        admin: true,
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      const token = Buffer.from(JSON.stringify(tokenData)).toString("base64");

      return new Response(
        JSON.stringify({
          success: true,
          token,
        } as LoginSuccess),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Registrar tentativa falha
    recordFailedAttempt(identifier);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Credenciais inválidas",
      } as LoginError),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno do servidor",
      } as LoginError),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
