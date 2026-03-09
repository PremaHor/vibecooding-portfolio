#!/usr/bin/env node
/**
 * Generates responsive image variants (640w, 960w) for project images.
 * Run: node scripts/generate-responsive-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, '../public/images/projects');
const WIDTHS = [640, 960];

async function generateResponsiveImages() {
  const files = await readdir(PROJECTS_DIR);
  const imageFiles = files.filter(
    (f) => ['.webp', '.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()) && !f.includes('-640') && !f.includes('-960')
  );

  for (const file of imageFiles) {
    const inputPath = join(PROJECTS_DIR, file);
    const statInfo = await stat(inputPath);
    if (!statInfo.isFile()) continue;

    const ext = extname(file);
    const name = basename(file, ext);

    for (const width of WIDTHS) {
      const outputPath = join(PROJECTS_DIR, `${name}-${width}.webp`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);
      console.log(`Generated ${name}-${width}.webp`);
    }
  }
}

generateResponsiveImages().catch(console.error);
