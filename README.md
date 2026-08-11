# ⚡ BlitzDeals.de – High-Performance Amazon Deals & SEO Web Portal

A state-of-the-art, high-converting **Amazon Affiliate Deals Website** built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**.

Includes full **Google SEO structured data (JSON-LD Product & Offer Schema)**, automatic XML sitemaps, instant search, responsive glassmorphism dark mode, and a secure webhook receiver for automated bot publishing.

---

## 🌟 Key Features

- **🚀 Google SEO Optimization:**
  - Full `schema.org/Product` and `schema.org/Offer` JSON-LD rich snippet markup (enables star ratings, pricing, and in-stock badges on Google Search).
  - Dynamic, auto-generated `/sitemap.xml` for instant Google Search Console indexing.
  - Social OpenGraph & Twitter Card metadata on every deal page.
- **💎 Ultra-Premium UI:**
  - Deep dark mode with glassmorphic cards and ambient lighting.
  - Interactive price comparison (`~~419,00 €~~ ➔ 269,00 € | Spare 150,00 €`).
  - Animated discount badges (`-36%`, `🔥 PREISFEHLER`).
- **🔍 Instant Live Search & Filtering:**
  - Real-time client-side search by title, ASIN, or tag.
  - Category filters: `🔥 Preisfehler`, `💻 Tech & PC`, `🎮 Gaming`, `🏠 Haushalt & Küche`, `🎧 Audio`, `👗 Mode`.
  - Sorting: *Neueste zuerst*, *Höchster Rabatt %*, *Beliebteste*, *Günstigster Preis*.
- **📲 Viral Social Sharing:**
  - 1-Click deal sharing to WhatsApp, Telegram, Twitter/X, and clipboard copy.
- **🤖 Decoupled Webhook Endpoint (`POST /api/publish`):**
  - Allows any external bot or script to publish deals directly via a secure REST API key.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Glassmorphism System
- **Icons:** Lucide React
- **Database:** Atomic JSON / SQLite storage (`data/deals.json`)

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Reference

### 1. Publish a Deal (Webhook)
```http
POST /api/publish
Authorization: Bearer blitzdeals-secret-2026
Content-Type: application/json

{
  "asin": "B0BDHWDR12",
  "title": "Apple AirPods Pro 2",
  "description": "Active Noise Cancelling MagSafe USB-C",
  "originalPrice": 279.00,
  "discountPrice": 199.00,
  "discountPercentage": 29,
  "imageUrl": "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
  "affiliateUrl": "https://www.amazon.de/dp/B0BDHWDR12?tag=mysterydealzd-21",
  "category": "audio",
  "isLoot": true
}
```

### 2. Fetch Deals
```http
GET /api/deals?category=tech&sort=discount&q=airpods
```

---

## ☁️ Deployment on Vercel (1-Click)

1. Push this repository to your GitHub (`https://github.com/your-username/BlitzDealsWebsite`).
2. Import the repository into **[Vercel](https://vercel.com)**.
3. Add Environment Variable:
   - `PUBLISH_SECRET_KEY` = `your-custom-secret-key`
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.de`
4. Click **Deploy**. Vercel will build and serve your website globally with instant edge caching!

---

## 📄 License

MIT License. Designed with care for high-conversion affiliate marketing.
