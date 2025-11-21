#!/usr/bin/env python3
"""
Test Polymarket Subgraph GraphQL API
正确的查询方法，使用 condition.endTime 字段
"""

import requests
import json
from datetime import datetime, timezone

SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/polymarket/matic-markets"

# GraphQL query - 使用 condition 的时间字段
query = """
{
  markets(
    first: 50
    orderBy: volume
    orderDirection: desc
    where: { closed: false }
  ) {
    id
    question
    endDate
    closed
    active
    condition {
      id
      resolutionTime
    }
    outcomes
  }
}
"""

def main():
    print("=" * 80)
    print("测试 Polymarket Subgraph GraphQL API")
    print("=" * 80)

    response = requests.post(
        SUBGRAPH_URL,
        json={"query": query},
        headers={"Content-Type": "application/json"}
    )

    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}")
        print(response.text)
        return

    data = response.json()

    if "errors" in data:
        print("GraphQL Errors:")
        print(json.dumps(data["errors"], indent=2))
        return

    markets = data.get("data", {}).get("markets", [])
    print(f"\n返回市场数: {len(markets)}")

    if len(markets) == 0:
        print("没有返回市场数据")
        return

    # 提取时间字段并排序
    now = datetime.now(timezone.utc)
    markets_with_time = []

    for m in markets:
        # 尝试多个时间字段
        end_time = None
        time_source = "unknown"

        # 1. 优先使用 condition.resolutionTime
        if m.get("condition") and m["condition"].get("resolutionTime"):
            try:
                end_time = datetime.fromtimestamp(int(m["condition"]["resolutionTime"]), tz=timezone.utc)
                time_source = "condition.resolutionTime"
            except:
                pass

        # 2. 其次使用 endDate
        if not end_time and m.get("endDate"):
            try:
                end_time = datetime.fromisoformat(m["endDate"].replace("Z", "+00:00"))
                time_source = "endDate"
            except:
                pass

        if end_time and end_time > now:
            hours_left = (end_time - now).total_seconds() / 3600
            markets_with_time.append({
                "market": m,
                "end_time": end_time,
                "hours_left": hours_left,
                "time_source": time_source
            })

    # 按剩余时间排序
    markets_with_time.sort(key=lambda x: x["hours_left"])

    print(f"\n活跃市场（未过期）: {len(markets_with_time)}")

    # 统计分布
    within_24h = sum(1 for m in markets_with_time if m["hours_left"] <= 24)
    within_3d = sum(1 for m in markets_with_time if m["hours_left"] <= 72)
    within_7d = sum(1 for m in markets_with_time if m["hours_left"] <= 168)

    print(f"\n时间分布:")
    print(f"  24小时内: {within_24h}")
    print(f"  3天内:    {within_3d}")
    print(f"  7天内:    {within_7d}")

    print(f"\n最近到期的20个市场:")
    print("-" * 80)

    for i, item in enumerate(markets_with_time[:20]):
        m = item["market"]
        days = item["hours_left"] / 24
        end_str = item["end_time"].strftime("%Y-%m-%d %H:%M UTC")
        question = m["question"][:60]
        source = item["time_source"]

        print(f"{i+1}. {days:.1f}天 ({item['hours_left']:.0f}h) | {end_str} | [{source}] {question}")

    print("=" * 80)

if __name__ == "__main__":
    main()
