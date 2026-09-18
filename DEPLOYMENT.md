# ORCA Monorepo Deployment Guide

This guide details the step-by-step procedure for deploying the **ORCA Marine Intelligence Platform** monorepo to production.

---

## 1. Architecture Overview

```
                        +----------------------------+
                        |   Vercel (Frontend App)    |
                        |   Next.js (App Router)     |
                        +--------------+-------------+
                                       |
                                       | HTTP / REST API
                                       v
                        +----------------------------+
                        |  Render / Railway (Backend)|
                        |  Express + LangGraph Node  |
                        +----------------------------+
```

* **Frontend**: Next.js App Router deployed on **Vercel**.
* **Backend**: Express + LangGraph Multi-Agent Server deployed on **Render** or **Railway**.
* **Shared Package**: `@orca/shared` (TypeScript type definitions) automatically built prior to both frontend and backend compilation.

---

## 2. Monorepo Build Scripts

Root `package.json` includes pre-configured monorepo build commands:

* `npm run build:shared`: Compiles `packages/shared` TypeScript types.
* `npm run build:backend`: Compiles `@orca/shared` first, then builds `backend/src` via `tsc`.
* `npm run build:frontend`: Compiles `@orca/shared` first, then runs `next build` inside `frontend/`.
* `npm run build`: Compiles all packages (shared, backend, and frontend).

---

## 3. Step 1: Deploying Backend (Render / Railway)

### Option A: Render (Automated via `render.yaml`)

1. Connect your GitHub repository to **Render**.
2. Render will automatically detect the root [`render.yaml`](file:///c:/Users/silverfang/Desktop/orca/ORCA/render.yaml) blueprint.
3. Configure the following **Environment Variables** in the Render Dashboard:

| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `PORT` | HTTP Listening Port | `10000` (Render default) |
| `GROQ_API_KEY` | Groq Cloud LLM API Key for LangGraph agents | `gsk_...` **(Required)** |
| `BHASHINI_API_KEY` | Bhashini Multilingual Translation API Key | `bhash_...` *(Optional fallback)* |
| `CORS_ORIGIN` | Allowed origin for frontend requests | `https://your-app.vercel.app` |

4. Render Configuration Summary:
   * **Root Directory**: `.`
   * **Build Command**: `npm run build:backend`
   * **Start Command**: `npm --workspace=backend run start`

### Option B: Railway (Manual Config)

1. Create a new service from your GitHub repo.
2. Set **Root Directory**: `.` (or `backend`).
3. Set **Build Command**: `npm run build:backend`.
4. Set **Start Command**: `npm --workspace=backend run start`.
5. Add environment variables: `GROQ_API_KEY`, `CORS_ORIGIN`, `PORT`.

Once deployed, copy your backend URL (e.g. `https://orca-backend.onrender.com`).

---

## 4. Step 2: Deploying Frontend (Vercel)

1. Import your GitHub repository in **Vercel**.
2. Vercel will automatically detect Next.js.
3. Project Settings Configuration:
   * **Framework Preset**: Next.js
   * **Root Directory**: `frontend` (or `.` if using root `vercel.json`)
   * **Build Command**: `cd .. && npm run build:frontend` (or `npm run build:frontend`)
   * **Output Directory**: `.next`
4. Configure **Environment Variables** in Vercel:

| Variable | Description | Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public API URL of deployed Express backend | `https://orca-backend.onrender.com` |

5. Click **Deploy**. Vercel will build `@orca/shared` and produce an optimized production bundle.

---

## 5. Step 3: Configure Backend CORS

After your Vercel deployment completes, update the `CORS_ORIGIN` environment variable on your backend host (Render or Railway) to allow incoming API requests from your live Vercel domain:

```env
CORS_ORIGIN=https://orca-frontend.vercel.app,http://localhost:3000
```

The backend dynamically checks `CORS_ORIGIN` or `FRONTEND_URL` on every incoming request to ensure security while supporting multi-domain setups.

---

## 6. Local Verification Commands

To test production builds locally before pushing:

```bash
# Build backend
npm run build:backend

# Test backend start
npm --workspace=backend run start

# Build frontend
npm run build:frontend
```
