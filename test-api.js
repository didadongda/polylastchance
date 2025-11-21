// Quick test script to check API response
const https = require('https');

const now = new Date();
const nowISO = now.toISOString();

const url = `https://gamma-api.polymarket.com/markets?closed=false&end_date_min=${encodeURIComponent(nowISO)}&order=endDate&ascending=true&limit=30`;

console.log('Testing API:', url);
console.log('Current time:', nowISO);
console.log('---');

https.get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
    let data = '';

    res.on('data', chunk => data += chunk);

    res.on('end', () => {
        try {
            const markets = JSON.parse(data);
            console.log(`\nReceived ${markets.length} markets\n`);

            markets.slice(0, 10).forEach((market, i) => {
                console.log(`Market ${i + 1}: ${market.question.substring(0, 60)}...`);
                console.log(`  endDate: ${market.endDate}`);
                console.log(`  endDateIso: ${market.endDateIso}`);
                console.log(`  gameStartTime: ${market.gameStartTime}`);

                // Calculate hours until (use correct priority)
                const deadline = market.endDate || market.gameStartTime || market.endDateIso;
                if (deadline) {
                    const hoursUntil = (new Date(deadline) - now) / (1000 * 60 * 60);
                    console.log(`  ⏰ Hours until: ${hoursUntil.toFixed(2)}h`);
                }
                console.log('');
            });
        } catch (e) {
            console.error('Parse error:', e);
            console.log('Raw data:', data.substring(0, 500));
        }
    });
}).on('error', err => {
    console.error('Request error:', err);
});
