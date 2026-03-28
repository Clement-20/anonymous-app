import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// This generates a Ghost ID like "GHOST-729-104"
export const generateGhostId = () => {
  const segment1 = Math.floor(100 + Math.random() * 900); // 3 digits
    const segment2 = Math.floor(100 + Math.random() * 900); // 3 digits
      return `GHOST-${segment1}-${segment2}`;
      };
      