#!/bin/bash

echo "🚀 Starting EventTimer Pro..."
echo ""

# Check if proxy server is running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Proxy server already running on port 3001"
else
    echo "🔄 Starting proxy server..."
    cd ..
    node proxy-server.js > /tmp/proxy.log 2>&1 &
    echo "✅ Proxy server started on port 3001"
fi

echo ""
echo "🎨 Starting Next.js development server..."
echo "📱 App will be available at: http://localhost:3002"
echo ""

npm run dev
