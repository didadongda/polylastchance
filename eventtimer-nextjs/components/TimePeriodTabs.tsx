'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, Timer, Layers } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function TimePeriodTabs() {
  const { filter, setFilter, markets } = useAppStore();

  const tabs = [
    {
      id: '30min',
      label: '30分钟内',
      icon: Zap,
      count: markets.filter(m => m._hoursUntil && m._hoursUntil <= 0.5).length,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
    },
    {
      id: '2h',
      label: '2小时内',
      icon: Clock,
      count: markets.filter(m => m._hoursUntil && m._hoursUntil <= 2).length,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50',
    },
    {
      id: '12h',
      label: '12小时内',
      icon: Timer,
      count: markets.filter(m => m._hoursUntil && m._hoursUntil <= 12).length,
      color: 'from-yellow-500 to-blue-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/50',
    },
    {
      id: 'all',
      label: '全部',
      icon: Layers,
      count: markets.length,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6"
    >
      <div className="glass-strong rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">时间段筛选</h3>
          <span className="text-sm text-gray-400">（选择要查看的时间范围）</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = filter.timePeriod === tab.id;

            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setFilter({ timePeriod: tab.id as any })}
                className={`
                  relative p-4 rounded-xl transition-all
                  ${isActive
                    ? `glass-strong border-2 ${tab.borderColor} ${tab.bgColor}`
                    : 'glass border border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Gradient background on active */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-10 rounded-xl`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`
                        text-2xl font-bold
                        ${isActive ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      {tab.count}
                    </span>
                  </div>
                  <div
                    className={`
                      text-sm font-medium
                      ${isActive ? 'text-white' : 'text-gray-400'}
                    `}
                  >
                    {tab.label}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Info text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 默认显示 2 小时内的市场，点击其他时间段查看更多
        </div>
      </div>
    </motion.div>
  );
}
