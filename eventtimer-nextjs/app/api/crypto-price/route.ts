import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * CoinGecko API Proxy
 * Solves CORS issues by calling from server-side
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get('id');

  if (!coinId) {
    return NextResponse.json({ error: 'Missing coin ID' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 30 seconds
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `CoinGecko API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch crypto price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto price' },
      { status: 500 }
    );
  }
}
