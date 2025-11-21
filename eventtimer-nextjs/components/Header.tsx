'use client';

import { motion } from 'framer-motion';
import { Timer, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { filteredMarkets, lastUpdate, loading, filter } = useAppStore();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdate) return;
      const minutes = Math.floor((Date.now() - lastUpdate) / 60000);
      if (minutes === 0) setTimeAgo('刚刚更新');
      else if (minutes === 1) setTimeAgo('1分钟前');
      else setTimeAgo(`${minutes}分钟前`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const urgentCount = filteredMarkets.filter(
    (m) => m._urgency === 'critical' || m._urgency === 'urgent'
  ).length;

  const avgLiquidity =
    filteredMarkets.length > 0
      ? filteredMarkets.reduce((sum, m) => sum + parseFloat(String(m.liquidity || '0')), 0) /
        filteredMarkets.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/10 p-2">
            <Image
              src="/logo.png"
              alt="PolyLastChance Logo"
              fill
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PolyLastChance
          </h1>
        </div>
        <p className="text-gray-400 text-lg mb-1">
          智能追踪 • 实时提醒 • 把握最后机会
        </p>
        <p className="text-sm text-gray-500 mb-3">
          {filter.timePeriod === '30min' && '📍 当前显示：30分钟内到期的市场'}
          {filter.timePeriod === '2h' && '📍 当前显示：2小时内到期的市场'}
          {filter.timePeriod === '12h' && '📍 当前显示：12小时内到期的市场'}
          {filter.timePeriod === 'all' && '📍 当前显示：所有市场'}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://t.me/dsa885"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass-strong rounded-lg hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            <span className="text-sm text-gray-300">Telegram</span>
          </a>

          <a
            href="https://x.com/hunterweb303"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass-strong rounded-lg hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-sm text-gray-300">X (Twitter)</span>
          </a>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Total Markets */}
        <div className="glass-strong rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">总市场数</div>
              <div className="text-3xl font-bold text-white">{filteredMarkets.length}</div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          {lastUpdate && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {timeAgo}
            </div>
          )}
        </div>

        {/* Urgent Markets */}
        <div className="glass-strong rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">24小时内到期</div>
              <div className="text-3xl font-bold text-orange-400">{urgentCount}</div>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg glow-orange">
              <Timer className="w-6 h-6 text-orange-400 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 text-xs text-orange-300">需要密切关注</div>
        </div>

        {/* Average Liquidity */}
        <div className="glass-strong rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">平均流动性</div>
              <div className="text-3xl font-bold text-white">
                ${avgLiquidity >= 1000 ? `${(avgLiquidity / 1000).toFixed(1)}K` : avgLiquidity.toFixed(0)}
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">所有市场平均值</div>
        </div>
      </motion.div>
    </div>
  );
}
