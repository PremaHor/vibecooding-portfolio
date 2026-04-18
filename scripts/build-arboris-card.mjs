#!/usr/bin/env node
/**
 * Výřez horní části (hero) z public/images/projects/arboris.webp → arboris-card.webp.
 * Po výměně full-page screenshotu spusť: node scripts/build-arboris-card.mjs && node scripts/generate-responsive-images.mjs
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '../public/images/projects');
const src = join(dir, 'arboris.webp');
const out = join(dir, 'arboris-card.webp');
const meta = await sharp(src).metadata();
const heroRatio = 0.4;
const h = Math.max(1, Math.round(meta.height * heroRatio));
await sharp(src)
  .extract({ left: 0, top: 0, width: meta.width, height: h })
  .webp({ quality: 88 })
  .toFile(out);
console.log(`arboris-card: ${meta.width}×${h} → ${out}`);
