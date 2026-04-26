import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly point to the .env file in the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail-fast: Log the issue clearly before the Supabase SDK throws the error
if (!supabaseUrl || !supabaseUrl.startsWith('https')) {
  console.error("❌ ERROR: SUPABASE_URL is missing or invalid in .env");
  console.error("Current value:", supabaseUrl);
  process.exit(1); 
}

export const supabase = createClient(supabaseUrl, supabaseKey);