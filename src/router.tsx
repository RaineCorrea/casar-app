import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // 10 minutos em vez de 5
        gcTime: 1000 * 60 * 30, // 30 minutos antes de limpar cache
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  })

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      queryClient,
    },
  })
  return router
}
