import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public/fonts');

const files = [
  ['node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2', 'montserrat-latin.woff2'],
  ['node_modules/@fontsource-variable/montserrat/files/montserrat-latin-ext-wght-normal.woff2', 'montserrat-latin-ext.woff2'],
  ['node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin.woff2'],
  ['node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2', 'inter-latin-ext.woff2'],
  ['node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'jetbrains-mono-latin.woff2'],
  ['node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-ext-wght-normal.woff2', 'jetbrains-mono-latin-ext.woff2'],
];

fs.mkdirSync(outDir, { recursive: true });
for (const [rel, dest] of files) {
  const from = path.join(root, rel);
  if (!fs.existsSync(from)) {
    console.error('Missing font file:', from);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(outDir, dest));
}
console.log('Fonts copied to public/fonts/');
