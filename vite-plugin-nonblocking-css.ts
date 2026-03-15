import type { Plugin } from 'vite';

/**
 * Změní hlavní CSS link (vlastní /assets/) na neblokující - zkracuje kritický řetězec.
 * Kritické styly jsou inline v index.html.
 */
export function nonblockingCss(): Plugin {
  return {
    name: 'vite-plugin-nonblocking-css',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*?)>/g,
        (_m, before, href, after) => {
          const attrs = `${before}href="${href}"${after}`.trim();
          return `<link rel="preload" href="${href}" as="style"><link rel="stylesheet" ${attrs} media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
        }
      );
    },
  };
}
