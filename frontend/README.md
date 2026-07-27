# InferCloud Frontend Client

The **InferCloud Frontend** is a modern React 19 application built with Vite. It features an editorial Anthropic/Claude-inspired design aesthetic, interactive data visualizers, local browser caching, and dynamic hardware comparison interfaces.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Key Components](#-key-components)
- [Client Caching Architecture](#-client-caching-architecture)
- [Directory Structure](#-directory-structure)
- [Environment Setup](#-environment-setup)
- [Development & Build Scripts](#-development--build-scripts)
- [Production Nginx & Docker Deployment](#-production-nginx--docker-deployment)

---

## 🎨 Overview

The user interface delivers an editorial, publishing-grade experience:
- **Canvas Base**: Tinted Warm Cream (`#faf9f5`) counter-positioned against cool-gray AI themes.
- **Brand Voltage**: Warm Coral (`#cc785c`) used for primary CTAs and interactive highlights.
- **Typography**: Tiempos / Copernicus slab-serif headers paired with StyreneB / Inter sans.
- **Interactions**: Smooth GSAP scroll animations, Framer Motion modal mounts, and interactive Recharts graphs.

---

## 💎 Key Components

| Component | File | Description |
| :--- | :--- | :--- |
| **Dock Navbar** | `DockNavbar.jsx` | Centered floating MacOS-style navigation navbar wrapped to isolate Framer Motion transforms. |
| **Hero Section** | `HeroSection.jsx` | Responsive hero layout featuring dynamic stats badges and headline copy. |
| **Deployment Tabs** | `DeploymentTabs.jsx` | Tabbed view for Local Physical GPUs, Cloud Rentals, and Workstations with inline physical GPU search. |
| **Cloud Table** | `CloudTable.jsx` | Rental table with tier selectors (All/Datacenter/Workstation/Consumer), provider filters, and unit toggles ($/hr, $/day, $/mo, $/GB VRAM). |
| **Detail Modal** | `DetailModal.jsx` | Modal overlay displaying breadcrumbs, pricing cards, provider lists, TechPowerUp database specs, and TechSpot review cards. |
| **Compare Modal** | `CompareModal.jsx` | Multi-GPU side-by-side comparison matrix showing specs, bandwidth, power, and price deltas. |
| **TCO Analysis** | `TcoAnalysis.jsx` | Interactive daily execution slider modeling workstation CapEx breakeven schedules. |
| **Bandwidth Chart** | `BandwidthChart.jsx` | Recharts bar visualization comparing bandwidth throughput (TB/s) across GPU architectures. |
| **Search Overlay** | `SearchOverlay.jsx` | Global search modal querying local, cloud, and system datasets simultaneously. |

---

## 💾 Client Caching Architecture

API calls are routed through `src/api/gpuApi.js` which manages a client-side `sessionStorage` cache:
1. **Cache Writes**: Successful API responses are serialized into `sessionStorage` under `gpu_cache_<endpoint>_<params>`.
2. **Instant Sub-Second Loads**: Subsequent calls to the same endpoint return instantly from browser storage.
3. **Reload Invalidation**: On page refresh (`window.onload`), `App.jsx` automatically purges all `gpu_cache_` entries from `sessionStorage` to guarantee fresh telemetry.

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── gpuApi.js             # Axios API client & sessionStorage caching
│   ├── components/
│   │   ├── BandwidthChart.jsx    # Recharts bandwidth graph
│   │   ├── CloudTable.jsx        # Cloud provider rental pricing table
│   │   ├── CompareModal.jsx      # Hardware comparison matrix modal
│   │   ├── DeploymentTabs.jsx    # Hardware category tabs & physical GPU search
│   │   ├── DetailModal.jsx       # TechPowerUp & TechSpot detail modal
│   │   ├── DockNavbar.jsx        # Floating MacOS navbar component
│   │   ├── GpuCard.jsx           # Local physical GPU card component
│   │   ├── HeroSection.jsx       # Application hero section
│   │   ├── SearchOverlay.jsx     # Global search overlay
│   │   ├── SkeletonLoader.jsx    # Shimmer loading skeleton UI
│   │   ├── StrategicDirectives.jsx# Architectural advisory cards
│   │   ├── SystemCard.jsx        # Workstation & mobile system card
│   │   └── TcoAnalysis.jsx       # Recharts TCO analysis component
│   ├── App.jsx                   # Application layout & state manager
│   ├── index.css                 # Unified design tokens & global CSS
│   └── main.jsx                  # React DOM root entry point
├── Dockerfile                    # Multi-stage Nginx production build
├── index.html                    # Single Page App HTML container
├── nginx.conf                    # Production Nginx reverse-proxy rules
├── package.json                  # Dependencies & Vite build scripts
└── vite.config.js                # Vite configuration with env proxying
```

---

## ⚙️ Environment Setup

Create `.env` inside the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 💻 Development & Build Scripts

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server (http://localhost:5173)
npm run dev

# Compile production bundle (dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## 🐳 Production Nginx & Docker Deployment

The frontend includes a multi-stage Docker build that compiles Vite assets and serves them via Nginx:

```bash
# Build frontend container image
docker build -t infercloud-frontend .

# Run container on port 80
docker run -p 80:80 --name infercloud-frontend infercloud-frontend
```
