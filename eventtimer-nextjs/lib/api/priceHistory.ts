// CLOB Price History API
export interface PricePoint {
  t: number; // timestamp
  p: number; // price
}

export interface PriceHistoryResponse {
  history: PricePoint[];
}

/**
 * 获取市场价格历史
 * @param tokenId CLOB token ID
 * @param interval 时间间隔: 1m, 5m, 1h, 1d, 1w
 * @param startTs 开始时间戳（可选）
 * @param endTs 结束时间戳（可选）
 */
export async function fetchPriceHistory(
  tokenId: string,
  interval: string = '1h',
  startTs?: number,
  endTs?: number
): Promise<PricePoint[]> {
  try {
    const params = new URLSearchParams({
      market: tokenId,
      interval,
    });

    if (startTs) params.append('startTs', startTs.toString());
    if (endTs) params.append('endTs', endTs.toString());

    const response = await fetch(
      `https://clob.polymarket.com/prices-history?${params}`,
      {
        cache: 'default',
        next: { revalidate: 300 }, // 5分钟缓存
      }
    );

    if (!response.ok) {
      // Fail silently - many markets don't have historical data
      return [];
    }

    const data: PriceHistoryResponse = await response.json();
    return data.history || [];
  } catch (error) {
    // Fail silently - no need to spam console for missing data
    return [];
  }
}

/**
 * 获取简化的价格历史（最近24小时，1小时间隔）
 */
export async function fetchRecentPriceHistory(tokenId: string): Promise<PricePoint[]> {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  return fetchPriceHistory(tokenId, '1h', oneDayAgo, now);
}

/**
 * 计算价格变化百分比
 */
export function calculatePriceChange(history: PricePoint[]): number {
  if (history.length < 2) return 0;

  const first = history[0].p;
  const last = history[history.length - 1].p;

  return ((last - first) / first) * 100;
}
