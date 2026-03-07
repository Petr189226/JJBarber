#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  console.warn('\n⚠️  Soubor .env neexistuje – voucher formulář a admin nebudou fungovat.');
  console.warn('   Zkopíruj .env.example na .env a doplň Supabase URL + anon key.\n');
  process.exit(1);
}

const env = readFileSync(envPath, 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const url = (urlMatch?.[1] || '').trim();
const key = (keyMatch?.[1] || '').trim();
const hasUrl = url && url.includes('supabase.co') && !url.includes('xxx');
const hasKey = key && key.startsWith('eyJ') && key.length > 50;

if (!hasUrl || !hasKey) {
  console.warn('\n⚠️  .env nemá platné VITE_SUPABASE_URL nebo VITE_SUPABASE_ANON_KEY.');
  console.warn('   Zkopíruj .env.example na .env a doplň hodnoty z Supabase Dashboard → Settings → API.');
  console.warn('   Voucher formulář a admin nebudou fungovat na ostré verzi.\n');
  process.exit(1);
}
