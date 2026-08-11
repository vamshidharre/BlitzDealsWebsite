import React from 'react';
import { Deal } from '@/lib/types';

interface JsonLdSchemaProps {
  deal: Deal;
}

export function JsonLdSchema({ deal }: JsonLdSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deal.title,
    image: [deal.imageUrl],
    description: deal.description,
    sku: deal.asin,
    mpn: deal.asin,
    brand: {
      '@type': 'Brand',
      name: deal.tags?.[0] || 'Amazon'
    },
    offers: {
      '@type': 'Offer',
      url: deal.affiliateUrl,
      priceCurrency: 'EUR',
      price: deal.discountPrice.toFixed(2),
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: deal.store || 'Amazon.de'
      }
    },
    aggregateRating: deal.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: deal.rating.toString(),
          reviewCount: (deal.ratingCount || 100).toString()
        }
      : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
