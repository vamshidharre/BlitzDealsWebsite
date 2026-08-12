# ⚡ BlitzDeals.de - High-Performance Amazon Deals & SEO Web Portal

A modern, high-converting **Amazon Affiliate Deals Web Portal** built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**.

Featuring automated deal ingestion from Telegram bots, direct image rendering, permanent cloud persistence with **Upstash Redis**, full **Google SEO structured data (JSON-LD Product & Offer Schema)**, dynamic XML sitemaps, and instant live search.

---

## 🌟 Key Features

- **🚀 Google SEO & Rich Snippets:**
  - Full `schema.org/Product` and `schema.org/Offer` JSON-LD structured markup (enables star ratings, pricing, and in-stock badges directly on Google Search).
  - Dynamic, auto-generated `/sitemap.xml` and `/robots.txt` for instant Google Search Console indexing.
  - Social OpenGraph & Twitter Card metadata on every deal page.
  - Integrated Google Search Console verification support (`google-site-verification`).
- **💎 Ultra-Premium Dark Glassmorphism UI:**
  - Modern cyberpunk neon aesthetics with dynamic ambient lighting and micro-animations.
  - Interactive price comparison (`~~419,00 €~~ ➔ 269,00 € | Deine Ersparnis: 150,00 €`).
  - Animated discount badges (`-36%`, `🔥 PREISFEHLER`, `Prime`).
- **☁️ Indestructible Cloud Persistence (Upstash Redis):**
  - Connects to Upstash Redis REST API for permanent deal storage across all Vercel builds and container restarts.
  - Zero-lag in-memory caching fallback.
- **📸 Direct Telegram Image Support:**
  - Accepts native base64 photos directly from Telegram scraper bots via webhook.
  - Serverless-ready image rendering with zero external file system dependencies.
- **🔍 Instant Live Search & Filtering:**
  - Real-time client-side search by title, ASIN, or tag.
  - Category filters: `🔥 Preisfehler`, `💻 Tech & PC`, `🎮 Gaming`, `🏠 Haushalt & Küche`, `🎧 Audio & HiFi`, `👗 Mode`.
  - Sorting: *Neueste zuerst*, *Höchster Rabatt %*, *Beliebteste*, *Günstigster Preis*.
- **📲 Social Community Integration:**
  - Direct 1-click links to official **Telegram Channel** (`https://t.me/dealsingermany`) and **Discord Community** (`https://discord.gg/75gPdFBr`).
  - 1-Click viral deal sharing to WhatsApp, Telegram, Twitter/X, and clipboard copy.
- **🤖 Decoupled Webhook Endpoint (`POST /api/publish`):**
  - Allows external bots (like AffiliateBot) to publish deals securely using a bearer secret key.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Glassmorphism Design System
- **Icons:** Lucide React
- **Cloud Database:** Upstash Redis REST API / Vercel KV / Local Atomic JSON

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
PUBLISH_SECRET_KEY=blitzdeals-secret-2026
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Upstash Redis Cloud Database
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Reference

### 1. Publish a Deal (`POST /api/publish`)
Secure webhook to automatically post a deal from your bot to the website.

**Headers:**
```http
Authorization: Bearer blitzdeals-secret-2026
Content-Type: application/json
```

**Request Body Example:**
```json
{
  "asin": "B09Y2MYL5C",
  "title": "Sony WH-1000XM5 Bluetooth Noise-Cancelling Kopfhörer",
  "description": "Branchenführende Geräuschunterdrückung mit bis zu 30 Std. Akku.",
  "originalPrice": 419.00,
  "discountPrice": 269.00,
  "discountPercentage": 36,
  "imageBase64": "data:image/jpeg;base64,...",
  "affiliateUrl": "https://www.amazon.de/dp/B09Y2MYL5C?tag=mysterydealzd-21",
  "category": "audio",
  "isLoot": true,
  "isPrime": true,
  "secretKey": "blitzdeals-secret-2026"
}
```

### 2. Fetch All Deals (`GET /api/deals`)
```http
GET /api/deals?category=tech&sort=discount&q=sony
```

### 3. Fetch Single Deal (`GET /api/deals/[slug]`)
```http
GET /api/deals/sony-wh-1000xm5-bluetooth-noise-cancelling-b09y2myl5c
```

---

## ☁️ Deployment on Vercel

1. Push this repository to your GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository into **[Vercel](https://vercel.com)**.
3. In **Project Settings ➔ Environment Variables**, add:
   | Variable | Value | Description |
   |---|---|---|
   | `PUBLISH_SECRET_KEY` | `blitzdeals-secret-2026` | Secure key for bot webhook publishing |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production website base URL |
   | `UPSTASH_REDIS_REST_URL` | `https://your-db.upstash.io` | Upstash Redis REST URL |
   | `UPSTASH_REDIS_REST_TOKEN` | `your_upstash_token` | Upstash Redis REST Token |

4. Click **Deploy**. Vercel will build and serve your website globally with instant edge caching!

---

## 🔍 Google Search Console Verification

To verify site ownership on Google Search Console:
- **HTML File:** `https://your-site/google4fdfab1ab320b437.html`
- **Sitemap Submission:** In Google Search Console ➔ Sitemaps, submit `sitemap.xml`.

---

## 📄 License

MIT License. Designed with care for high-conversion affiliate marketing.
