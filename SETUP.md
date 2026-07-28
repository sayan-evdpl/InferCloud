# InferCloud — Setup & Installation Guide

This guide provides step-by-step instructions for setting up, configuring, and running the **InferCloud** platform locally or using Docker containers.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Repository Cloning](#-repository-cloning)
- [Environment Configuration](#-environment-configuration)
  - [Backend Environment (`backend/.env`)](#backend-environment-backendenv)
  - [Frontend Environment (`frontend/.env`)](#frontend-environment-frontendenv)
- [Local Development Setup](#-local-development-setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Running Both Services](#3-running-both-services)
- [Docker Containerization Setup](#-docker-containerization-setup)
  - [Backend Docker Container](#backend-docker-container)
  - [Frontend Docker Container (Nginx)](#frontend-docker-container-nginx)
- [Verification & Health Checks](#-verification--health-checks)
- [Troubleshooting](#-troubleshooting)

---

## ⚡ Prerequisites

Before installing InferCloud, ensure your system meets the following requirements:

- **Node.js**: `v18.0.0` or higher (Node.js `v24.x` recommended)
- **npm**: `v9.0.0` or higher
- **Git**: `v2.x` or higher
- **Docker & Docker Buildx** *(Optional)*: For containerized deployments
- **Google Gemini API Key** *(Optional)*: Required for enabling the AI Chatbot feature

> [!NOTE]
> InferCloud backend runs on Node.js (ES Modules) using Express v5, and the frontend is built with React 19 and Vite 8.

---

## 📥 Repository Cloning

Clone the repository to your local workspace:

```bash
git clone https://github.com/sayan-evdpl/InferCloud.git
cd InferCloud
```

Install root dependencies (used for automated release management and conventional commits):

```bash
npm install
```

---

## ⚙️ Environment Configuration

Both the frontend and backend services require environment configuration files. Sample templates are provided in the respective directories.

### Backend Environment (`backend/.env`)

Navigate to the `backend` directory and create `.env` based on `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Configure the environment variables in `backend/.env`:

| Variable | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `3000` | Port number for the Express backend server |
| `CORS_ORIGIN` | Optional | `http://localhost:5173` | Allowed origin for Cross-Origin Resource Sharing |
| `GEMINI_API_KEY` | Optional | `your_gemini_api_key_here` | Google AI Studio key for chatbot feature |

Example `backend/.env` file:

```env
# Server Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Google AI Studio Gemini API Key (Required for the Chatbot)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment (`frontend/.env`)

Navigate to the `frontend` directory and create `.env`:

```bash
echo "VITE_BACKEND_URL=http://localhost:3000" > frontend/.env
```

Configure the environment variables in `frontend/.env`:

| Variable | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_BACKEND_URL` | Yes | `http://localhost:3000` | Target backend HTTP endpoint for API requests |

Example `frontend/.env` file:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🚀 Local Development Setup

To run InferCloud locally, start both the backend server and frontend development server in separate terminal windows.

### 1. Backend Setup

1. Change directory to `backend`:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the backend in development mode (using Nodemon for auto-reload):
   ```bash
   npm run dev
   ```

   *The server will start on `http://localhost:3000` by default.*

### 2. Frontend Setup

1. Open a new terminal and change directory to `frontend`:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

   *The client dashboard will be available at `http://localhost:5173` (or `http://localhost:5174` if port 5173 is occupied).*

### 3. Running Both Services

| Service | Dev Command | Default Local URL |
| :--- | :--- | :--- |
| **Backend API** | `npm run dev` (in `/backend`) | `http://localhost:3000` |
| **Frontend UI** | `npm run dev` (in `/frontend`) | `http://localhost:5173` |

---

## 🐳 Docker Containerization Setup

InferCloud provides multi-stage Docker builds for both services.

### Backend Docker Container

Build and run the Node.js backend container:

```bash
# Build Docker image
docker build -t infercloud-backend ./backend

# Run Docker container
docker run -d \
  -p 3000:3000 \
  --name infercloud-backend-container \
  --env-file backend/.env \
  infercloud-backend
```

### Frontend Docker Container (Nginx)

Build and run the production-grade static Nginx container for the frontend:

```bash
# Build Docker image with build argument
docker build \
  --build-arg VITE_BACKEND_URL=http://localhost:3000 \
  -t infercloud-frontend ./frontend

# Run Docker container
docker run -d \
  -p 80:80 \
  --name infercloud-frontend-container \
  infercloud-frontend
```

Now access the frontend at `http://localhost:80`.

---

## 🩺 Verification & Health Checks

Once both backend and frontend services are running, verify the setup:

1. **Backend Health Check Endpoint**:
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   *Expected Response:* `{"status": 200, "message": "Server is healthy", "success": true}`

2. **Backend GPU Telemetry Route**:
   ```bash
   curl http://localhost:3000/api/v1/gpus
   ```

3. **Frontend Dashboard UI**:
   Open `http://localhost:5173` in your browser. You should see the InferCloud GPU Telemetry Dashboard loading live cloud prices and physical hardware metrics.

---

## ❓ Troubleshooting

> [!WARNING]
> **CORS Error in Browser Console:**
> Ensure `CORS_ORIGIN` in `backend/.env` matches your frontend origin (e.g. `http://localhost:5173` or `http://localhost:5174`). Restart the backend after updating `.env`.

> [!TIP]
> **Chatbot Not Responding / Error 500:**
> Verify that a valid `GEMINI_API_KEY` is provided in `backend/.env`.

> [!NOTE]
> **Port Conflicts:**
> If port `3000` is already in use by another application, modify `PORT` in `backend/.env` and update `VITE_BACKEND_URL` in `frontend/.env` accordingly.