# Setup Instructions

## Prerequisites
- Node.js 18+
- npm 9+

## Install Dependencies
```
npm install
```

## Development
Start the app in development mode (Vite + Electron):
```
npm run dev
```

## Build for Production
Build the renderer (Vite) and package the Electron app:
```
npm run build
npm run electron:build
```

## Environment Management
- `.env` — Development (default)
- `.env.staging` — Staging
- `.env.production` — Production

Set `VITE_ENV` in the appropriate file. The current environment is shown in the app layout.

## Directory Structure
- `src/layout/` — Layout components
- `src/pages/` — Pages
- `src/routes/` — Routing
- `electron-main.js` — Electron main, SQLite, logger
- `preload.js` — Secure IPC bridge

## SQLite Data
- Settings and logs are stored in `butler.sqlite` in the Electron user data directory.

## Tests
To run unit tests (if present):
```
npm test
```

## Troubleshooting
- If you see errors about missing native modules, try `npm rebuild` or delete `node_modules` and reinstall.
- For Windows, ensure build tools are installed for native modules. 