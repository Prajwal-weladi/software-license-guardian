
import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Initialize the Supabase client with fallback to empty client
let supabase;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    // Create a mock Supabase client for development
    console.warn('Using mock Supabase client. Email notifications will not work.');
    supabase = {
      from: () => ({
        insert: async () => ({ error: null }),
        select: async () => ({ data: [], error: null }),
      }),
      auth: {
        signIn: async () => ({ user: null, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: null, error: null }),
      },
    };
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Provide fallback mock implementation
  supabase = {
    from: () => ({
      insert: async () => ({ error: null }),
      select: async () => ({ data: [], error: null }),
    }),
    auth: {
      signIn: async () => ({ user: null, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: null, error: null }),
    },
  };
}

export { supabase };
