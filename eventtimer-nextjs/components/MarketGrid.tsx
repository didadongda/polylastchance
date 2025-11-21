'use client';

import { motion } from 'framer-motion';
import { Loader2, Inbox } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MarketCard } from './MarketCard';

export function MarketGrid() {
  const { filteredMarkets, loading, filter } = useAppStore();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 text-lg">正在加载市场数据...</p>
      </div>
    );
  }

  if (filteredMarkets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="p-8 bg-white/5 rounded-full mb-6">
          <Inbox className="w-16 h-16 text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {filter.timeFilter === 'favorites' ? '还没有收藏' : '没有找到市场'}
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          {filter.timeFilter === 'favorites'
            ? '点击卡片右上角的星标来收藏你感兴趣的市场'
            : filter.searchQuery
            ? '试试其他搜索关键词或调整筛选条件'
            : '当前筛选条件下没有符合的市场'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMarkets.map((market, index) => (
        <MarketCard key={market.id} market={market} index={index} />
      ))}
    </div>
  );
}
