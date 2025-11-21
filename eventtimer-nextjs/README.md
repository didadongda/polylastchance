# EventTimer Pro - Next.js 版本

🚀 **专业的 Polymarket 市场倒计时追踪工具**

## ✨ 特色功能

### 🎯 核心差异化优势

1. **智能倒计时系统**
   - ⏰ 实时倒计时（精确到秒）
   - 🔴 紧急度分级（即将到期、24小时内、本周内、正常）
   - 📊 按到期时间自动排序
   - ⚡ 每秒更新，无闪烁

2. **一键跳转交易**
   - 🔗 点击卡片直接跳转到 Polymarket 交易页面
   - 🚀 无需手动搜索市场
   - 💨 节省交易时间

3. **智能筛选系统**
   - 🔍 实时搜索
   - 🔥 24小时内到期筛选
   - ⏱️ 本周内到期筛选
   - ⭐ 收藏功能（LocalStorage 持久化）
   - 💎 流动性过滤（≥ $1K）

4. **酷炫UI设计**
   - 🎨 现代化玻璃态设计
   - ✨ Framer Motion 动画效果
   - 🌈 渐变色彩系统
   - 📱 响应式布局
   - 🌙 深色主题

5. **实时数据同步**
   - 🔄 每2分钟自动刷新
   - 📈 价格历史追踪
   - 📊 统计信息实时更新

## 🎪 与官方的差异化

| 功能 | EventTimer Pro | Polymarket 官方 |
|------|---------------|----------------|
| **倒计时显示** | ✅ 实时倒计时到秒 | ❌ 无 |
| **紧急度标识** | ✅ 4级紧急度分级 | ❌ 无 |
| **智能排序** | ✅ 自动按到期时间排序 | ❌ 需手动搜索 |
| **快速筛选** | ✅ 24小时内/本周内 | ❌ 无专门筛选 |
| **一键交易** | ✅ 点击卡片跳转 | - 原生交易 |
| **收藏功能** | ✅ 本地持久化 | ❌ 需登录 |
| **流动性过滤** | ✅ 自动过滤<$1K | ❌ 显示所有 |
| **尾盘提醒** | ✅ 视觉+文字提醒 | ❌ 无 |

## 🏗️ 技术栈

- **框架**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS + 玻璃态设计
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图标**: Lucide React
- **时间处理**: date-fns
- **API**: Polymarket Gamma API + CLOB REST

## 📁 项目结构

```
eventtimer-nextjs/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/
│   ├── Header.tsx            # 顶部导航和统计
│   ├── FilterBar.tsx         # 筛选器组件
│   ├── MarketCard.tsx        # 市场卡片
│   └── MarketGrid.tsx        # 市场列表容器
├── lib/
│   ├── api.ts                # API 调用逻辑
│   ├── utils.ts              # 工具函数
│   └── store.ts              # Zustand 状态管理
├── types/
│   └── market.ts             # TypeScript 类型定义
└── public/                   # 静态资源
```

## 🚀 启动指南

### 1. 启动代理服务器

```bash
cd "/Users/huan/Desktop/prediction market/event timer"
node proxy-server.js > /tmp/proxy.log 2>&1 &
```

### 2. 启动 Next.js 应用

```bash
cd eventtimer-nextjs
npm install  # 首次运行
npm run dev
```

### 3. 访问应用

打开浏览器访问: `http://localhost:3002`

（如果 3002 被占用，Next.js 会自动尝试其他端口）

## 🎯 核心功能说明

### 倒计时系统

```typescript
// 4级紧急度分级
'critical'  // < 1小时  🔴 红色 + 脉冲动画
'urgent'    // < 24小时 🟠 橙色 + 发光效果
'soon'      // < 7天    🟡 黄色
'normal'    // 正常     🔵 蓝色
```

### 时间字段优先级

```typescript
// 正确的优先级（已修复 endDateIso 陷阱）
1. endDate       // 完整时间戳 "2025-11-06T17:45:00Z"
2. gameStartTime // 体育赛事开始时间
3. endDateIso    // 仅日期（最后使用）
```

