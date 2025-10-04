import urllib.request
import sys
import os

HOST = os.getenv("HEALTHCHECK_HOST", "localhost")
PORT = os.getenv("HEALTHCHECK_PORT", "8000")
PATH = os.getenv("HEALTHCHECK_PATH", "/health")
URL = f"http://{HOST}:{PORT}{PATH}"

try:
    with urllib.request.urlopen(URL, timeout=5) as response:
        if response.getcode() == 200:
            print(f"Health check successful: {URL} returned 200 OK.")
            sys.exit(0)
        else:
            print(f"Health check failed: {URL} returned status code {response.getcode()}.")
            sys.exit(1)
except Exception as e:
    print(f"Health check failed to connect to {URL}: {e}")
    sys.exit(1)