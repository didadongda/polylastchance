// 浏览器通知系统
import { Market } from '@/types/market';

export type NotificationType = 'expiry' | 'price' | 'trader';

export interface NotificationRule {
  id: string;
  name: string;
  type: NotificationType;
  enabled: boolean;
  condition: (market: Market) => boolean;
  message: (market: Market) => string;
}

class NotificationManager {
  private rules: NotificationRule[] = [];
  private notifiedMarkets: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // 默认规则
      this.rules = [
        {
          id: 'expiry-1h',
          name: '1小时内到期提醒',
          type: 'expiry',
          enabled: true,
          condition: (market) => market._hoursUntil !== undefined && market._hoursUntil < 1 && market._hoursUntil > 0.9,
          message: (market) => `⏰ ${market.question} 将在1小时内到期！`,
        },
        {
          id: 'expiry-10min',
          name: '10分钟内到期提醒',
          type: 'expiry',
          enabled: true,
          condition: (market) => {
            const minutes = (market._hoursUntil || 0) * 60;
            return minutes < 10 && minutes > 9;
          },
          message: (market) => `🚨 ${market.question} 即将在10分钟内到期！`,
        },
      ];
    }
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * 发送通知
   */
  private sendNotification(title: string, body: string, tag: string) {
    if (typeof window === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    try {
      new Notification(title, {
        body,
        icon: '/logo.png',
        tag,
        requireInteraction: true,
        silent: false,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * 检查市场并触发通知
   */
  checkMarket(market: Market) {
    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(market)) {
          const notificationKey = `${rule.id}-${market.id}`;

          // 避免重复通知
          if (this.notifiedMarkets.has(notificationKey)) {
            continue;
          }

          this.notifiedMarkets.add(notificationKey);
          this.sendNotification(
            'PolyLastChance 提醒',
            rule.message(market),
            notificationKey
          );

          // 10分钟后清除标记，允许再次通知
          setTimeout(() => {
            this.notifiedMarkets.delete(notificationKey);
          }, 10 * 60 * 1000);
        }
      } catch (error) {
        console.error('Failed to check notification rule:', error);
      }
    }
  }

  /**
   * 批量检查市场
   */
  checkMarkets(markets: Market[]) {
    markets.forEach((market) => this.checkMarket(market));
  }

  /**
   * 添加自定义规则
   */
  addRule(rule: NotificationRule) {
    this.rules.push(rule);
  }

  /**
   * 获取所有规则
   */
  getRules(): NotificationRule[] {
    return [...this.rules];
  }

  /**
   * 启用/禁用规则
   */
  toggleRule(ruleId: string, enabled: boolean) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  /**
   * 测试通知
   */
  testNotification() {
    this.sendNotification(
      'PolyLastChance',
      '通知功能正常！您将收到市场到期提醒。',
      'test-notification'
    );
  }
}

// 全局单例
export const notificationManager = typeof window !== 'undefined' ? new NotificationManager() : null;
