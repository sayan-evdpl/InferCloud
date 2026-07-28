# Contributing to InferCloud

Thank you for your interest in contributing to **InferCloud**! InferCloud is an enterprise-grade silicon intelligence and cloud compute marketplace platform. We welcome contributions from developers of all skill levels.

This guide outlines our development workflow, conventional commit standards, code quality guidelines, and pull request procedures.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Quick Step-by-Step Contribution Process](#-quick-step-by-step-contribution-process)
- [Branching Strategy](#-branching-strategy)
- [Conventional Commit Standard](#-conventional-commit-standard)
  - [Commit Message Format](#commit-message-format)
  - [Commit Types & Semantic Release Versioning](#commit-types--semantic-release-versioning)
  - [Commit Examples](#commit-examples)
- [Code Style & Architecture Guidelines](#-code-style--architecture-guidelines)
  - [Frontend Standards (React 19 + Vite)](#frontend-standards-react-19--vite)
  - [Backend Standards (Node.js ES Modules + Express v5)](#backend-standards-nodejs-es-modules--express-v5)
- [Pre-Submission Checklist](#-pre-submission-checklist)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Automated CI/CD Pipeline](#-automated-cicd-pipeline)
- [Emergency Git Recovery & Troubleshooting](#-emergency-git-recovery--troubleshooting)

---

## 🤝 Code of Conduct

We expect all contributors to maintain a respectful, welcoming, and collaborative environment. Please report any abusive behavior or issues to the repository maintainers.

---

## 🏁 Getting Started

1. **Fork the Repository**: Click the **Fork** button at the top right of the GitHub repository page to create a copy in your account.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/InferCloud.git
   cd InferCloud
   ```
3. **Configure Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/sayan-evdpl/InferCloud.git
   git fetch upstream
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

---

## ⚡ Quick Step-by-Step Contribution Process

Follow this simple step-by-step workflow when contributing changes:

1. **Update your forked repo's `main` branch** directly on GitHub.
2. Open your terminal in your local project root folder.
3. Fetch the latest changes:
   ```bash
   git fetch
   ```
4. Pull latest code to your local machine:
   ```bash
   git pull origin main
   ```
5. Make your code edits and improvements.
6. Stage your changes:
   ```bash
   git add .
   ```
7. Commit your changes using a conventional commit message:
   ```bash
   git commit -m "convention: your message"
   ```
8. Push your changes to your forked repository:
   ```bash
   git push origin main
   ```
9. Go to your GitHub forked repository page and create a **Pull Request (PR)** targeting our `feature/release-automation` branch.

---

## 🌿 Branching Strategy

Always create a new branch off the latest `main` (or `dev`) branch before starting your work.

### Branch Naming Conventions

Use descriptive prefixes when naming your feature branches:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality or feature additions | `feature/gpu-filter-by-vram` |
| `fix/` | Bug fixes or issue resolutions | `fix/techpowerup-scraper-parser` |
| `docs/` | Documentation improvements | `docs/update-contributing-guide` |
| `refactor/` | Code restructuring without feature changes | `refactor/api-response-handler` |
| `chore/` | Maintenance tasks or config updates | `chore/update-dependencies` |

Example command to create a branch:
```bash
git checkout -b feature/gpu-filter-by-vram
```

---

## 📜 Conventional Commit Standard

InferCloud uses **[Semantic Release](https://github.com/semantic-release/semantic-release)** to automate package versioning, CHANGELOG generation, and GitHub releases. **All commit messages MUST follow the Conventional Commits specification.**

> [!IMPORTANT]
> Semantic Release inspects your commit history on the `main` branch to determine whether to issue a `patch`, `minor`, or `major` version bump. Non-conforming commit messages will prevent automated releases from working properly.

### Commit Message Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **type**: Mandatory. Describes the nature of the change.
- **scope**: Optional. The section of the codebase affected (e.g. `backend`, `frontend`, `scraper`, `docker`, `ci`).
- **description**: Mandatory. Short, present-tense description of the change (capitalize first letter, no period at end).

### Commit Types & Semantic Release Versioning

| Commit Type | Description | Version Bump | Example Version Impact |
| :--- | :--- | :---: | :---: |
| `fix` | Fixes a bug in the application | **Patch** | `1.0.0` → `1.0.1` |
| `feat` | Adds a new user-facing feature | **Minor** | `1.0.0` → `1.1.0` |
| `feat!` / `fix!` | Introduces a breaking change (or includes `BREAKING CHANGE:` footer) | **Major** | `1.0.0` → `2.0.0` |
| `docs` | Documentation updates only | None / Patch | `1.0.0` → `1.0.1` |
| `style` | Formatting, white-space, missing semi-colons | None / Patch | `1.0.0` → `1.0.1` |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None / Patch | `1.0.0` → `1.0.1` |
| `perf` | Performance improvement | None / Patch | `1.0.0` → `1.0.1` |
| `test` | Adding or correcting unit/integration tests | None / Patch | `1.0.0` → `1.0.1` |
| `build` | Changes to build tools, dependencies, or scripts | None / Patch | `1.0.0` → `1.0.1` |
| `ci` | Modifications to CI workflows (`.github/workflows/`) | None / Patch | `1.0.0` → `1.0.1` |
| `chore` | General maintenance, configuration, or non-src changes | None / Patch | `1.0.0` → `1.0.1` |

### Commit Examples

✅ **Correct Commit Messages**:
```bash
# Bug fix (Patch bump)
git commit -m "fix(backend): patch scrapers fallback logic when techpowerup is unreachable"

# New feature (Minor bump)
git commit -m "feat(frontend): add interactive TCO breakeven slider component"

# Breaking change (Major bump)
git commit -m "feat(api)!: migrate GPU search endpoint signature to support multi-provider filter"

# Documentation update
git commit -m "docs: write setup and contributing documentation"
```

❌ **Incorrect Commit Messages (Avoid These)**:
```bash
git commit -m "fixed stuff"
git commit -m "added new feature"
git commit -m "bugfix"
```

---

## 🎨 Code Style & Architecture Guidelines

### Frontend Standards (React 19 + Vite)

- **Components**: Place reusable UI components in `frontend/src/components/`. Use functional components and modern React hooks.
- **Styling**: Use modular CSS and global CSS design tokens defined in `frontend/src/index.css`. Maintain high aesthetic standard (editorial canvas styling, subtle micro-animations).
- **Development & Build**: Run the frontend locally using `npm run dev` and verify production build compilation using `npm run build` before committing:
  ```bash
  cd frontend
  npm run dev    # Starts Vite development server
  npm run build  # Builds production distribution bundle
  ```
- **Animations**: Prefer `framer-motion` for UI entry/exit transitions and `gsap` for scroll-driven animations.

### Backend Standards (Node.js ES Modules + Express v5)

- **Module Syntax**: Use Native ES Modules (`import` / `export`) across all backend files (`"type": "module"` in `package.json`).
- **Async Handling**: Wrap all asynchronous express routes with `asyncHandler` wrapper (`backend/src/utils/asyncHandler.js`).
- **Standard Responses**: Use `ApiResponse` (`backend/src/utils/ApiResponse.js`) and `ApiError` (`backend/src/utils/ApiError.js`) for uniform JSON API responses.
- **Middleware**: Keep middlewares modular in `backend/src/middlewares/`.

---

## ✅ Pre-Submission Checklist

Before submitting a Pull Request, verify that you have completed the following steps:

1. [ ] Code follows existing project style and design conventions.
2. [ ] Frontend builds cleanly without errors (`cd frontend && npm run build`).
3. [ ] Backend API endpoints function as expected locally (`npm run dev`).
4. [ ] Commit history follows the [Conventional Commit Standard](#-conventional-commit-standard).
5. [ ] Code builds successfully in Docker environments (`docker build -t backend:test ./backend` and `docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 -t frontend:test ./frontend`).

---

## 📬 Submitting a Pull Request

1. **Push Changes to your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Create Pull Request**:
   - Navigate to the original repository on GitHub.
   - Click **New Pull Request**.
   - Set the base branch to `main` (or designated `dev` / release branch).
3. **Fill out PR Details**:
   - Title must follow conventional commit naming (e.g. `feat(frontend): add GPU VRAM filter`).
   - Describe the changes made, motivation, and any testing steps.
4. **Review & Revisions**:
   - Maintainers will review your PR. If changes are requested, push additional commits to your feature branch.

---

## ⚙️ Automated CI/CD Pipeline

When a Pull Request is opened or updated, GitHub Actions automatically executes our Continuous Integration workflow (`.github/workflows/ci.yml`):

- **Docker Build Check**: Builds both backend and frontend Docker containers to ensure deployment compatibility.
- **Semantic Release**: Merges to `main` automatically trigger Semantic Release (`.github/workflows/release.yml`) to calculate the next version tag, update `CHANGELOG.md`, and generate a GitHub release.

---

## 🤷 Emergency Git Recovery & Troubleshooting

*Because let's be honest — Git will eventually yell at you, and panic is not a valid git command.*

### ❌ "Help! Git rejected my push!" (Push Error)

If you hit an error while trying to `git push`, don't panic or start deleting files. Follow these steps:

1. Go to the GitHub repository page in your browser.
2. Check for any new remote commits/changes and update the remote repo if needed.
3. Open your code editor terminal in the project root folder.
4. Fetch and pull the latest changes from `main`:
   ```bash
   git fetch
   git pull origin main
   ```
5. Resolve any merge conflicts (if any), and now push your changes again!

---

### 🤦 "Oops! I accidentally committed my changes!" (Undoing a Commit)

If you mistakenly committed changes that you weren't supposed to commit yet, you can easily reset your HEAD back by one commit while keeping all your code changes safe in your working directory:

```bash
git reset HEAD~
```

Boom. Your commit is undone, and all your modified files are right back in your workspace as if nothing happened.

---

> [!TIP]
> **Pro Tip**: If you actually want to understand *why* Git is doing what it's doing instead of blindly copying terminal commands from Stack Overflow, go read the official [git-scm documentation](https://git-scm.com/doc) first... *then* come back and push your code like a pro. 😉
