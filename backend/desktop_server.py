"""
IN V PROTECT - Desktop Server Entry Point.
Starts the FastAPI application bound strictly to localhost (127.0.0.1)
with configurable/dynamic port, health endpoint polling support,
and graceful shutdown.
"""
import os
import sys
import socket
import logging
import threading
import uvicorn

# Ensure project root is in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.main import app

logger = logging.getLogger("inv_protect.desktop_server")


def find_free_port(preferred_port: int = 8000) -> int:
    """Checks if preferred_port is available; if not, selects an open port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", preferred_port))
            return preferred_port
        except OSError:
            pass

    # Pick any open port assigned by OS
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class DesktopServerManager:
    """Manages the lifecycle of the local desktop FastAPI server."""

    def __init__(self, host: str = "127.0.0.1", port: int = 8000):
        self.host = host
        self.port = port
        self.server: uvicorn.Server = None
        self.thread: threading.Thread = None
        self._is_running = False

    def start(self, daemon: bool = True) -> int:
        """Starts uvicorn server in a background thread."""
        config = uvicorn.Config(
            app=app,
            host=self.host,
            port=self.port,
            log_level="warning",  # Clean production logging
            access_log=False,
            reload=False,         # No debug reloader in desktop packaging
            lifespan="on",
        )
        self.server = uvicorn.Server(config)
        self.thread = threading.Thread(target=self.server.run, daemon=daemon)
        self.thread.start()
        self._is_running = True
        return self.port

    def stop(self) -> None:
        """Gracefully signals the server to terminate and joins thread."""
        if self.server:
            self.server.should_exit = True
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=3.0)
        self._is_running = False


def run_standalone():
    """CLI runner when invoked directly."""
    import argparse
    parser = argparse.ArgumentParser(description="IN V PROTECT Desktop Server")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host (default: 127.0.0.1)")
    args = parser.parse_args()

    port = find_free_port(args.port)
    print(f"[*] Starting IN V PROTECT Desktop Server on http://{args.host}:{port}")
    config = uvicorn.Config(app=app, host=args.host, port=port, log_level="info")
    server = uvicorn.Server(config)
    server.run()


if __name__ == "__main__":
    run_standalone()
