import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lwmyskgamrlbmaheultm.supabase.co";
const supabaseAnonKey = "sb_publishable_bkeFq4tg8DqTpgMmds6OKA_KXniIjyr";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
