# Render Deployment Guide: Sangyan AI Investor Shield

This document describes how to deploy the repository onto [Render](https://render.com) using the split architecture:
- **Frontend (`frontend/`)**: Render Static Site (React + Vite SPA)
- **Backend (`backend/`)**: Render Web Service (FastAPI Engine)

```
GitHub Repository
       │
       ├── frontend/  ──────► Render Static Site (React + Vite)
       │
       └── backend/   ──────► Render Web Service (FastAPI)
                                      │
                                      ▼
                              FastAPI Engine
```

---

## Method 1: Automated Blueprint Deployment (Recommended)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint file at the root.

1. Push this repository to your GitHub account.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically parse [`render.yaml`](../render.yaml) and discover both services:
   - `sangyan-ai-backend` (Web Service)
   - `sangyan-ai-frontend` (Static Site)
5. Click **Apply**. Render will provision and deploy both services simultaneously.
6. Once deployed, if you customize the backend service name or use a custom domain, update `VITE_API_URL` under the Frontend environment settings to match your backend URL (e.g., `https://<your-backend-name>.onrender.com`).

---

## Method 2: Manual Dashboard Setup

If you prefer configuring services individually in the Render Dashboard, follow these steps:

### 1. Deploy the Backend (Render Web Service)

1. Go to **Render Dashboard** ➔ **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `sangyan-ai-backend` (or your choice)
   - **Region**: Singapore (`singapore`) or closest region
   - **Branch**: `main`
   - **Root Directory**: Leave blank (repository root) or `.`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. Add Environment Variables:
   - `PYTHON_VERSION`: `3.11.9`
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: `*` (or your static site URL)
   - `SECRET_KEY`: (Click *Generate* for a secure random string)
5. Under **Advanced**:
   - **Health Check Path**: `/api/health`
6. Click **Create Web Service**. Wait for the build and deployment to complete.
7. Copy your backend URL (e.g. `https://sangyan-ai-backend.onrender.com`).

### 2. Deploy the Frontend (Render Static Site)

1. Go to **Render Dashboard** ➔ **New +** ➔ **Static Site**.
2. Connect the same GitHub repository.
3. Configure the following settings:
   - **Name**: `sangyan-ai-frontend` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: Paste your backend URL from Step 1 (e.g., `https://sangyan-ai-backend.onrender.com`).
5. Under **Redirects/Rewrites**:
   - Add a rewrite rule for Single Page Application (SPA) routing:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## How Cross-Service Communication Works

1. **Frontend (`frontend/src/apiConfig.ts`)**:
   - In local development (`npm run dev`), `VITE_API_URL` is empty, so requests default to relative paths `/api/...` routed via Vite's dev proxy to `http://127.0.0.1:8000`.
   - In Render production, the build injects `VITE_API_URL`. The global fetch router automatically prepends the backend URL to all `/api`, `/auth`, `/devices`, and `/health` requests.

2. **Backend CORS Middleware (`backend/main.py`)**:
   - Allows credentialed requests from the Render Static Site domain while reflecting the requesting origin.
   - Accepts custom allowed origins via the `CORS_ORIGINS` environment variable.

3. **Port & Process Binding**:
   - Render dynamically provides the `$PORT` environment variable.
   - `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` binds properly to all network interfaces.

---

## Verification & Health Check

After deployment:
- Verify Backend: Open `https://<your-backend>.onrender.com/api/health` in your browser.
  Expected response: `{"status":"healthy","service":"in-v-protect","version":"1.0.0",...}`
- Verify Interactive Swagger API Docs: Open `https://<your-backend>.onrender.com/docs`.
- Verify Frontend: Open `https://<your-frontend>.onrender.com/`. Verify that scam analysis, entity verification, and live demo flows execute properly against the backend service.
