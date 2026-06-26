import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { adminLogin, validateAdminToken } from "../services/auth/admin";

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    // Se já estiver autenticado, redirecionar para a lista
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token && validateAdminToken(token)) {
        throw redirect({ to: "/lista2026" });
      }
    }
  },
  component: AdminLogin,
});

function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await adminLogin(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        localStorage.setItem("admin_token", result.token);
        // Navegação será tratada pelo beforeLoad na próxima renderização
        window.location.href = "/lista2026";
      } else {
        setError("root", {
          type: "manual",
          message: result.error,
        });
      }
    },
    onError: (error) => {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        background: `linear-gradient(180deg, var(--color-sage) 0%, var(--color-forest) 100%)`,
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-cream/95 backdrop-blur-sm rounded-3xl shadow-lifted p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-forest text-3xl md:text-4xl mb-3 font-medium">
              Acesso Admin
            </h1>
            <p className="text-forest-dark/80 font-body">
              Faça login para acessar a lista de convidados
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <div
                className="bg-terracotta/10 border-2 border-terracotta rounded-xl p-4"
                role="alert"
              >
                <p className="text-terracotta-dark font-body text-sm font-medium">
                  {errors.root.message}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block mb-2 font-body text-forest-dark font-medium">
                Nome de Usuário
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/20 focus:border-forest focus:outline-none font-body text-forest-dark bg-white/50 transition-colors"
                placeholder="Digite seu usuário"
                {...register("username")}
                aria-invalid={errors.username ? "true" : undefined}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <p id="username-error" className="mt-2 text-sm text-terracotta-dark font-body">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-body text-forest-dark font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/20 focus:border-forest focus:outline-none font-body text-forest-dark bg-white/50 transition-colors"
                placeholder="Digite sua senha"
                {...register("password")}
                aria-invalid={errors.password ? "true" : undefined}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-terracotta-dark font-body">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-6 rounded-xl bg-forest text-cream font-body font-medium hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-soft cursor-pointer"
              aria-busy={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest text-cream hover:bg-forest-dark hover:shadow-soft font-body text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar para a home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
