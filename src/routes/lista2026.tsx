import { createFileRoute } from '@tanstack/react-router'
import supabase from '../services/supabase/client'
import { useEffect, useState } from 'react'

interface Guest {
  id: string
  name: string
  email?: string
  telefone?: string
  created_at: string
}

export const Route = createFileRoute('/lista2026')({
  component: Lista2026,
})

function Lista2026() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGuests()

    const channel = supabase
      .channel('guestlist-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'GuestList',
        },
        (payload) => {
          setGuests((prev) => [...prev, payload.new as Guest])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchGuests() {
    try {
      const { data, error } = await supabase.from("GuestList").select("*")
      if (error) throw error
      setGuests(data || [])
    } catch {
      setError("Erro ao carregar lista de convidados")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(180deg, var(--color-sage) 0%, var(--color-forest) 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-cream/95 backdrop-blur-sm rounded-3xl shadow-lifted p-8">
          <h1 className="font-display text-forest text-4xl md:text-5xl mb-3 text-center font-medium">
            Lista de Convidados
          </h1>
          <p className="text-forest-dark/80 text-center mb-8 max-w-md mx-auto leading-relaxed">
            Confira abaixo a lista de convidados confirmados
          </p>

          {loading && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-sage-light border-t-forest" aria-hidden="true"></div>
              <p className="mt-6 text-forest-dark font-body">Carregando lista de convidados...</p>
            </div>
          )}

          {error && (
            <div className="bg-terracotta/10 border-2 border-terracotta rounded-xl p-6 text-center">
              <p className="text-terracotta-dark font-body font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && guests.length === 0 && (
            <div className="text-center py-12 bg-wheat/50 rounded-2xl">
              <p className="text-forest-dark font-body text-lg">Nenhum convidado confirmado ainda.</p>
            </div>
          )}

          {!loading && !error && guests.length > 0 && (
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
                              <span className="text-lg" aria-hidden="true">✉</span>
                              <span className="sr-only">E-mail:</span>
                              <span>{guest.email}</span>
                            </div>
                          )}
                          {guest.telefone && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg" aria-hidden="true">📱</span>
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
      </div>
    </div>
  )
}
