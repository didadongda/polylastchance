'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchCryptoPrice, detectCryptoSymbol, type CryptoPrice } from '@/lib/api/externalData';

interface ExternalDataProps {
  marketQuestion: string;
  category?: string;
}

export function ExternalData({ marketQuestion, category }: ExternalDataProps) {
  const [cryptoData, setCryptoData] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // 尝试检测加密货币
      const coinId = detectCryptoSymbol(marketQuestion);

      if (coinId) {
        const data = await fetchCryptoPrice(coinId);
        if (mounted && data) {
          setCryptoData(data);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [marketQuestion]);

  if (loading || !cryptoData) {
    return null;
  }

  const isPositive = cryptoData.change24h >= 0;

  return (
    <div className="mt-3 pt-3 border-t border-white/5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500/20 rounded flex items-center justify-center">
            <span className="text-[10px]">₿</span>
          </div>
          <span className="text-gray-400">{cryptoData.symbol} 当前价格</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">
            ${cryptoData.price.toLocaleString()}
          </span>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-[10px] font-medium">
              {isPositive ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="mt-1 text-[10px] text-gray-600">
        数据来源: CoinGecko
      </div>
    </div>
  );
}
