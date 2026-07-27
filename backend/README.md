# InferCloud Backend API Engine

The **InferCloud Backend** is a high-performance Node.js / Express 5 API microservice that serves silicon hardware telemetry, live cloud GPU rental prices, total cost-of-ownership (TCO) calculations, and real-time specs scraped from TechPowerUp and TechSpot.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Directory Structure](#-directory-structure)
- [API Endpoints](#-api-endpoints)
  - [Global Search](#1-get-apiv1gpussearch)
  - [Local Physical GPUs](#2-get-apiv1gpuslocal)
  - [Cloud Provider Offers](#3-get-apiv1gpuscloud)
  - [Workstations & Edge Systems](#4-get-apiv1gpussystems)
  - [TCO Workload Analysis](#5-get-apiv1gpustco)
  - [Bandwidth Dataset](#6-get-apiv1gpusbandwidth)
  - [External TechPowerUp Specs](#7-get-apiv1gpusexternal-specs)
- [Scraper & Aggregator Mechanics](#-scraper--aggregator-mechanics)
- [Environment Setup](#-environment-setup)
- [Running Locally](#-running-locally)
- [Docker Build](#-docker-build)

---

## 🔬 Overview

The backend is built using ES Module syntax (`"type": "module"`) on top of **Express 5**. It operates cleanly without external database dependencies by storing silicon seed data in memory and combining it dynamically with live HTTP feeds from:
- **gpurentalprices.com**: Live GPU rental offer aggregation across global neoclouds.
- **techpowerup.com**: Live HTML/AJAX parsing to dynamically extract CUDA cores, process nodes, die sizes, VRAM types, and bus widths for any queried GPU.

---

## ⚡ Key Features

- 🏎️ **In-Memory Telemetry**: Zero-latency querying for local GPUs, workstation rigs, and edge mobile devices.
- 🌐 **Live Rental Price Aggregation**: Dynamically queries neocloud pricing feeds and groups offers by GPU tier (Datacenter, Workstation, Consumer).
- 🕸️ **Real-Time TechPowerUp AJAX Scraper**: Parses TechPowerUp's HTML/JSON search lists and detail pages using regex, returning verified specs for any arbitrary GPU name.
- 🛡️ **Graceful Fallbacks**: Dynamic generator fallback (`getExternalSpecsFallback`) ensures 100% API uptime even if external remote servers are unreachable.
- 📐 **TCO Analysis Engine**: Calculates CapEx breakeven schedules comparing workstation purchase vs. hourly cloud rental profiles.

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── gpu.controllers.js   # Telemetry, search, scraper & TCO logic
│   ├── db/
│   │   └── seed.js              # In-memory datasets (Local GPUs, Systems, Fallbacks)
│   ├── routes/
│   │   └── gpu.routes.js        # Express v5 router definitions
│   ├── utils/
│   │   ├── ApiResponse.js       # Standardized JSON response formatter
│   │   └── asyncHandler.js      # Async error wrapper for Express routes
│   ├── app.js                   # Express application setup, CORS & middleware
│   └── server.js                # Server entry point
├── .env.example                 # Environment template
├── Dockerfile                   # Docker deployment file
└── package.json                 # Node dependencies & scripts
```

---

## 📡 API Endpoints

Base URL: `/api/v1/gpus`

### 1. `GET /api/v1/gpus/search`
Performs a global search across local GPUs, cloud rental hosts, and integrated workstation systems.

- **Query Parameters**:
  - `q` *(string)*: Search term (e.g. `4090`, `H100`, `laptop`)
- **Sample Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "gpus": [ ... ],
      "cloud": [ ... ],
      "systems": [ ... ],
      "total": 5
    },
    "message": "Search results",
    "success": true
  }
  ```

---

### 2. `GET /api/v1/gpus/local`
Returns physical hardware telemetry. If a search query `q` has no matches in the local dataset, it automatically queries TechPowerUp in real-time.

- **Query Parameters**:
  - `page` *(number, default: 1)*
  - `limit` *(number, default: 3)*
  - `sort` *(string: `bandwidth`, `vram`, `price`)*
  - `q` *(string)*: Search query for physical hardware

---

### 3. `GET /api/v1/gpus/cloud`
Fetches live cloud provider rates from `gpurentalprices.com`, groups them by GPU model, and calculates summary metrics.

- **Sample Response Payload**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "items": [
        {
          "name": "RTX 5090",
          "vram": "32 GB",
          "onDemandUsd": 0.45,
          "cheapestProvider": "Vast.ai",
          "offers": [ ... ]
        }
      ],
      "stats": {
        "cheapestH100Rate": 3.99,
        "providersCount": 6,
        "livePricePointsCount": 42
      }
    }
  }
  ```

---

### 4. `GET /api/v1/gpus/systems`
Returns integrated workstations, enterprise OEM desktops, and mobile compute devices.

- **Query Parameters**:
  - `formFactor` *(string: `laptop`, `workstation`, `desktop`)*

---

### 5. `GET /api/v1/gpus/tco`
Generates hourly total-cost-of-ownership datapoints for 24-hour schedules.

- **Query Parameters**:
  - `hours` *(number, default: 8)*: Daily execution hours.

---

### 6. `GET /api/v1/gpus/bandwidth`
Returns memory bandwidth comparison metrics (TB/s) sorted by architecture.

---

### 7. `GET /api/v1/gpus/external-specs`
Scrapes TechPowerUp and TechSpot reviews in real-time for any requested GPU.

- **Query Parameters**:
  - `name` *(string, required)*: Model name (e.g. `RTX 5090`, `H100 SXM`)

---

## 🕸️ Scraper & Aggregator Mechanics

The scraper engine uses high-performance regular expressions to parse TechPowerUp search result HTML:

```javascript
// Scrapes TechPowerUp search AJAX endpoints
const searchUrl = `https://www.techpowerup.com/gpu-specs/?q=${encodeURIComponent(name)}&ajax`;
```

Extracted parameters include:
- **Process Node & Transistor Counts**
- **Die Size & Shader/CUDA Core Counts**
- **Memory Technology & Bus Widths**
- **TechSpot Review Scores & Pros/Cons Summaries**

---

## ⚙️ Environment Setup

Create `.env` inside the `backend/` directory:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## 💻 Running Locally

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start in development mode (with nodemon auto-restart)
npm run dev

# Start in production mode
npm start
```

---

## 🐳 Docker Build

```bash
# Build Docker image
docker build -t infercloud-backend .

# Run Docker container
docker run -p 3000:3000 --name infercloud-backend infercloud-backend
```
