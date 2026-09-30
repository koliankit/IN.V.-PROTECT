"""
Monorepo Python Lint & Syntax Verification Script.
Recursively inspects all Python files using standard library `ast` and `py_compile`
to guarantee zero syntax errors and valid module structure across the project.
"""
import ast
import os
import py_compile
import sys


def check_python_files(root_dir: str) -> bool:
    all_clean = True
    py_files_checked = 0

    ignore_dirs = {".git", ".venv", "venv", "__pycache__", "data", "node_modules"}

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        for f in filenames:
            if f.endswith(".py"):
                file_path = os.path.join(dirpath, f)
                py_files_checked += 1
                rel_path = os.path.relpath(file_path, root_dir)

                # 1. Byte-compile check
                try:
                    py_compile.compile(file_path, doraise=True)
                except py_compile.PyCompileError as e:
                    print(f"[FAIL] Compile error in {rel_path}: {e}")
                    all_clean = False
                    continue

                # 2. AST parsing check
                try:
                    with open(file_path, "r", encoding="utf-8") as py_file:
                        ast.parse(py_file.read(), filename=rel_path)
                except SyntaxError as e:
                    print(f"[FAIL] Syntax error in {rel_path}: {e}")
                    all_clean = False
                    continue

    print(f"Lint check complete: {py_files_checked} Python files scanned. All clean: {all_clean}")
    return all_clean


if __name__ == "__main__":
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    success = check_python_files(repo_root)
    sys.exit(0 if success else 1)
