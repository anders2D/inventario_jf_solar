import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://joqvtehquymknvizcblu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcXZ0ZWhxdXlta252aXpjYmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzMyMDksImV4cCI6MjA4NTgwOTIwOX0.TfQNHceAmWs3ztWlGtB8-2ytrmSOyJ2sQ_mKECJtAUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