### 筛选逻辑

- **全部**: 显示所有未过期的市场
- **24小时内**: 只显示 critical + urgent
- **本周内**: 只显示 soon
- **收藏**: 从 LocalStorage 读取收藏列表

### 一键交易

```typescript
// 点击卡片 → 打开 Polymarket 交易页面
https://polymarket.com/event/{slug}
// 或
https://polymarket.com/market/{id}
```

## 📊 性能优化

1. **服务器端 API 排序**
   - 使用 `order=endDate&ascending=true`
   - 减少客户端计算

2. **流动性预过滤**
   - 只获取 ≥ $1K 的市场
   - 减少无效数据传输

3. **组件级优化**
   - Framer Motion 延迟动画
   - 防抖搜索（300ms）
   - 虚拟滚动（未来优化）

4. **状态管理**
   - Zustand 轻量级状态管理
   - LocalStorage 持久化
   - 最小化重渲染

## 🎨 设计系统

### 颜色方案

```css
/* 紧急度颜色 */
--critical: #ef4444 (红色)
--urgent: #f97316 (橙色)
--soon: #eab308 (黄色)
--normal: #3b82f6 (蓝色)

/* 玻璃态效果 */
.glass: rgba(255, 255, 255, 0.05) + blur(10px)
.glass-strong: rgba(255, 255, 255, 0.1) + blur(20px)
```

### 动画效果

- 卡片: fade-in + slide-up (stagger 50ms)
- 紧急提醒: pulse + glow
- 筛选器: scale + glow on active
- 背景: 旋转渐变 (20s loop)

## 🔧 配置说明

### API 配置

```typescript
// lib/api.ts
const API_URL = '/api/markets';  // 通过 Next.js rewrites 代理
const MIN_LIQUIDITY = 1000;       // 最小流动性阈值
```

### Next.js Rewrites

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/markets/:path*',
      destination: 'http://localhost:3001/api/markets/:path*',
    },
  ];
}
```

## 📈 未来优化方向

### 已完成 ✅
- [x] 实时倒计时
- [x] 紧急度分级
- [x] 智能筛选
- [x] 收藏功能
- [x] 一键交易
- [x] 响应式设计
- [x] 玻璃态 UI
- [x] Framer Motion 动画

### 计划中 🚧
- [ ] 浏览器通知（即将到期提醒）
- [ ] 价格波动警报
- [ ] 历史价格图表
- [ ] 多市场对比
- [ ] 导出CSV功能
- [ ] PWA支持（离线访问）
- [ ] 深色/浅色主题切换
- [ ] 多语言支持

## 🐛 已知问题

### 修复记录

1. **✅ endDateIso 陷阱** (2025-11-06)
   - 问题: endDateIso 只包含日期，无时间
   - 修复: 改变优先级为 endDate > gameStartTime > endDateIso

2. **✅ 卡片闪烁** (2025-11-06)
   - 问题: 每秒重渲染整个卡片
   - 修复: 使用 React state 只更新倒计时数字

3. **✅ JavaScript 兼容性** (2025-11-06)
   - 问题: 简化版 HTML 缺少元素导致报错
   - 修复: 添加元素存在性检查

## 📝 开发日志

### v2.0.0 (2025-11-06)
- 🎉 完全重构为 Next.js 架构
- ✨ 全新 UI 设计（玻璃态 + 渐变）
- 🚀 Framer Motion 动画系统
- 💎 Zustand 状态管理
- ⚡ 性能大幅提升

### v1.0.0 (2025-11-06)
- 初始版本（纯 HTML/JS）
- 基础倒计时功能
- 简单的筛选器

## 🙏 致谢

- **Polymarket API**: 提供完整的市场数据
- **Next.js**: 强大的 React 框架
- **Tailwind CSS**: 快速样式开发
- **Framer Motion**: 流畅的动画效果
- **Zustand**: 轻量级状态管理

## 📄 许可证

MIT License - 自由使用和修改

---

**🚀 EventTimer Pro - 把握每一个尾盘机会！**

Made with ❤️ by Claude Code
