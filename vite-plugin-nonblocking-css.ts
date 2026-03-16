import type { Plugin } from 'vite';

/**
 * Změní hlavní CSS link (vlastní /assets/) na neblokující - zkracuje kritický řetězec.
 * Kritické styly jsou inline v index.html.
 * crossorigin atribut na preload eliminuje credentials-mode mismatch warning v Chrome/Safari.
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
          return `<link rel="preload" href="${href}" as="style" crossorigin><link rel="stylesheet" ${attrs}><noscript><link rel="stylesheet" href="${href}"></noscript>`;
        }
      );
    },
  };
}
