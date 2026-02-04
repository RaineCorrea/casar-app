import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../components/layout/Main'
import { productsQueryOptions } from '../../services/supabase/products'

export const Route = createFileRoute('/_default/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQueryOptions)
  },
  component: Main,
})
