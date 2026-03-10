#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const desktop = join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop');
const zipPath = join(desktop, 'jj-barbershop-websupport.zip');

if (!existsSync(dist)) {
  console.error('dist/ missing. Run npm run build first.');
  process.exit(1);
}

const adminHtml = join(dist, 'admin.html');
const adminContent = readFileSync(adminHtml, 'utf8');
for (const dir of ['jj-backstage', 'admin']) {
  const adminDir = join(dist, dir);
  if (!existsSync(adminDir)) mkdirSync(adminDir, { recursive: true });
  const subIndex = adminContent.replace(/href="\.\//g, 'href="../').replace(/src="\.\//g, 'src="../');
  writeFileSync(join(adminDir, 'index.html'), subIndex);
}

try {
  if (existsSync(zipPath)) unlinkSync(zipPath);
  execSync(`cd "${dist}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  const supabase = join(root, 'supabase');
  if (existsSync(join(supabase, 'admin_roles_import.csv'))) {
    copyFileSync(join(supabase, 'admin_roles_import.csv'), join(desktop, 'admin_roles_import.csv'));
  }
  console.log(zipPath);
} catch {
  console.error('zip failed');
  process.exit(1);
}
