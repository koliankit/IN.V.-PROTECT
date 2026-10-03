# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller Configuration Specification for IN V PROTECT.
Desktop Application for SANGYAN Hackathon (Track A + Track E).
"""
import os
import sys

block_cipher = None
project_root = os.path.abspath(SPECPATH)

datas = [
    (os.path.join(project_root, 'frontend', 'dist'), os.path.join('frontend', 'dist')),
    (os.path.join(project_root, 'frontend', 'public'), os.path.join('frontend', 'public')),
    (os.path.join(project_root, 'ml', 'models'), os.path.join('ml', 'models')),
    (os.path.join(project_root, 'data', 'official'), os.path.join('data', 'official')),
    (os.path.join(project_root, 'data', 'manifests'), os.path.join('data', 'manifests')),
    (os.path.join(project_root, 'backend', 'db', 'schema.sql'), os.path.join('backend', 'db')),
    (os.path.join(project_root, 'backend', 'db', 'auth_schema.sql'), os.path.join('backend', 'db')),
    (os.path.join(project_root, 'data', 'knowledge_base.db'), 'data'),
    (os.path.join(project_root, 'data', 'sangyan_auth.db'), 'data'),
]

hiddenimports = [
    'uvicorn',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespans',
    'uvicorn.lifespans.on',
    'email_validator',
    'fastapi',
    'starlette',
    'starlette.responses',
    'starlette.staticfiles',
    'pydantic',
    'pydantic_settings',
    'sklearn',
    'sklearn.utils._typedefs',
    'sklearn.neighbors._typedefs',
    'sklearn.tree._utils',
    'pytesseract',
    'PIL',
    'PIL.Image',
    'webview',
    'clr_loader',
    'pythonnet',
]

a = Analysis(
    [os.path.join(project_root, 'desktop_app.py')],
    pathex=[project_root],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'matplotlib',
        'pytest',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

icon_path = os.path.join(project_root, 'frontend', 'public', 'app.ico')
if not os.path.exists(icon_path):
    icon_path = None

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='IN V PROTECT',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=icon_path,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='IN V PROTECT',
)
