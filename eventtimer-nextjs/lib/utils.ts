import { Market } from '@/types/market';

export class Utils {
  static formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  }

  static formatCurrency(num: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  static formatPercentage(num: number): string {
    return `${(num * 100).toFixed(1)}%`;
  }

  static formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  }

  static formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 0) return '已过期';
    if (diffMins < 1) return '即将到期';
    if (diffMins < 60) return `${diffMins}分钟后`;
    if (diffHours < 24) return `${diffHours}小时后`;
    return `${diffDays}天后`;
  }

  static calculateCountdown(endDate: Date | string) {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
        urgent: false,
        soon: false,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      expired: false,
      urgent: days === 0 && hours < 24,
      soon: days < 7,
    };
  }

  static getUrgencyColor(urgency: Market['_urgency']): string {
    switch (urgency) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'urgent':
        return 'from-orange-500 to-orange-600';
      case 'soon':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  }

  static getUrgencyBorder(urgency: Market['_urgency']): string {
    switch (urgency) {
      case 'critical':
        return 'border-red-500/50';
      case 'urgent':
        return 'border-orange-500/50';
      case 'soon':
        return 'border-yellow-500/50';
      default:
        return 'border-blue-500/50';
    }
  }

  static getUrgencyBg(urgency: Market['_urgency']): string {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500/10';
      case 'urgent':
        return 'bg-orange-500/10';
      case 'soon':
        return 'bg-yellow-500/10';
      default:
        return 'bg-blue-500/10';
    }
  }

  static getUrgencyText(urgency: Market['_urgency']): string {
    switch (urgency) {
      case 'critical':
        return '🔴 即将到期';
      case 'urgent':
        return '🟠 24小时内';
      case 'soon':
        return '🟡 本周内';
      default:
        return '🔵 正常';
    }
  }

  static getPrice(market: Market): number {
    if (market.outcomePrices) {
      try {
        const prices = JSON.parse(market.outcomePrices);
        return parseFloat(prices[0] || 0);
      } catch {
        return 0;
      }
    }
    return parseFloat(market.lastTradePrice || '0');
  }

  static getLiquidity(market: Market): number {
    return parseFloat(String(market.liquidity || market.liquidityNum || '0'));
  }

  static getVolume(market: Market): number {
    return parseFloat(String(market.volume || '0'));
  }
}
