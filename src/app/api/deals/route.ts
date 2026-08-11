import { NextRequest, NextResponse } from 'next/server';
import { getAllDealsAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    let deals = await getAllDealsAsync();

    if (category && category !== 'all') {
      if (category === 'loot') {
        deals = deals.filter((d) => d.isLoot || d.discountPercentage >= 35);
      } else {
        deals = deals.filter((d) => d.category.toLowerCase() === category.toLowerCase());
      }
    }

    if (query) {
      deals = deals.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.asin?.toLowerCase().includes(query) ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    if (sort === 'discount') {
      deals = [...deals].sort((a, b) => b.discountPercentage - a.discountPercentage);
    } else if (sort === 'price_low') {
      deals = [...deals].sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sort === 'price_high') {
      deals = [...deals].sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sort === 'clicks') {
      deals = [...deals].sort((a, b) => (b.clicksCount || 0) - (a.clicksCount || 0));
    } else {
      deals = [...deals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json(
      {
        success: true,
        count: deals.length,
        deals
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
