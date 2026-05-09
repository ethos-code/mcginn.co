import type { MetadataRoute } from 'next';
import { loadLogEntries, loadWorkEntries } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mcginn.co';
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${base}/logbook`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/resume`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const work = loadWorkEntries()
    .filter(
      (e) => e.status === 'open' && (e.body?.trim().length ?? 0) > 0 && !e.external
    )
    .map((e) => ({
      url: `${base}/work/${e.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const log = loadLogEntries()
    .filter((e) => !e.locked)
    .map((e) => ({
      url: `${base}/logbook/${e.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }));

  return [...staticEntries, ...work, ...log];
}
