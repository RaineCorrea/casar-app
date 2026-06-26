import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  guestsQueryOptions,
  useGuestsWithRealtime,
} from "../services/supabase/guests";
import { validateAdminToken } from "../services/auth/admin";
import { IconeEmail, IconeTelefone } from "../components/icons";

export const Route = createFileRoute("/lista2026")({
  beforeLoad: () => {
    // Verificar autenticação antes de carregar a rota
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token || !validateAdminToken(token)) {
        throw redirect({ to: "/login" });
      }
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(guestsQueryOptions);
  },
  component: Lista2026,
});

function Lista2026() {
  const { data: guests, isLoading, error } = useGuestsWithRealtime();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  // Mostrar loading apenas se não houver dados e estiver carregando
  const showLoading = isLoading && !guests;

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(180deg, var(--color-sage) 0%, var(--color-forest) 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-cream/95 backdrop-blur-sm rounded-3xl shadow-lifted p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="font-display text-forest text-4xl md:text-5xl mb-3 font-medium">
                Lista de Convidados
              </h1>
              <p className="text-forest-dark/80 max-w-md leading-relaxed">
                Confira abaixo a lista de convidados confirmados
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-terracotta/20 text-terracotta-dark font-body font-medium hover:bg-terracotta/30 transition-colors cursor-pointer"
              aria-label="Sair do acesso admin"
            >
              Sair
            </button>
          </div>

          {showLoading && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div
                className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-sage-light border-t-forest"
                aria-hidden="true"
              ></div>
              <p className="mt-6 text-forest-dark font-body">
                Carregando lista de convidados...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-terracotta/10 border-2 border-terracotta rounded-xl p-6 text-center">
              <p className="text-terracotta-dark font-body font-medium">
                {error.message}
              </p>
            </div>
          )}

          {!showLoading && !error && (guests?.length ?? 0) === 0 && (
            <div className="text-center py-12 bg-wheat/50 rounded-2xl">
              <p className="text-forest-dark font-body text-lg">
                Nenhum convidado confirmado ainda.
              </p>
            </div>
          )}

          {!showLoading && !error && guests && guests.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-forest/20">
                <span className="font-body text-base font-semibold text-forest-dark">
                  Total de convidados: {guests.length}
                </span>
              </div>

              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-6 bg-wheat/50 rounded-2xl border border-sage-light/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-display text-forest-dark text-xl mb-3 font-medium">
                        {guest.name}
                      </h3>

                      {(guest.email || guest.telefone) && (
                        <div className="space-y-2 font-body text-sm text-forest-dark/80">
                          {guest.email && (
                            <div className="flex items-center gap-2">
                              <IconeEmail />
                              <span className="sr-only">E-mail:</span>
                              <span>{guest.email}</span>
                            </div>
                          )}
                          {guest.telefone && (
                            <div className="flex items-center gap-2">
                              <IconeTelefone />
                              <span className="sr-only">Telefone:</span>
                              <span>{guest.telefone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
  );
}
