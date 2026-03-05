// lib/supabaseAdmin.js — cliente admin (SOLO para Server Actions o API Routes)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ⚠️ Sin NEXT_PUBLIC_
)