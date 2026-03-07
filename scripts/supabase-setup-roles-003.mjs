#!/usr/bin/env node
/**
 * Migrace 003 – jen Majitel může přidávat správce (odstranění "první uživatel si nastaví majitel").
 * Spusť až po 002_admin_roles.sql.
 *
 * Použití: npm run supabase:setup-roles-003
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '003_majitel_only_insert.sql');
const sql = readFileSync(sqlPath, 'utf8');
const projectId = 'jdtijmhosifoccwsgdgx';
const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;

console.log('\n📋 Supabase migrace 003 – Majitel-only insert\n');
console.log('1. SQL je zkopírováno do schránky.');
console.log('2. Otevírám Supabase SQL Editor...\n');
console.log('3. V SQL Editoru: Ctrl+V (vlož), pak klikni RUN.\n');

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
