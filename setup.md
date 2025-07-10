# Project Setup Guide

Welcome to the Butler Desktop App! This guide will walk you through setting up the project from scratch. Follow each step carefully to ensure a smooth development experience.

---

## 1. Prerequisites

Before you begin, make sure you have the following installed:

### Required Software
- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Rust & Cargo** (for Tauri backend): [Install Rust](https://www.rust-lang.org/tools/install)
- **Git**: [Download Git](https://git-scm.com/downloads)

### Platform-Specific Requirements
- **Windows**: Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- **macOS**: Install Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: Install build-essential (`sudo apt install build-essential libssl-dev`) and any dependencies listed in [Tauri's docs](https://tauri.app/v1/guides/getting-started/prerequisites/)

---

## 2. Clone the Repository

Open a terminal and run:
```bash
git clone <repository-url>
cd butler
```
Replace `<repository-url>` with the actual URL of this repository.

---

## 3. Install Dependencies

Install all Node.js dependencies:
```bash
npm install
```

If you encounter dependency errors, try:
```bash
npm install --legacy-peer-deps
```

---

## 4. Install Tauri CLI

Install the Tauri CLI globally (if not already installed):
```bash
npm install -g @tauri-apps/cli
```

---

## 5. Environment Configuration

The app supports three environments: **development**, **staging**, and **production**.

### Environment Files
- `env.development` - Development environment settings
- `env.staging` - Staging environment settings  
- `env.production` - Production environment settings

### Running in Different Environments

**Development (default):**
```bash
npm run dev
```

**Staging:**
```bash
npm run dev:staging
```

**Production:**
```bash
npm run dev:production
```

### Building for Different Environments

**Development build:**
```bash
npm run build
```

**Staging build:**
```bash
npm run build:staging
```

**Production build:**
```bash
npm run build:production
```

### Environment Indicator
The app displays the current environment as a colored badge in the header:
- 🟢 **DEV** - Development environment
- 🟠 **STAGING** - Staging environment
- 🔴 **PROD** - Production environment

---

## 6. Run the App in Development Mode

Start the development server and Tauri desktop app:
```bash
npm run dev
```
- This will open the app in a desktop window.
- The frontend uses Vite and React; the backend uses Tauri (Rust).
- You'll see a green "DEV" badge in the header indicating you're in development mode.
- The app runs on port 5174 by default (configurable in `vite.config.ts`).

---

## 7. Build for Production

To create a production build:
```bash
npm run build:production
```

To build the Tauri desktop app:
```bash
npm run tauri build
```
- The output will be in the `src-tauri/target/release` directory.

---

## 8. Run Tests

To run all unit and component tests:
```bash
npm run test
```
To run tests once (CI mode):
```bash
npm run test:run
```
To view test coverage:
```bash
npm run test:coverage
```

---

## 9. Project Structure Overview

```
src/
├── assets/         # Images and static files
├── components/     # Reusable React components
├── constants/      # App-wide constants and environment config
├── hooks/          # Custom React hooks
├── pages/          # Main page components
├── services/       # Business logic and API services
├── test/           # Test files and setup
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app layout
├── App.scss        # Global styles
└── main.tsx        # App entry point
```

---

## 10. Environment Variables

The app uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_ENV` | Environment name | `development` |
| `VITE_APP_NAME` | App display name | `Butler` |
| `VITE_APP_VERSION` | App version | `0.1.0` |
| `VITE_API_URL` | API endpoint URL | `http://localhost:3000` |
| `VITE_DEBUG_MODE` | Enable debug mode | `true` (dev) |
| `VITE_LOG_LEVEL` | Logging level | `debug` (dev) |
| `VITE_ENABLE_DEV_TOOLS` | Enable dev tools | `true` (dev) |

---

## 11. Troubleshooting & Tips

- **Rust not found?** Run `rustc --version` to check. If not installed, follow the [Rust install guide](https://www.rust-lang.org/tools/install).
- **Build errors on Windows?** Make sure you have Visual Studio Build Tools installed.
- **Port already in use?** The app uses port 5174 by default. If busy, Vite will automatically try the next available port. You can also manually change the port in `vite.config.ts`.
- **Dependency issues?** Use `npm install --legacy-peer-deps`.
- **Tauri errors?** Check [Tauri's troubleshooting guide](https://tauri.app/v1/guides/troubleshooting/).
- **Environment not showing correctly?** Check that the environment file is being loaded properly.
- **Editor recommendation:** Use [VS Code](https://code.visualstudio.com/) with the [Tauri extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) and [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

---

## 12. Useful Commands

- `npm run dev` — Start development mode
- `npm run dev:staging` — Start staging mode
- `npm run dev:production` — Start production mode
- `npm run build` — Build frontend for development
- `npm run build:staging` — Build frontend for staging
- `npm run build:production` — Build frontend for production
- `npm run tauri dev` — Run Tauri in dev mode
- `npm run tauri build` — Build Tauri app for release
- `npm run test` — Run all tests
- `npm run test:coverage` — View test coverage

---

## 13. Deployment

### Staging Deployment
1. Run `npm run build:staging`
2. Deploy the `dist/` folder to your staging server
3. The app will show "STAGING" badge

### Production Deployment
1. Run `npm run build:production`
2. Deploy the `dist/` folder to your production server
3. The app will show "PROD" badge

---

## 14. Need Help?

- Check the [README.md](./README.md) for more details.
- Visit the [Tauri documentation](https://tauri.app/)
- Ask your team or open an issue in the repository.

---

Happy coding! 🎉 