'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchRecentPriceHistory, calculatePriceChange, PricePoint } from '@/lib/api/priceHistory';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChartProps {
  tokenId: string;
  currentPrice?: number;
}

export function PriceChart({ tokenId, currentPrice }: PriceChartProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const history = await fetchRecentPriceHistory(tokenId);

        if (mounted && history.length > 0) {
          setData(history);
          const change = calculatePriceChange(history);
          setPriceChange(change);
        }
      } catch (error) {
        // Fail silently - no need to log errors for missing price data
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [tokenId]);

  // Don't show anything while loading or if no data - fail silently
  if (loading || data.length === 0) {
    return null;
  }

  const isPositive = priceChange >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="space-y-2">
      {/* Price Change Indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">24h变化</span>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="font-medium">{isPositive ? '+' : ''}{priceChange.toFixed(2)}%</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={data}>
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const value = payload[0].value as number;
                return (
                  <div className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-xs">
                    <div className="text-white font-medium">
                      ${(value * 100).toFixed(1)}¢
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="p"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
