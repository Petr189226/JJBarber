#!/usr/bin/env node
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '001_voucher_orders.sql');
const sql = readFileSync(sqlPath, 'utf8');
const projectId = 'jdtijmhosifoccwsgdgx';
const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;

console.log('SQL copied to clipboard. Opening Supabase SQL Editor...');

try {
  if (process.platform === 'darwin') {
    execSync('pbcopy', { input: sql });
  } else if (process.platform === 'win32') {
    execSync('clip', { input: sql });
  } else {
    throw new Error('no clipboard');
  }
} catch {
  console.log(sql);
}

try {
  execSync(`open "${sqlEditorUrl}"`, { stdio: 'inherit' });
} catch {
  console.log(sqlEditorUrl);
}
