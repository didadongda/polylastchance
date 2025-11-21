#!/usr/bin/env python3
import requests
from datetime import datetime, timezone

# 使用 active/closed 过滤，但用时间验证
url = "https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100"
resp = requests.get(url)
data = resp.json()

now = datetime.now(timezone.utc)

print(f"返回记录数: {len(data)}\n")

active_count = 0
for i, m in enumerate(data[:30]):
    q = m.get("question", "")[:55]
    print(f"{i+1}. {q}")

    # 提取时间
    times = []

    if m.get("endDate"):
        try:
            dt = datetime.fromisoformat(m["endDate"].replace("Z", "+00:00"))
            hours = (dt - now).total_seconds() / 3600
            days = hours / 24
            times.append(("market", dt, days))
        except Exception as e:
            pass

    if m.get("events"):
        for evt in m["events"]:
            if evt.get("endDate"):
                try:
                    dt = datetime.fromisoformat(evt["endDate"].replace("Z", "+00:00"))
                    hours = (dt - now).total_seconds() / 3600
                    days = hours / 24
                    times.append(("event", dt, days))
                except:
                    pass

    if times:
        times.sort(key=lambda x: x[1])
        source, dt, days = times[0]
        if days > 0:
            status = "✅"
            active_count += 1
        else:
            status = "❌过期"
        print(f"   {status} {days:.1f}天 - {dt.strftime('%m-%d %H:%M')}")
    else:
        print(f"   ⚠️ 无时间字段")
print(f"\n实际活跃（未过期）: {active_count}/{len(data[:30])}")
