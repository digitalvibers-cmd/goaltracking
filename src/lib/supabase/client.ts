import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // Ovo će baciti grešku samo na klijentu/runtime-u ako fali config,
    // ali omogućava build process bez njih.
    console.warn('Supabase URL or Anon Key is missing!')
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
)
