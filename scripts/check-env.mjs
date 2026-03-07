#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  console.error('.env missing. Copy .env.example and add Supabase credentials.');
  process.exit(1);
}

const env = readFileSync(envPath, 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const url = (urlMatch?.[1] || '').trim();
const key = (keyMatch?.[1] || '').trim();
const hasUrl = url && url.includes('supabase.co') && !url.includes('xxx');
const hasKey = key && (key.startsWith('eyJ') || key.startsWith('sb_publishable_')) && key.length > 30;

if (!hasUrl || !hasKey) {
  console.error('.env: invalid VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}
