/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.xx';

let supabaseClient: ReturnType<typeof createClient> | any = null;

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.warn("Supabase initialization failed. Check your environment variables.", e);
  // Provide a minimal mock to prevent the app from crashing completely
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ data: null, error: new Error("Supabase non configuré") }),
      signOut: async () => {},
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: async () => ({ error: null }),
      upsert: async () => ({ error: null }),
    })
  };
}

export const supabase = supabaseClient;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  console.error(`Supabase Error (${operationType} on ${path}):`, error);
  throw error;
}
