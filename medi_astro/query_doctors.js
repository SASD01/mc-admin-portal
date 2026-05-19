import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('doctors').select('*').limit(1);
  console.log(data);
}
run();
