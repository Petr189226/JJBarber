#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const desktop = join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop');
const zipPath = join(desktop, 'jj-barbershop-websupport.zip');

if (!existsSync(dist)) {
  console.error('Složka dist/ neexistuje. Spusť nejdřív: npm run build');
  process.exit(1);
}

// Fallback pro /jj-backstage – když .htaccess nefunguje (skrytý soubor ve FileZilla)
const adminDir = join(dist, 'jj-backstage');
const indexHtml = join(dist, 'index.html');
if (!existsSync(adminDir)) mkdirSync(adminDir, { recursive: true });
copyFileSync(indexHtml, join(adminDir, 'index.html'));

try {
  execSync(`cd "${dist}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  console.log('\n✓ Vytvořeno na ploše:', zipPath);
  console.log('  Postup nahrání viz WEBSUPPORT.md');
} catch (e) {
  console.error('Příkaz zip selhal (na Windows může chybět).');
  console.error('Složku dist/ zabal ručně do ZIP a nahraj do public_html.');
  process.exit(1);
}
