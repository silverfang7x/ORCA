# ORCA Monorepo Deployment Guide (Vercel + Render Architecture)

This guide details the step-by-step procedure for deploying the **ORCA Marine Intelligence Platform** using separate, reliable frontend (Vercel) and backend (Render) Web Services.

---

## 1. Architecture Overview

```
                        +----------------------------+
                        |   Vercel (Frontend App)    |
                        |   Next.js (App Router)     |
                        |   orca-frontend-ten.vercel |
                        +--------------+-------------+
                                       |
                                       | REST / SSE API Requests
                                       v
                        +----------------------------+
                        |   Render (Backend Service) |
                        |  Express + LangGraph Node  |
                        |   orca-backend.onrender.com|
                        +----------------------------+
```

* **Frontend**: Next.js App Router deployed as a single standard project on **Vercel**.
* **Backend**: Express + LangGraph Multi-Agent Server deployed as a standalone Web Service on **Render**.
* **Shared Package**: `@orca/shared` (TypeScript type definitions) automatically compiled during monorepo builds.

---

## 2. Step-by-Step Deployment Guide

### Step A: Deploy `backend/` to Render as a Web Service

1. Log into your **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com)).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository (`silverfang7x/ORCA`).
4. Configure the Web Service settings:
   * **Name**: `orca-backend` (or your preferred service name)
   * **Region**: Oregon (US West) or Frankfurt (closest to your users)
   * **Root Directory**: `.` (leave as root directory)
   * **Runtime**: `Node`
   * **Build Command**: `npm run build:backend`
   * **Start Command**: `npm --workspace=backend run start`
   * **Instance Type**: Free or Starter
5. Environment Variables in Render:
   Add the following variables under the **Environment** tab:

   | Environment Variable | Recommended Value / Notes |
   | :--- | :--- |
   | `PORT` | `10000` (Render default listening port) |
   | `GROQ_API_KEY` | Your Groq Cloud API Key (`gsk_...`) |
   | `BHASHINI_USER_ID` | Bhashini ULCA User ID |
   | `BHASHINI_ULCA_API_KEY` | Bhashini ULCA API Key |
   | `CORS_ORIGIN` | `https://orca-frontend-ten.vercel.app` |

6. Click **Create Web Service**. Wait 2–3 minutes for Render to run `npm run build:backend` and start the Express server.

---

### Step B: Copy the Render Backend URL

1. Once the deployment status turns green (**Live**), copy the web service URL from the top of your Render dashboard.
2. Example Render URL: `https://orca-backend-xyz.onrender.com`
3. Verify backend health by visiting `https://orca-backend-xyz.onrender.com/health` in your browser. It should return `{"status":"ok"}`.

---

### Step C: Set `NEXT_PUBLIC_API_URL` in Vercel Project Settings

1. Log into your **Vercel Dashboard** ([vercel.com](https://vercel.com)).
2. Open your frontend project (`orca-frontend-ten`).
3. Navigate to **Settings** $\rightarrow$ **Environment Variables**.
4. Add or update the following environment variable:
   * **Key**: `NEXT_PUBLIC_API_URL`
   * **Value**: `https://orca-backend-xyz.onrender.com` (your exact copied Render URL from Step B without trailing slash)
   * **Environments**: Check **Production**, **Preview**, and **Development**.
5. Click **Save**.

---

### Step D: Redeploy Vercel Frontend

Because Next.js embeds `NEXT_PUBLIC_*` environment variables into the client-side JavaScript bundle during build time, you **must trigger a new build**:

1. In your Vercel project dashboard, go to the **Deployments** tab.
2. Click the `...` (three dots) menu next to the latest deployment and select **Redeploy**.
3. (Alternatively, push a new commit to `main`).
4. Once Vercel completes the build, open [https://orca-frontend-ten.vercel.app/fisherman/chat](https://orca-frontend-ten.vercel.app/fisherman/chat) and send a query.
5. Open DevTools Network tab: verify requests are hitting `https://orca-backend-xyz.onrender.com/api/query/stream` directly with HTTP 200 responses!

---

## 3. Local Verification Commands

To test production builds locally:

```bash
# Build shared and backend packages
npm run build:backend

# Run standalone backend server locally on port 4000
npm --workspace=backend run start

# In a separate terminal, build and run frontend locally
npm run build:frontend
npm --workspace=frontend run start
```
