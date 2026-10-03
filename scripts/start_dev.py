"""
Sangyan AI Investor Shield - Unified Development Server Launcher.
Starts the FastAPI Backend and Vite Frontend concurrently with real-time logs.
"""
import os
import subprocess
import sys
import time

if sys.platform == "win32":
    try:
        reconfig_out = getattr(sys.stdout, "reconfigure", None)
        if callable(reconfig_out):
            reconfig_out(encoding="utf-8")
    except Exception:
        pass
    try:
        reconfig_err = getattr(sys.stderr, "reconfigure", None)
        if callable(reconfig_err):
            reconfig_err(encoding="utf-8")
    except Exception:
        pass



def main() -> None:
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=============================================================")
    print("        SANGYAN AI - INVESTOR SHIELD LAUNCHER                ")
    print("=============================================================")
    print(f"[*] Workspace Root: {root_dir}")
    print("[*] Starting FastAPI Backend on http://127.0.0.1:8000 ...")

    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=root_dir,
    )

    time.sleep(2)
    print("[*] Starting Vite Frontend on http://127.0.0.1:5173 ...")

    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True,
    )

    print("\n[+] Sangyan AI Investor Shield is LIVE:")
    print("    - Web Application: http://localhost:5173")
    print("    - Interactive API Docs: http://127.0.0.1:8000/docs")
    print("    - Health Check: http://127.0.0.1:8000/api/health")
    print("\nPress Ctrl+C to terminate both servers.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n[*] Stopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("[+] Servers stopped gracefully.")

if __name__ == "__main__":
    main()
