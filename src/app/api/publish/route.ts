import { NextRequest, NextResponse } from 'next/server';
import { saveDeal } from '@/lib/db';
import { PublishDealPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.PUBLISH_SECRET_KEY || 'blitzdeals-secret-2026';

    const token = authHeader?.replace(/^Bearer\s+/i, '') || '';

    // Allow if token matches or if passed in body
    const body = await request.json();
    const secretInBody = body.secretKey || body.secret_key;

    if (token !== expectedKey && secretInBody !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing secret key' },
        { status: 401 }
      );
    }

    if (!body.title || !body.affiliateUrl || typeof body.discountPrice !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, affiliateUrl, discountPrice)' },
        { status: 400 }
      );
    }

    const payload: PublishDealPayload & { imageBase64?: string } = {
      asin: body.asin,
      title: body.title,
      description: body.description,
      originalPrice: body.originalPrice,
      discountPrice: body.discountPrice,
      discountPercentage: body.discountPercentage,
      imageUrl: body.imageUrl,
      imageBase64: body.imageBase64 || body.image_base64,
      affiliateUrl: body.affiliateUrl,
      category: body.category || 'tech',
      isLoot: Boolean(body.isLoot),
      isPrime: body.isPrime !== false,
      rating: body.rating,
      ratingCount: body.ratingCount
    };

    const savedDeal = await saveDeal(payload);

    return NextResponse.json(
      {
        success: true,
        message: 'Deal successfully published to website!',
        deal: savedDeal
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
