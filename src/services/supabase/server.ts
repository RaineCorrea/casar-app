import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(url, key)
}

export interface Product {
  id: string
  image: string
  descricao?: string
  preco: number
  created_at: string
  link?: string
}

export interface Guest {
  id: string
  name: string
  email?: string
  telefone?: string
  created_at: string
}

export const fetchProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getServerSupabase()
    const { data, error } = await supabase.from('Products').select('*')

    if (error) {
      throw new Error(error.message)
    }

    return data as Product[]
  }
)

export const fetchGuests = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getServerSupabase()
    const { data, error } = await supabase.from('GuestList').select('*')

    if (error) {
      throw new Error(error.message)
    }

    return data as Guest[]
  }
)

type NewGuest = { name: string; email?: string; telefone?: string }

export const addGuest = createServerFn({ method: 'POST' })
  .inputValidator((data: NewGuest) => data)
  .handler(async ({ data }) => {
    const supabase = getServerSupabase()
    const { data: result, error } = await supabase
      .from('GuestList')
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return result as Guest
  })
