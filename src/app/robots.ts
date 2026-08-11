import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzdeals.de';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/publish']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
