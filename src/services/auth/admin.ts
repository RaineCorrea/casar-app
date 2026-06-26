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

export async function adminLogin(data: LoginInput): Promise<LoginSuccess | LoginError> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    return result as LoginError;
  }

  return result as LoginSuccess;
}

export function validateAdminToken(token: string): boolean {
  try {
    const decodedString = atob(token);
    const decoded: AdminToken = JSON.parse(decodedString);

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
