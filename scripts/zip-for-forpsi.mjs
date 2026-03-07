#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const desktop = join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop');
const zipPath = join(desktop, 'forpsi-deploy.zip');

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
  execSync(`cd "${dist}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  console.log(zipPath);
} catch {
  console.error('zip failed');
  process.exit(1);
}
