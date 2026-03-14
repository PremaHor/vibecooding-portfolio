#!/usr/bin/env node
/**
 * Generuje PNG favicon z SVG pro lepší kompatibilitu prohlížečů.
 */
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'favicon.svg');

async function generate() {
  const svg = await readFile(svgPath);
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon-32.png'));
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'favicon-180.png'));
  console.log('Generated favicon-32.png, favicon-180.png');
}

generate().catch(console.error);
