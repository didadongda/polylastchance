'use client';

import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function FilterBar() {
  const { filter, setFilter, favorites } = useAppStore();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索市场..."
            value={filter.searchQuery || ''}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {/* Favorites Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setFilter({ timeFilter: filter.timeFilter === 'favorites' ? 'all' : 'favorites' })}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all
            ${
              filter.timeFilter === 'favorites'
                ? 'glass-strong border-2 border-yellow-500 text-white glow'
                : 'glass border border-white/10 text-gray-300 hover:border-white/20'
            }
          `}
        >
          <Star className={`w-4 h-4 ${filter.timeFilter === 'favorites' ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
          <span>收藏</span>
          <span
            className={`
              px-2 py-0.5 rounded-full text-xs font-bold
              ${filter.timeFilter === 'favorites' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-gray-400'}
            `}
          >
            {favorites.size}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
