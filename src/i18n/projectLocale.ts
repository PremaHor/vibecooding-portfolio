import type { Project } from '../shared/data';

/** Optional `title` / `client` / `role` on `translations.en.projects[slug]` override Czech defaults from `PROJECTS`. */
export function projectLocaleField(
  lang: 'cs' | 'en',
  tr: unknown,
  field: 'title' | 'client' | 'role',
  project: Project,
): string {
  const fallback =
    field === 'title' ? project.title : field === 'client' ? project.client : project.role;
  if (lang !== 'en' || tr === null || tr === undefined || typeof tr !== 'object') {
    return fallback;
  }
  const v = (tr as Record<string, unknown>)[field];
  return typeof v === 'string' && v.trim() !== '' ? v : fallback;
}
