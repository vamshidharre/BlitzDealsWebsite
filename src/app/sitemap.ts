import { MetadataRoute } from 'next';
import { getAllDeals } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzdeals.de';
  const deals = getAllDeals();

  const dealEntries: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${baseUrl}/deal/${deal.slug}`,
    lastModified: new Date(deal.updatedAt || deal.createdAt),
    changeFrequency: 'daily',
    priority: deal.isLoot ? 0.9 : 0.8
  }));

  const categoryEntries: MetadataRoute.Sitemap = [
    'loot',
    'tech',
    'gaming',
    'home',
    'fashion',
    'audio'
  ].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.7
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0
    },
    ...categoryEntries,
    ...dealEntries
  ];
}
