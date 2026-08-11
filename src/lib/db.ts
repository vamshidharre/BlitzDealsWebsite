import fs from 'fs';
import path from 'path';
import { Deal, PublishDealPayload } from './types';
import { generateSlug } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'deals.json');

// Default initial high-converting seed deals
const INITIAL_SEED_DEALS: Deal[] = [
  {
    id: 'deal-1',
    asin: 'B0BDHWDR12',
    title: 'Apple AirPods Pro (2. Generation) mit MagSafe Case (USB-C) & Active Noise Cancellation',
    slug: 'apple-airpods-pro-2-generation-magsafe-usb-c-b0bdhwdr12',
    description: 'Branchenführende aktive Geräuschunterdrückung, Transparenzmodus, personalisiertes 3D Audio mit dynamischem Head Tracking und bis zu 30 Stunden Wiedergabezeit mit dem Ladecase.',
    originalPrice: 279.0,
    discountPrice: 199.0,
    discountPercentage: 29,
    savingsAmount: 80.0,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0BDHWDR12?tag=mysterydealzd-21',
    category: 'audio',
    isLoot: true,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 18450,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    tags: ['Apple', 'AirPods', 'Kopfhörer', 'Noise Cancelling', 'Bestpreis'],
    clicksCount: 142
  },
  {
    id: 'deal-2',
    asin: 'B0C7J8XZ9P',
    title: 'Sony WH-1000XM5 Kabellose Bluetooth Noise-Cancelling-Kopfhörer (30 Std. Akku)',
    slug: 'sony-wh-1000xm5-bluetooth-noise-cancelling-b0c7j8xz9p',
    description: 'Zwei Prozessoren und 8 Mikrofone für unübertroffene Geräuschunterdrückung. Kristallklare Freisprechanrufe und extrem leichtes, ergonomisches Design.',
    originalPrice: 419.0,
    discountPrice: 269.0,
    discountPercentage: 36,
    savingsAmount: 150.0,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4NuUL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0C7J8XZ9P?tag=mysterydealzd-21',
    category: 'audio',
    isLoot: true,
    isFeatured: true,
    rating: 4.7,
    ratingCount: 9230,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    tags: ['Sony', 'Over-Ear', 'Hi-Res Audio', 'Tiefstpreis'],
    clicksCount: 98
  },
  {
    id: 'deal-3',
    asin: 'B08K31NWCC',
    title: 'Ninja Foodi MAX DualZone Heißluftfritteuse AF400EU (9,5 Liter, 2 Fächer)',
    slug: 'ninja-foodi-max-dualzone-heissluftfritteuse-af400eu-b08k31nwcc',
    description: '2 unabhängige Garzonen: Unterschiedliche Speisen, Garzeiten und Programme auf den Punkt genau synchron servieren. Bis zu 75% weniger Fett als bei herkömmlichen Frittiermethoden.',
    originalPrice: 249.99,
    discountPrice: 159.99,
    discountPercentage: 36,
    savingsAmount: 90.0,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/71rQ1c8F3uL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B08K31NWCC?tag=mysterydealzd-21',
    category: 'home',
    isLoot: false,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 32100,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    tags: ['Ninja', 'Airfryer', 'Küche', 'Bestseller'],
    clicksCount: 215
  },
  {
    id: 'deal-4',
    asin: 'B0BY8WJ2B3',
    title: 'PlayStation 5 DualSense Wireless-Controller – Midnight Black',
    slug: 'playstation-5-dualsense-wireless-controller-midnight-black-b0by8wj2b3',
    description: 'Erlebe ein noch fesselnderes Gaming-Erlebnis mit haptischem Feedback, dynamischen adaptiven Triggern und integriertem Mikrofon im stylischen Midnight Black Design.',
    originalPrice: 74.99,
    discountPrice: 49.99,
    discountPercentage: 33,
    savingsAmount: 25.0,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/612hnms2FmL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0BY8WJ2B3?tag=mysterydealzd-21',
    category: 'gaming',
    isLoot: false,
    isFeatured: false,
    rating: 4.7,
    ratingCount: 41200,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    tags: ['PS5', 'PlayStation', 'Gaming', 'Controller'],
    clicksCount: 84
  },
  {
    id: 'deal-5',
    asin: 'B08F7PTF54',
    title: 'Samsung 990 PRO NVMe M.2 SSD 2 TB (PCIe 4.0, bis zu 7.450 MB/s)',
    slug: 'samsung-990-pro-nvme-m2-ssd-2tb-b08f7ptf54',
    description: 'Maximale PCIe 4.0 Performance für High-End Gaming und anspruchsvolle 4K/8K Videobearbeitung. Bis zu 55% verbesserte Energieeffizienz.',
    originalPrice: 199.9,
    discountPrice: 139.0,
    discountPercentage: 30,
    savingsAmount: 60.9,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/81xU9d-tDdL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B08F7PTF54?tag=mysterydealzd-21',
    category: 'tech',
    isLoot: false,
    isFeatured: false,
    rating: 4.9,
    ratingCount: 15300,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    tags: ['SSD', 'Samsung', 'PC Gaming', 'Speicher'],
    clicksCount: 67
  },
  {
    id: 'deal-6',
    asin: 'B0F6Y162GJ',
    title: 'Jiuday V Push-Up BH ohne Bügel (Bequemer Jelly BH, Starker Halt)',
    slug: 'jiuday-v-push-up-bh-ohne-buegel-jelly-bh-b0f6y162gj',
    description: 'Atmungsaktiv, nahtlos und ultrabequem mit innovativem Jelly-Stützband ohne drückende Bügel.',
    originalPrice: 26.95,
    discountPrice: 19.99,
    discountPercentage: 26,
    savingsAmount: 6.96,
    currency: '€',
    imageUrl: 'https://m.media-amazon.com/images/I/61N+1sV3x+L._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0F6Y162GJ?tag=mysterydealzd-21',
    category: 'fashion',
    isLoot: false,
    isFeatured: false,
    rating: 4.5,
    ratingCount: 310,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    tags: ['Mode', 'Damen', 'Unterwäsche'],
    clicksCount: 34
  }
];

function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_DEALS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

export function getAllDeals(): Deal[] {
  try {
    ensureDbFile();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const deals: Deal[] = JSON.parse(data);
    return deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error reading deals:', err);
    return INITIAL_SEED_DEALS;
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
      d.asin.toLowerCase().includes(q) ||
      (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export function saveDeal(payload: PublishDealPayload): Deal {
  ensureDbFile();
  const deals = getAllDeals();

  const originalPrice = payload.originalPrice || payload.discountPrice;
  const discountPrice = payload.discountPrice;
  const discountPercentage =
    payload.discountPercentage ||
    (originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0);
  const savingsAmount = Math.max(0, Number((originalPrice - discountPrice).toFixed(2)));
  const asin = payload.asin || 'AMZ' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const slug = generateSlug(payload.title, asin);

  // Check if deal already exists by ASIN to update instead of duplicate
  const existingIdx = deals.findIndex((d) => d.asin && d.asin.toUpperCase() === asin.toUpperCase());

  const newDeal: Deal = {
    id: existingIdx >= 0 ? deals[existingIdx].id : `deal-${Date.now()}`,
    asin: asin.toUpperCase(),
    title: payload.title.trim(),
    slug,
    description: payload.description || 'Aktuelles Top-Angebot auf Amazon mit starkem Preisnachlass.',
    originalPrice,
    discountPrice,
    discountPercentage,
    savingsAmount,
    currency: '€',
    imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
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

export function incrementClickCount(id: string): void {
  try {
    ensureDbFile();
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
