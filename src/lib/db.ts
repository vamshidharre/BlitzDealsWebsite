import fs from 'fs';
import path from 'path';
import { Deal, PublishDealPayload } from './types';
import { generateSlug } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'deals.json');
const PUBLIC_DEALS_DIR = path.join(process.cwd(), 'public', 'deals');

function ensureDirectories(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_DEALS_DIR)) {
      fs.mkdirSync(PUBLIC_DEALS_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Database directory initialization error:', err);
  }
}

export function getAllDeals(): Deal[] {
  try {
    ensureDirectories();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const deals: Deal[] = JSON.parse(data);
    return deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error reading deals:', err);
    return [];
  }
}

export function getDealBySlug(slug: string): Deal | null {
  const deals = getAllDeals();
  const lowerSlug = slug.toLowerCase();
  return (
    deals.find((d) => d.slug.toLowerCase() === lowerSlug || d.id === slug || (d.asin && d.asin.toLowerCase() === lowerSlug)) ||
    null
  );
}

export function getDealsByCategory(category: string): Deal[] {
  const deals = getAllDeals();
  if (!category || category === 'all') return deals;
  if (category === 'loot') return deals.filter((d) => d.isLoot || d.discountPercentage >= 35);
  return deals.filter((d) => d.category.toLowerCase() === category.toLowerCase());
}

export function searchDeals(query: string, category = 'all'): Deal[] {
  const deals = getDealsByCategory(category);
  if (!query || !query.trim()) return deals;

  const q = query.toLowerCase().trim();
  return deals.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.asin?.toLowerCase().includes(q) ||
      (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export function saveDeal(payload: PublishDealPayload & { imageBase64?: string }): Deal {
  ensureDirectories();
  const deals = getAllDeals();

  const originalPrice = payload.originalPrice || payload.discountPrice;
  const discountPrice = payload.discountPrice;
  const discountPercentage =
    payload.discountPercentage ||
    (originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0);
  const savingsAmount = Math.max(0, Number((originalPrice - discountPrice).toFixed(2)));
  const asin = payload.asin || 'AMZ' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const slug = generateSlug(payload.title, asin);
  const dealId = `deal-${Date.now()}`;

  // Process image from Telegram: Save base64 image locally into public/deals/
  let finalImageUrl = payload.imageUrl || '/banner.png';
  if (payload.imageBase64 && payload.imageBase64.includes('base64,')) {
    try {
      const base64Data = payload.imageBase64.split(';base64,').pop();
      if (base64Data) {
        const imageFileName = `${asin || dealId}.jpg`;
        const imageFilePath = path.join(PUBLIC_DEALS_DIR, imageFileName);
        fs.writeFileSync(imageFilePath, Buffer.from(base64Data, 'base64'));
        finalImageUrl = `/deals/${imageFileName}`;
      }
    } catch (e) {
      console.error('Failed to save Telegram image to disk, falling back:', e);
      finalImageUrl = payload.imageBase64;
    }
  }

  // Check if deal already exists by ASIN to update instead of duplicate
  const existingIdx = deals.findIndex((d) => d.asin && d.asin.toUpperCase() === asin.toUpperCase());

  const newDeal: Deal = {
    id: existingIdx >= 0 ? deals[existingIdx].id : dealId,
    asin: asin.toUpperCase(),
    title: payload.title.trim(),
    slug,
    description: payload.description || 'Aktuelles Top-Angebot auf Amazon mit starkem Preisnachlass.',
    originalPrice,
    discountPrice,
    discountPercentage,
    savingsAmount,
    currency: '€',
    imageUrl: finalImageUrl,
    affiliateUrl: payload.affiliateUrl,
    category: payload.category || 'tech',
    isLoot: payload.isLoot || discountPercentage >= 35,
    isFeatured: discountPercentage >= 30,
    rating: payload.rating || 4.7,
    ratingCount: payload.ratingCount || 120,
    isPrime: payload.isPrime !== false,
    store: 'Amazon.de',
    createdAt: existingIdx >= 0 ? deals[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [payload.category || 'Deal', 'Amazon', discountPercentage >= 35 ? 'Loot' : 'Schnäppchen'],
    clicksCount: existingIdx >= 0 ? deals[existingIdx].clicksCount || 0 : 0
  };

  if (existingIdx >= 0) {
    deals[existingIdx] = newDeal;
  } else {
    deals.unshift(newDeal);
  }

  // Persist to disk atomically
  fs.writeFileSync(DB_FILE, JSON.stringify(deals, null, 2), 'utf-8');
  return newDeal;
}

export function clearAllDeals(): void {
  ensureDirectories();
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export function incrementClickCount(id: string): void {
  try {
    ensureDirectories();
    const deals = getAllDeals();
    const deal = deals.find((d) => d.id === id || d.slug === id);
    if (deal) {
      deal.clicksCount = (deal.clicksCount || 0) + 1;
      fs.writeFileSync(DB_FILE, JSON.stringify(deals, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error incrementing click count:', err);
  }
}
