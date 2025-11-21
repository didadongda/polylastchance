import { NextRequest } from 'next/server';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';

// 启用Edge Runtime以获得更好的性能
export const runtime = 'edge';

// 缓存60秒 - 显著减少API调用
export const revalidate = 60;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const search = req.nextUrl.search; // includes leading '?'
  const params = await context.params;
  const pathSegments = params.path || [];
  const pathname = pathSegments.join('/');
  const targetUrl = `${POLYMARKET_API}/${pathname}${search}`;

  console.log('Proxying request to:', targetUrl);

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventTimer/2.0)',
      },
      // 使用Next.js缓存,60秒后重新验证
      next: { revalidate: 60 },
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        // 允许浏览器缓存60秒,之后必须重新验证
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Proxy error', message: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}