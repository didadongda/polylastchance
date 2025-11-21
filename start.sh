#!/bin/bash

# EventTimer Pro - Quick Start Script

echo "🎉 EventTimer Pro - Apple Style Dashboard"
echo "=========================================="
echo ""

# Check if proxy server is running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Proxy server is running on port 3001"
else
    echo "🚀 Starting proxy server..."
    node proxy-server.js > /dev/null 2>&1 &
    sleep 2
    echo "✅ Proxy server started on port 3001"
fi

# Check if web server is running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Web server is running on port 8000"
else
    echo "🚀 Starting web server..."
    python3 -m http.server 8000 > /dev/null 2>&1 &
    sleep 2
    echo "✅ Web server started on port 8000"
fi

echo ""
echo "=========================================="
echo "🎊 All services are ready!"
echo ""
echo "📍 Dashboard: http://localhost:8000/dashboard.html"
echo "📍 Old Version: http://localhost:8000/index.html"
echo ""
echo "💡 Tips:"
echo "  - Use the new Dashboard for better experience"
echo "  - Click ⭐ to favorite markets"
echo "  - Use 🔍 search bar to find markets"
echo "  - Click 📥 Export to download data"
echo ""
echo "🛑 To stop servers:"
echo "  - Press Ctrl+C"
echo "  - Or run: pkill -f 'python.*http.server' && pkill -f 'node.*proxy'"
echo "=========================================="
echo ""

# Open browser
open http://localhost:8000/dashboard.html

echo "🌐 Browser opened automatically"
echo "⏳ Waiting for you to close this terminal..."
echo ""

# Keep script running
wait
