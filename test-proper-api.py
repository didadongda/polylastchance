#!/usr/bin/env python3
"""
正确的 Polymarket API 查询方法
按照用户指出的正确做法：
1. 分页获取全量数据
2. 检查多个时间字段（market.endDate, events[].endDate）
3. 不依赖 active/closed 字段
4. 添加缓存破坏
5. 客户端排序
"""

import requests
import time
from datetime import datetime, timezone

API_BASE = "http://localhost:3001/api/markets"

def fetch_all_markets_paginated(max_pages=10):
    """
    分页获取市场数据
    """
    all_markets = []
    page_size = 500

    for page in range(max_pages):
        offset = page * page_size
        # 添加时间戳防止缓存
        cache_buster = int(time.time() * 1000)
        url = f"{API_BASE}?limit={page_size}&offset={offset}&_ts={cache_buster}"

        print(f"正在获取第 {page+1} 页（offset={offset})...")

        try:
            response = requests.get(url, headers={"Cache-Control": "no-cache"})
            if response.status_code != 200:
                print(f"HTTP {response.status_code} - 停止分页")
                break

            page_data = response.json()

            if not page_data or len(page_data) == 0:
                print(f"第 {page+1} 页无数据，停止")
                break

            all_markets.extend(page_data)
            print(f"  获取 {len(page_data)} 个市场，累计 {len(all_markets)}")

            # 如果返回数量小于page_size，说明没有更多数据
            if len(page_data) < page_size:
                print(f"已获取所有数据")
                break

        except Exception as e:
            print(f"请求失败: {e}")
            break

    return all_markets

def extract_deadline(market):
    """
    提取市场的真实截止时间
    优先级：events[].endDate > market.endDate
    """
    deadlines = []

    # 1. 检查 events 数组
    if market.get("events") and isinstance(market["events"], list):
        for event in market["events"]:
            if event.get("endDate"):
                try:
                    dt = datetime.fromisoformat(event["endDate"].replace("Z", "+00:00"))
                    deadlines.append(("event.endDate", dt))
                except:
                    pass

    # 2. 检查 market.endDate
    if market.get("endDate"):
        try:
            dt = datetime.fromisoformat(market["endDate"].replace("Z", "+00:00"))
            deadlines.append(("market.endDate", dt))
        except:
            pass

    # 返回最早的截止时间（如果有多个）
    if deadlines:
        deadlines.sort(key=lambda x: x[1])
        return deadlines[0]  # (source, datetime)

    return None

def analyze_markets():
    print("="*80)
    print("Polymarket API 正确查询方法测试")
    print("="*80)
    print()

    # Step 1: 分页获取全量数据
    print("Step 1: 分页获取全量市场数据")
    print("-"*80)
    all_markets = fetch_all_markets_paginated(max_pages=5)
    print(f"\n总共获取: {len(all_markets)} 个市场")
    print()

    # Step 2: 提取时间字段，不依赖 active/closed
    print("Step 2: 提取真实截止时间（不依赖 active/closed）")
    print("-"*80)
    now = datetime.now(timezone.utc)
    markets_with_deadline = []
    no_deadline_count = 0

    for market in all_markets:
        deadline_info = extract_deadline(market)
        if deadline_info:
            source, deadline = deadline_info
            # 只保留未过期的
            if deadline > now:
                hours_left = (deadline - now).total_seconds() / 3600
                markets_with_deadline.append({
                    "id": market.get("id"),
                    "question": market.get("question", "")[:70],
                    "deadline": deadline,
                    "hours_left": hours_left,
                    "source": source,
                    "volume": float(market.get("volume", 0)),
                    "active": market.get("active"),
                    "closed": market.get("closed")
                })
        else:
            no_deadline_count += 1

    print(f"有时间字段且未过期: {len(markets_with_deadline)} 个")
    print(f"无时间字段或已过期: {no_deadline_count} 个")
    print()

    # Step 3: 客户端排序
    print("Step 3: 按截止时间排序（最近的在前）")
    print("-"*80)
    markets_with_deadline.sort(key=lambda x: x["hours_left"])

    # 统计分布
    within_24h = [m for m in markets_with_deadline if m["hours_left"] <= 24]
    within_3d = [m for m in markets_with_deadline if m["hours_left"] <= 72]
    within_7d = [m for m in markets_with_deadline if m["hours_left"] <= 168]

    print(f"\n时间分布:")
    print(f"  24小时内:  {len(within_24h)} 个")
    print(f"  3天内:     {len(within_3d)} 个")
    print(f"  7天内:     {len(within_7d)} 个")
    print(f"  总活跃:    {len(markets_with_deadline)} 个")
    print()

    # Step 4: 展示最近到期的市场
    print("Step 4: 最近到期的30个市场")
    print("-"*80)
    print(f"{'序号':<4} {'剩余时间':<15} {'截止时间 (UTC)':<20} {'来源':<18} {'市场标题'}")
    print("-"*80)

    for i, m in enumerate(markets_with_deadline[:30]):
        days = m["hours_left"] / 24
        end_str = m["deadline"].strftime("%Y-%m-%d %H:%M")

        if days < 1:
            time_str = f"{m['hours_left']:.1f}小时"
        else:
            time_str = f"{days:.1f}天"

        print(f"{i+1:<4} {time_str:<15} {end_str:<20} {m['source']:<18} {m['question']}")

    print("="*80)

    # 返回结果供后续使用
    return {
        "total": len(all_markets),
        "active": len(markets_with_deadline),
        "within_24h": len(within_24h),
        "within_3d": len(within_3d),
        "within_7d": len(within_7d),
        "markets": markets_with_deadline[:50]  # 返回前50个
    }

if __name__ == "__main__":
    result = analyze_markets()

    print("\n总结:")
    print(f"- 原始数据: {result['total']} 个市场")
    print(f"- 活跃市场: {result['active']} 个")
    print(f"- 24小时内: {result['within_24h']} 个")
    print(f"- 3天内: {result['within_3d']} 个")
    print(f"- 7天内: {result['within_7d']} 个")
