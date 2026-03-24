import type { Plugin } from 'vite';

/**
 * Vite injects <link rel="modulepreload"> after the entry <script type="module">.
 * Moving them before the entry script lets the browser start fetching vendor chunks
 * in parallel with parsing / downloading the entry (shorter critical path for Lighthouse).
 */
export function earlyModulePreload(): Plugin {
  return {
    name: 'early-module-preload',
    enforce: 'post',
    transformIndexHtml(html) {
      const re = /<link rel="modulepreload"[^>]*>/g;
      const seen = new Set<string>();
      const links: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(html)) !== null) {
        const tag = m[0].trim();
        if (!seen.has(tag)) {
          seen.add(tag);
          links.push(tag);
        }
      }
      if (links.length === 0) return html;

      const stripped = html.replace(/\s*<link rel="modulepreload"[^>]*>\s*/g, '');
      const marker = '<script type="module"';
      const i = stripped.indexOf(marker);
      if (i === -1) return html;

      const block = `\n    ${links.join('\n    ')}\n    `;
      return stripped.slice(0, i) + block + stripped.slice(i);
    },
  };
}
