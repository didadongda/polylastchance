# ⏰ PolyLastChance - Polymarket 事件节奏表

一个现代化的 Polymarket 市场倒计时追踪工具，帮助交易者把握最佳时机。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

## ✨ 核心特性

### 🎯 实时追踪
- **实时倒计时**: 精确到秒的市场到期倒计时
- **可视化进度**: 直观的进度条显示市场进度
- **智能分类**: 自动标记紧急（24h内）、即将到期（7天内）市场

### 🔍 强大搜索
- **全文搜索**: 支持市场名称、分类、关键词搜索
- **实时过滤**: 输入即搜，无需等待
- **多维度筛选**: 按时间、交易量、流动性排序

### 📊 数据可视化
- **统计面板**: 实时显示活跃市场、紧急市场数量
- **价格展示**: 显示当前价格和交易量
- **趋势分析**: 进度条显示市场生命周期

### 🎨 优秀体验
- **现代化 UI**: 深色主题，护眼舒适
- **响应式设计**: 完美适配移动端和桌面端
- **流畅动画**: 精心设计的过渡效果
- **零延迟**: 纯前端实现，瞬间响应

## 🚀 快速开始

### 方法 1: 直接使用（最简单）

```bash
# 克隆或下载项目
cd event-timer

# 直接在浏览器中打开
open index.html
```

### 方法 2: 本地服务器

```bash
# 使用 Python
python3 -m http.server 8000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:8000

# 然后访问
http://localhost:8000
```

## 📦 项目结构

```
event-timer/
├── index.html              # 主页面
├── app.js                  # 核心逻辑
├── test-api.html           # API 测试页面
├── README.md               # 项目文档
└── FEASIBILITY_REPORT.md   # 技术可行性报告
```

## 💡 功能说明

### 仪表盘统计
- **活跃市场**: 当前所有未到期的活跃市场数量
- **24小时内**: 即将在 24 小时内到期的紧急市场
- **7天内到期**: 一周内到期的市场，适合中期交易
- **API 响应**: 显示 API 连接状态和响应时间

### 筛选功能
- **🌐 全部**: 显示所有活跃市场
- **🔥 24小时内**: 仅显示紧急市场（红色标记）
- **⚡ 7天内**: 显示本周即将到期的市场（橙色标记）
- **📅 本周**: 显示本周日前到期的市场

### 排序选项
- **⏰ 最快到期**: 按到期时间升序（默认）
- **⏳ 最晚到期**: 按到期时间降序
- **📊 交易量**: 按交易量降序
- **💧 流动性**: 按流动性降序

### 搜索功能
- 支持模糊搜索
- 搜索范围：市场标题、分类、描述
- 实时搜索（300ms 防抖）
- 显示搜索结果数量

## 🎨 UI 设计亮点

### 颜色系统
```css
紫色主题: #6366f1 (primary)
次要色: #8b5cf6 (secondary)
成功色: #10b981 (正常市场)
警告色: #f59e0b (即将到期)
危险色: #ef4444 (紧急市场)
```

### 响应式断点
- 桌面端: > 1024px
- 平板: 768px - 1024px
- 移动端: < 768px

### 动画效果
- 卡片悬停效果
- 渐入动画
- 进度条动画
- 脉冲提示

## 📊 数据源

### Polymarket Gamma API
- **端点**: `https://gamma-api.polymarket.com/markets`
- **费用**: 完全免费
- **限制**: 无严格 rate limit
- **更新频率**: 2 分钟自动刷新

### 数据字段
```javascript
{
  question: "市场标题",
  endDate: "到期时间 (UTC)",
  startDate: "开始时间",
  volume: "交易量",
  liquidity: "流动性",
  category: "分类",
  outcomePrices: ["Yes价格", "No价格"],
  slug: "市场标识"
}
```

## ⚙️ 配置选项

在 `app.js` 中修改：

