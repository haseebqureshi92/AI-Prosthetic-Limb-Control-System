import http.server
import socketserver
import os

PORT = 5173
DIRECTORY = "D:\\AI Posthetic Limb Control System\\dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Frontend server running at http://localhost:" + str(PORT))
    print("Serving files from: " + DIRECTORY)
    print("Open your browser to: http://localhost:" + str(PORT) + "/")
    httpd.serve_forever()