// 外部数据API集成

/**
 * CoinGecko API - 加密货币价格
 */
export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdate: number;
}

export async function fetchCryptoPrice(coinId: string): Promise<CryptoPrice | null> {
  try {
    // Use our API proxy to avoid CORS issues
    const response = await fetch(`/api/crypto-price?id=${coinId}`, {
      cache: 'default',
      next: { revalidate: 30 }, // 30秒缓存
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.error || !data[coinId]) return null;

    return {
      symbol: coinId.toUpperCase(),
      price: data[coinId].usd,
      change24h: data[coinId].usd_24h_change || 0,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    // Fail silently
    return null;
  }
}

/**
 * 根据市场描述智能识别加密货币
 */
export function detectCryptoSymbol(text: string): string | null {
  const lowerText = text.toLowerCase();

  const cryptoMap: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'btc': 'bitcoin',
    'ethereum': 'ethereum',
    'eth': 'ethereum',
    'solana': 'solana',
    'sol': 'solana',
    'cardano': 'cardano',
    'ada': 'cardano',
    'xrp': 'ripple',
    'ripple': 'ripple',
    'dogecoin': 'dogecoin',
    'doge': 'dogecoin',
    'polkadot': 'polkadot',
    'dot': 'polkadot',
  };

  for (const [keyword, coinId] of Object.entries(cryptoMap)) {
    if (lowerText.includes(keyword)) {
      return coinId;
    }
  }

  return null;
}

/**
 * NewsData.io API - 新闻数据
 * 注意: 需要API Key，这里提供示例接口
 */
export interface NewsArticle {
  title: string;
  description: string;
  pubDate: string;
  source: string;
  link: string;
}

export async function fetchNews(
  keywords: string,
  apiKey?: string
): Promise<NewsArticle[]> {
  // 如果没有API Key，返回空数组
  if (!apiKey) {
    console.warn('NewsData.io API key not provided');
    return [];
  }

  try {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(keywords)}&language=en&size=3`,
      {
        cache: 'default',
        next: { revalidate: 600 }, // 10分钟缓存
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).map((item: any) => ({
      title: item.title,
      description: item.description,
      pubDate: item.pubDate,
      source: item.source_id,
      link: item.link,
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

/**
 * 提取市场关键词用于新闻搜索
 */
export function extractKeywords(marketQuestion: string): string {
  // 移除常见词汇
  const stopWords = ['will', 'be', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'by', 'before', 'after'];

  const words = marketQuestion
    .toLowerCase()
    .replace(/[?!.,]/g, '')
    .split(' ')
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  // 返回前3-4个关键词
  return words.slice(0, 4).join(' ');
}
