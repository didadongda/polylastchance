#!/usr/bin/env python3
"""
Simple CORS Proxy Server for Polymarket API
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import json

POLYMARKET_API = 'https://gamma-api.polymarket.com'
PORT = 3001

class ProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            # Remove /api prefix and construct target URL
            api_path = self.path.replace('/api', '')
            target_url = f'{POLYMARKET_API}{api_path}'

            try:
                print(f'Proxying request to: {target_url}')

                # Make request to Polymarket API
                with urllib.request.urlopen(target_url) as response:
                    data = response.read()

                    # Send response with CORS headers
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    self.wfile.write(data)

            except Exception as e:
                print(f'Error: {e}')
                self.send_error(500, str(e))
        else:
            self.send_error(404, 'Not Found')

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        # Custom logging
        print(f'{self.address_string()} - {format % args}')

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ProxyHandler)

    print(f'🚀 CORS Proxy Server running on http://localhost:{PORT}')
    print(f'📡 Proxying requests to {POLYMARKET_API}')
    print(f'\n💡 Use: http://localhost:{PORT}/api/markets?active=true\n')

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n\n⏹️  Server stopped')
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
