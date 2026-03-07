#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const desktop = join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop');
const zipPath = join(desktop, 'forpsi-deploy.zip');

if (!existsSync(dist)) {
  console.error('Složka dist/ neexistuje. Spusť nejdřív: npm run build');
  process.exit(1);
}

try {
  execSync(`cd "${dist}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  console.log('\n✓ Vytvořeno na ploše:', zipPath);
  console.log('  Nahraj tento soubor do kořene webu na Forpsi (např. public_html) a rozbal.');
} catch (e) {
  console.error('Příkaz zip selhal (na Windows může chybět).');
  console.error('Složku dist/ zabal ručně do ZIP a nahraj na Forpsi.');
  process.exit(1);
}
