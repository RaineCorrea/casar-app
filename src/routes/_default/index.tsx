import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../components/layout/Main'

export const Route = createFileRoute('/_default/')({
  component: Main,
})
