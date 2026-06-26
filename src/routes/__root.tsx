import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouteContext,
} from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { CartProvider } from '../components/contexts/CartContext'
import { SkipLink } from '../components/ui/SkipLink'
import { StructuredData } from '../components/SEO/StructuredData'
import '../index.css'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // SEO - Meta tags
      {
        name: 'description',
        content: 'Confirme sua presença e escolha presentes para o casamento de Matheus & Nicolly - 18 de Novembro de 2026',
      },
      {
        name: 'keywords',
        content: 'casamento, lista de presentes, RSVP, Matheus, Nicolly, confirmação de presença',
      },
      {
        name: 'author',
        content: 'Matheus & Nicolly',
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'Matheus & Nicolly - Nosso Casamento',
      },
      {
        property: 'og:description',
        content: 'Confirme sua presença e escolha presentes para o nosso casamento - 18 de Novembro de 2026',
      },
      {
        property: 'og:image',
        content: '/og-image.jpg',
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Matheus & Nicolly - Nosso Casamento',
      },
      {
        name: 'twitter:description',
        content: 'Confirme sua presença e escolha presentes para o nosso casamento',
      },
    ],
    title: 'Matheus & Nicolly - Nosso Casamento',
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Tangerine:wght@400;700&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const { queryClient } = useRouteContext({ strict: false })
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient!}>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <HeadContent />
      <StructuredData />
      <SkipLink />
      {children}
      <Scripts />
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wheat/30 px-6" role="main" aria-labelledby="notfound-title">
      <div className="text-center">
        <h1 id="notfound-title" className="font-display text-forest text-6xl md:text-8xl mb-6 font-medium">
          404
        </h1>
        <p className="font-body text-forest-dark/80 text-xl md:text-2xl mb-8 max-w-md mx-auto">
          Página não encontrada
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-forest text-cream font-body text-lg rounded-xl hover:bg-forest-dark transition-colors duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  )
}
