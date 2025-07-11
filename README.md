# Butler

A modern Electron + React + Vite + TypeScript desktop app using Carbon Design System and SCSS.

## Features
- Electron desktop app with Vite/React/TypeScript
- Carbon Design System UI
- SCSS styling (no CSS)
- Responsive layout with Carbon UI Shell
- Routing with React Router
- SQLite persistence for settings and logs
- Structured logging system (SQLite + in-memory)
- Environment management (dev, staging, prod)
- Unit tests and documentation

## Stack
- Electron
- React + Vite + TypeScript
- Carbon Design System
- SCSS
- SQLite (better-sqlite3)

## Structure
- `src/layout/` — Shared layout components
- `src/pages/` — Page components (Home, Textpad, Multi-Rename, Settings)
- `src/routes/` — Routing definitions
- `electron-main.js` — Electron main process, SQLite, logger, IPC
- `preload.js` — Secure IPC bridge

## Getting Started
See `setup.md` for installation and development instructions.
