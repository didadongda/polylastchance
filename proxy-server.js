// Simple CORS proxy server - Updated to support all query parameters
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;
const POLYMARKET_API = 'https://gamma-api.polymarket.com';

const server = http.createServer((req, res) => {
    // Enable CORS with Cache-Control support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url.startsWith('/api/')) {
        // Preserve all query parameters
        const apiPath = req.url.replace('/api', '');
        const targetUrl = POLYMARKET_API + apiPath;

        console.log('Proxying request to:', targetUrl);

        // Forward request with Cache-Control header
        const options = {
            headers: {
                'Cache-Control': 'no-cache'
            }
        };

        https.get(targetUrl, options, (apiRes) => {
            res.writeHead(apiRes.statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
            });
            apiRes.pipe(res);
        }).on('error', (err) => {
            console.error('Proxy error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Proxy error' }));
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 CORS Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Proxying requests to ${POLYMARKET_API}`);
    console.log(`\n💡 Example: http://localhost:${PORT}/api/markets?closed=false&order=endDate&ascending=true&limit=50`);
});
