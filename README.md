# Butler - Tauri Desktop Application

A modern desktop application built with Tauri, React, TypeScript, and Carbon Design System for text processing and file management tasks.

## Features

- **Text Processing**: Advanced text manipulation tools including line removal, case conversion, and formatting
- **Multi-File Rename**: Batch file renaming with pattern matching and preview
- **Settings Management**: Comprehensive application settings with theme support
- **Carbon Design System**: Modern, accessible UI components following IBM's design standards
- **Cross-Platform**: Native desktop application for Windows, macOS, and Linux

## Tech Stack

- **Frontend**: React 18, TypeScript, Carbon Design System
- **Backend**: Tauri (Rust)
- **Build Tool**: Vite
- **Styling**: SCSS with Carbon Design System
- **Testing**: Vitest, React Testing Library
- **State Management**: React Hooks with Local Storage

## Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/           # Application constants and configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # Business logic and API services
├── test/               # Test files and setup
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets (images, icons)
├── App.tsx             # Main application component
├── App.scss            # Global styles
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Rust and Cargo (for Tauri)
- Platform-specific build tools

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd butler
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tauri` - Run Tauri commands
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

### Code Organization

#### Components
- Reusable UI components in `src/components/`
- Page components in `src/pages/`
- Follow Carbon Design System patterns

#### State Management
- Use React hooks for local state
- Custom hooks in `src/hooks/` for reusable logic
- Local storage persistence for settings

#### Testing
- Unit tests for utilities in `src/test/utils.test.ts`
- Component tests in `src/test/components.test.tsx`
- Test setup in `src/test/setup.ts`

### Best Practices

1. **TypeScript**: Use strict typing throughout the application
2. **Carbon Design**: Follow Carbon Design System guidelines
3. **Testing**: Write unit tests for utilities and integration tests for components
4. **Performance**: Use React.memo and useMemo for expensive operations
5. **Accessibility**: Ensure all components meet WCAG guidelines

## Features in Detail

### Text Processing
- Remove empty/duplicate lines
- Add prefixes/suffixes
- Case conversion (lowercase, uppercase, title case)
- Line sorting and filtering
- Pattern-based text manipulation

### Multi-File Rename
- Drag-and-drop file upload
- Batch rename with patterns
- Real-time preview
- Support for various file types

### Settings
- Theme selection (light, dark, auto)
- Language preferences
- Notification settings
- Privacy controls
- User profile management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) for the desktop framework
- [Carbon Design System](https://www.carbondesignsystem.com/) for the UI components
- [React](https://reactjs.org/) for the frontend framework
