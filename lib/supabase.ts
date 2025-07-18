import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos
export interface User {
  id: number
  name: string
  last_name: string
  email: string
  dni: string
  phone?: string
  created_at: string
}

export interface RaffleNumber {
  id: number
  number: number
  user_id?: number
  price: number
  status: "available" | "reserved" | "sold"
  purchased_at?: string
  created_at: string
}

export interface Transaction {
  id: number
  user_id: number
  amount: number
  payment_id?: string
  status: "pending" | "completed" | "failed"
  numbers: number[]
  created_at: string
}

export interface Raffle {
  id: number
  name: string
  description?: string
  total_numbers: number
  price_per_number: number
  status: "active" | "completed" | "cancelled"
  draw_date?: string
  created_at: string
}
