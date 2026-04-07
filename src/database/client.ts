import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 🛡️ Hata tespiti için kontrol
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("KRİTİK: Supabase anahtarları .env.local içinden okunamadı!");
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}