"""
IN V PROTECT - Desktop Application Launcher.
Starts the local FastAPI backend on 127.0.0.1, polls /health until verified,
and launches the native Windows Desktop Window using pywebview.
Manages full application lifecycle and graceful shutdown on window exit.
"""
import os
import sys
import time
import socket
import logging
import urllib.request
import json
import webbrowser

# Ensure project root is in sys.path
root_dir = os.path.abspath(os.path.dirname(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.desktop_server import DesktopServerManager, find_free_port

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("IN_V_PROTECT_Desktop")


def wait_for_health(host: str, port: int, timeout_sec: float = 12.0) -> bool:
    """Polls the /health endpoint until 'ok' or timeout expires."""
    url = f"http://{host}:{port}/health"
    start_time = time.time()
    while time.time() - start_time < timeout_sec:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "IN-V-PROTECT-Desktop-Shell"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode())
                    if data.get("status") == "ok":
                        logger.info("Health check passed: %s", data)
                        return True
        except Exception:
            time.sleep(0.15)
    return False


def main() -> None:
    print("=" * 65)
    print("      IN V PROTECT — Personal Digital Security Layer for Investors")
    print("      SANGYAN Hackathon • Track A Fraud Resilience & Track E Literacy")
    print("=" * 65)

    host = "127.0.0.1"
    # Find free port starting at 8000
    port = find_free_port(8000)
    logger.info("Starting local backend engine on http://%s:%d ...", host, port)

    # Initialize and start desktop server
    server_mgr = DesktopServerManager(host=host, port=port)
    server_mgr.start(daemon=True)

    # Poll /health until server is ready
    logger.info("Awaiting backend health validation...")
    if not wait_for_health(host, port, timeout_sec=12.0):
        logger.error("Backend health validation failed within timeout window. Aborting.")
        server_mgr.stop()
        sys.exit(1)

    app_url = f"http://{host}:{port}/"
    logger.info("Backend is healthy. Launching IN V PROTECT desktop window...")

    window_title = "IN V PROTECT — Investor Security"
    gui_launched = False

    try:
        import webview

        # Configure window icon if exists
        icon_path = os.path.join(root_dir, "frontend", "public", "logo.png")
        if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
            bundled_icon = os.path.join(sys._MEIPASS, "frontend", "public", "logo.png")
            if os.path.exists(bundled_icon):
                icon_path = bundled_icon

        window = webview.create_window(
            title=window_title,
            url=app_url,
            width=1280,
            height=840,
            min_size=(960, 640),
            background_color="#08080B",
            text_select=True,
            zoomable=True,
        )

        logger.info("Opening native desktop GUI window...")
        gui_launched = True
        webview.start(debug=False)

    except Exception as e:
        logger.warning("pywebview window unavailable or failed (%s). Falling back to browser view.", e)
        webbrowser.open(app_url)
        print(f"\n[+] IN V PROTECT is active at: {app_url}")
        print("Press Ctrl+C to terminate application and shutdown backend.\n")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass

    finally:
        logger.info("Application window closed. Performing graceful shutdown...")
        server_mgr.stop()
        logger.info("IN V PROTECT backend stopped. Goodbye.")


if __name__ == "__main__":
    main()