```javascript
const API_CONFIG = {
    BASE_URL: 'https://gamma-api.polymarket.com/markets',
    REFRESH_INTERVAL: 120000,  // 刷新间隔 (ms)
    MAX_MARKETS: 150           // 最大市场数
};
```

## 🌐 部署到生产环境

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### Netlify

```bash
# 拖拽文件夹到 netlify.com
# 或使用 CLI
netlify deploy --prod
```

### GitHub Pages

```bash
# 1. 创建 GitHub 仓库
# 2. 推送代码
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main

# 3. 在 Settings > Pages 中启用
# 4. 选择 main 分支
```

### Cloudflare Pages

```bash
# 1. 登录 Cloudflare Dashboard
# 2. Pages > Create a project
# 3. 连接 GitHub 仓库
# 4. 自动部署
```

## 🔧 自定义与扩展

### 修改主题色

在 `index.html` 的 `:root` 中修改：

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... */
}
```

### 添加新的筛选器

在 `app.js` 的 `filterMarkets` 函数中添加：

```javascript
case 'your-filter':
    return /* your logic */;
```

### 自定义排序

在 `sortMarkets` 函数中添加新的排序逻辑：

```javascript
case 'your-sort':
    return sorted.sort(/* your logic */);
```

## 📱 移动端优化

- 触摸友好的按钮尺寸
- 响应式网格布局
- 优化的文字大小
- 滑动友好的筛选器

## ⚡ 性能优化

- **防抖搜索**: 300ms 防抖，避免频繁渲染
- **智能更新**: 仅在必要时重新渲染
- **渐进加载**: 首屏快速显示
- **缓存策略**: LocalStorage 可选（未来实现）

## 🔒 隐私与安全

- ✅ 无服务器端
- ✅ 无用户追踪
- ✅ 无 Cookie
- ✅ 无数据收集
- ✅ 纯前端运行

## 📈 使用场景

### 1. 尾盘交易
- 筛选"24小时内"市场
- 关注价格极端（<10% 或 >90%）
- 把握反转机会

### 2. 撤单提醒
- 监控持仓市场的到期时间
- 提前 24 小时准备
- 避免意外到期

### 3. 套利机会
- 按交易量排序
- 查找高流动性市场
- 快速进出

### 4. 研究分析
- 按分类筛选
- 研究市场趋势
- 数据导出（计划中）

## 🛠️ 技术栈

- **前端**: Vanilla JavaScript (ES6+)
- **样式**: CSS3 + CSS Variables
- **API**: Polymarket Gamma API
- **部署**: Vercel / Netlify / GitHub Pages

### 为什么选择 Vanilla JS？
- 零依赖，加载速度快
- 易于维护和修改
- 完全控制代码
- 适合单页应用

## 🐛 已知问题

- [ ] 某些市场可能缺少 `endDate`（已过滤）
- [ ] API 偶尔响应较慢（已添加重试）
- [ ] 价格数据可能有延迟（API 限制）

## 🗺️ 开发路线图

### v1.1 (计划中)
- [ ] 收藏功能（LocalStorage）
- [ ] 价格变化提醒
- [ ] 数据导出（CSV/JSON）
- [ ] 暗色/亮色主题切换

### v1.2 (计划中)
- [ ] Web Push 通知
- [ ] 历史市场记录
- [ ] 价格走势图表
- [ ] 多时区支持

### v2.0 (规划中)
- [ ] 账户连接
- [ ] 持仓显示
- [ ] 自动提醒系统
- [ ] 移动端 App

## 💬 反馈与贡献

欢迎提交 Issue 和 Pull Request！

### 报告问题
- 描述问题现象
- 提供截图
- 说明浏览器版本

### 功能建议
- 描述使用场景
- 说明预期行为
- 提供参考案例

## 📄 许可证

MIT License - 自由使用，修改，分发

## 👏 致谢

- Polymarket 提供的开放 API
- 所有贡献者和用户

## 📞 联系方式

- 问题反馈: [GitHub Issues]
- 功能建议: [GitHub Discussions]

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

Made with ❤️ for Polymarket Traders
