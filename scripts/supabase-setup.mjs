#!/usr/bin/env node
/**
 * Spustí Supabase migraci – zkopíruje SQL do schránky a otevře SQL Editor.
 * Před prvním odesláním voucheru MUSÍŠ spustit migraci v Supabase.
 *
 * Použití: npm run supabase:setup
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '001_voucher_orders.sql');
const sql = readFileSync(sqlPath, 'utf8');
const projectId = 'jdtijmhosifoccwsgdgx';
const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;

console.log('\n📋 Supabase migrace – voucher_orders\n');
console.log('1. SQL je zkopírováno do schránky.');
console.log('2. Otevírám Supabase SQL Editor v prohlížeči...\n');
console.log('3. V SQL Editoru: Ctrl+V (vlož), pak klikni RUN (nebo Cmd+Enter).\n');

try {
  if (process.platform === 'darwin') {
    execSync('pbcopy', { input: sql });
  } else if (process.platform === 'win32') {
    execSync('clip', { input: sql });
  } else {
    throw new Error('no clipboard');
  }
} catch {
  console.log('SQL (zkopíruj ručně):\n');
  console.log('─'.repeat(50));
  console.log(sql);
  console.log('─'.repeat(50));
  console.log('\n');
}

try {
  execSync(`open "${sqlEditorUrl}"`, { stdio: 'inherit' });
} catch {
  console.log('Otevři v prohlížeči:', sqlEditorUrl);
}
