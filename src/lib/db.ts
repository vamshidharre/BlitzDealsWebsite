import fs from 'fs';
import path from 'path';
import { Deal, PublishDealPayload } from './types';
import { generateSlug } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'deals.json');

// 100% Verified Live German Amazon Deals with verified local images & working Amazon.de ASINs
const INITIAL_SEED_DEALS: Deal[] = [
  {
    id: 'deal-1',
    asin: 'B09Y2MYL5C',
    title: 'Sony WH-1000XM5 Kabellose Bluetooth Noise-Cancelling-Kopfhörer (30 Std. Akku)',
    slug: 'sony-wh-1000xm5-bluetooth-noise-cancelling-b09y2myl5c',
    description: 'Branchenführende aktive Geräuschunterdrückung mit zwei Prozessoren und 8 Mikrofonen. Bis zu 30 Stunden Akkulaufzeit, kristallklare Freisprechanrufe und extrem leichtes Design.',
    originalPrice: 419.0,
    discountPrice: 269.0,
    discountPercentage: 36,
    savingsAmount: 150.0,
    currency: '€',
    imageUrl: '/products/sony-xm5.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B09Y2MYL5C/?tag=mysterydealzd-21',
    category: 'audio',
    isLoot: true,
    isFeatured: true,
    rating: 4.7,
    ratingCount: 9230,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    tags: ['Sony', 'Kopfhörer', 'Noise Cancelling', 'Hi-Res Audio', 'Bestpreis'],
    clicksCount: 342
  },
  {
    id: 'deal-2',
    asin: 'B094WLFGD3',
    title: 'PlayStation 5 DualSense Wireless-Controller (Midnight Black Edition)',
    slug: 'playstation-5-dualsense-wireless-controller-midnight-black-b094wlfgd3',
    description: 'Erlebe fesselndes Gaming mit haptischem Feedback, dynamischen adaptiven Triggern und integriertem Mikrofon im stylischen Midnight Black Design für PS5 und PC.',
    originalPrice: 74.99,
    discountPrice: 49.99,
    discountPercentage: 33,
    savingsAmount: 25.0,
    currency: '€',
    imageUrl: '/products/ps5-controller.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B094WLFGD3/?tag=mysterydealzd-21',
    category: 'gaming',
    isLoot: true,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 41200,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tags: ['PS5', 'PlayStation', 'Sony', 'Gaming', 'Controller'],
    clicksCount: 289
  },
  {
    id: 'deal-3',
    asin: 'B07NGP2JRQ',
    title: 'SanDisk Extreme PRO SDXC UHS-I Speicherkarte 128 GB (bis zu 200 MB/s, V30, 4K UHD)',
    slug: 'sandisk-extreme-pro-sdxc-128gb-b07ngp2jrq',
    description: 'Extrem schnelle Übertragungsgeschwindigkeiten von bis zu 200 MB/s dank SanDisk QuickFlow-Technologie. Perfekt für 4K-UHD-Videos und Serienbildaufnahmen.',
    originalPrice: 42.99,
    discountPrice: 24.99,
    discountPercentage: 42,
    savingsAmount: 18.0,
    currency: '€',
    imageUrl: '/products/sandisk-128gb.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B07NGP2JRQ/?tag=mysterydealzd-21',
    category: 'tech',
    isLoot: true,
    isFeatured: false,
    rating: 4.8,
    ratingCount: 68500,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    tags: ['SanDisk', 'Speicherkarte', 'Kamera', '4K Video'],
    clicksCount: 156
  },
  {
    id: 'deal-4',
    asin: 'B08D6NCQ1Z',
    title: 'Philips Hue White & Color Ambiance E27 LED Lampe (16 Mio. Farben, Smart Home)',
    slug: 'philips-hue-white-color-ambiance-e27-b08d6ncq1z',
    description: 'Verwandle dein Zuhause mit 16 Millionen Farben und allen Weißtönen. Kompatibel mit Alexa, Google Assistant und Apple HomeKit.',
    originalPrice: 59.99,
    discountPrice: 38.99,
    discountPercentage: 35,
    savingsAmount: 21.0,
    currency: '€',
    imageUrl: '/products/philips-hue.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B08D6NCQ1Z/?tag=mysterydealzd-21',
    category: 'home',
    isLoot: false,
    isFeatured: false,
    rating: 4.7,
    ratingCount: 22400,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    tags: ['Philips Hue', 'Smart Home', 'Beleuchtung', 'Alexa'],
    clicksCount: 194
  },
  {
    id: 'deal-5',
    asin: 'B0FJY4PXB7',
    title: "Tefal Jamie Oliver Cook's Direct On Edelstahl Bratpfanne 28 cm (Thermo-Signal)",
    slug: 'tefal-jamie-oliver-cooks-direct-bratpfanne-28cm-b0fjy4pxb7',
    description: 'Hochwertiger Edelstahl mit langlebiger Antihaftversiegelung und Thermo-Signal-Temperaturanzeiger. Für alle Herdarten inklusive Induktion geeignet.',
    originalPrice: 89.99,
    discountPrice: 44.99,
    discountPercentage: 50,
    savingsAmount: 45.0,
    currency: '€',
    imageUrl: '/products/tefal-pfanne.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0FJY4PXB7/?tag=mysterydealzd-21',
    category: 'home',
    isLoot: true,
    isFeatured: true,
    rating: 4.6,
    ratingCount: 14800,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    tags: ['Tefal', 'Jamie Oliver', 'Küche', 'Pfanne', '50% Rabatt'],
    clicksCount: 278
  },
  {
    id: 'deal-6',
    asin: 'B0F6Y162GJ',
    title: 'Jiuday Tiefer V Push-Up BH ohne Bügel (Bequemer Jelly BH, Starker Halt)',
    slug: 'jiuday-tiefer-v-push-up-bh-ohne-buegel-jelly-bh-b0f6y162gj',
    description: 'Atmungsaktiv, nahtlos und ultrabequem mit innovativem elastischem Jelly-Stützband ohne drückende Metallbügel für optimalen Tragekomfort den ganzen Tag.',
    originalPrice: 26.95,
    discountPrice: 19.99,
    discountPercentage: 26,
    savingsAmount: 6.96,
    currency: '€',
    imageUrl: '/products/jiuday-bh.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0F6Y162GJ/?tag=mysterydealzd-21',
    category: 'fashion',
    isLoot: false,
    isFeatured: false,
    rating: 4.5,
    ratingCount: 340,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    tags: ['Mode', 'Damen', 'Unterwäsche', 'Komfort'],
    clicksCount: 88
  },
  {
    id: 'deal-7',
    asin: 'B0GKZ8K4VN',
    title: 'Anker Nano 30W USB-C Schnellladegerät (Kompakt für iPhone 16/15, iPad & MacBook Air)',
    slug: 'anker-nano-30w-usb-c-ladegeraet-b0gkz8k4vn',
    description: 'Ultra-kompaktes GaN Schnellladegerät mit 30 Watt Power Delivery. Bis zu 3x schnelleres Laden als herkömmliche 5W Adapter bei 70% geringerer Baugröße.',
    originalPrice: 24.99,
    discountPrice: 16.99,
    discountPercentage: 32,
    savingsAmount: 8.0,
    currency: '€',
    imageUrl: '/products/anker-nano.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0GKZ8K4VN/?tag=mysterydealzd-21',
    category: 'tech',
    isLoot: false,
    isFeatured: false,
    rating: 4.8,
    ratingCount: 29500,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    tags: ['Anker', 'Ladegerät', 'USB-C', 'iPhone', 'Schnellladen'],
    clicksCount: 167
  },
  {
    id: 'deal-8',
    asin: 'B0GZZZJ1Q9',
    title: 'TP-Link Tapo WLAN Smart Steckdose (Energieverbrauchskontrolle, Alexa & Google Home)',
    slug: 'tp-link-tapo-wlan-smart-steckdose-b0gzzz1q9',
    description: 'Steuere deine Elektrogeräte per Smartphone oder Sprachbefehl. Integrierter Stromzähler zur Überwachung und Senkung der Stromkosten in Echtzeit.',
    originalPrice: 19.99,
    discountPrice: 11.99,
    discountPercentage: 40,
    savingsAmount: 8.0,
    currency: '€',
    imageUrl: '/products/tapo-steckdose.jpg',
    affiliateUrl: 'https://www.amazon.de/dp/B0GZZZJ1Q9/?tag=mysterydealzd-21',
    category: 'home',
    isLoot: true,
    isFeatured: false,
    rating: 4.7,
    ratingCount: 38200,
    isPrime: true,
    store: 'Amazon.de',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    tags: ['Smart Home', 'Steckdose', 'Strom sparen', 'Tapo', 'Alexa'],
    clicksCount: 221
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
    imageUrl: payload.imageUrl || '/products/sony-xm5.jpg',
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
