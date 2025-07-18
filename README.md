# Butler 🎩

A modern, feature-rich Electron desktop application built with React, TypeScript, and Carbon Design System. Butler provides a comprehensive suite of productivity tools with a beautiful, accessible interface.

![Butler App](assets/butler.svg)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Carbon Design System**: Enterprise-grade UI components and patterns
- **Theme Support**: Light, dark, and custom themes with persistence
- **Responsive Design**: Optimized for desktop with mobile considerations
- **Accessibility**: WCAG compliant with screen reader support
- **Micro-animations**: Smooth transitions and interactive feedback

### 🛠️ **Core Functionality**
- **Textpad**: Advanced text editor with multiple document types
- **Multi-Rename**: Batch file renaming with pattern matching
- **Settings Management**: Comprehensive app configuration
- **Logging System**: Real-time application logging and monitoring

### 🔧 **Technical Excellence**
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, Context API, and functional components
- **Vite Build System**: Fast development and optimized builds
- **Electron**: Cross-platform desktop application
- **SCSS**: Advanced styling with CSS custom properties

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/butler.git
cd butler

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev              # Start development server with Electron
npm run preview          # Preview production build

# Building
npm run build            # Build for production
npm run electron:build   # Package Electron app

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Utilities
npm run clean            # Clean build artifacts
```

## 🏗️ Architecture

### **Project Structure**
```
butler/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppHeader.tsx    # Application header
│   │   ├── AppSideNav.tsx   # Side navigation
│   │   ├── AppBreadcrumb.tsx # Breadcrumb navigation
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   ├── LogPanel.tsx     # Log display component
│   │   └── ...              # Other components
│   ├── contexts/            # React Context providers
│   │   └── ThemeContext.tsx # Theme management
│   ├── layout/              # Layout components
│   │   └── AppLayout.tsx    # Main application layout
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Home page with component showcase
│   │   ├── Textpad.tsx      # Text editor
│   │   ├── MultiRename.tsx  # File renaming tool
│   │   └── Settings.tsx     # Application settings
│   ├── styles/              # Global styles
│   │   └── app.scss         # Main SCSS file
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── electron-main.cjs        # Electron main process
├── preload.js              # Secure IPC bridge
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

### **Key Technologies**

#### **Frontend**
- **React 19**: Latest React with hooks and concurrent features
- **TypeScript**: Full type safety and developer experience
- **Carbon Design System**: IBM's enterprise UI component library
- **React Router**: Client-side routing with HashRouter
- **SCSS**: Advanced CSS preprocessing with variables and mixins

#### **Desktop**
- **Electron**: Cross-platform desktop application framework
- **Vite**: Fast build tool and development server
- **IPC Communication**: Secure inter-process communication

#### **Development**
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting and consistency
- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing utilities

## 🎨 Design System

### **Themes**
Butler supports multiple Carbon Design System themes:
- **White Theme**: Pure white background
- **Light Gray Theme**: Light gray background (g10)
- **Dark Gray Theme**: Dark gray background (g90)
- **Dark Theme**: Full dark theme (g100)

### **Components**
The application showcases a comprehensive set of Carbon components:
- **Data Tables**: With sorting, filtering, and pagination
- **Forms**: With validation and accessibility features
- **Modals & Panels**: For focused interactions
- **Navigation**: Side navigation and breadcrumbs
- **Notifications**: Success, error, and info messages

## 🔧 Configuration

### **Environment Variables**
```bash
# .env.development
VITE_ENV=development

# .env.production
VITE_ENV=production
```

### **Settings Persistence**
User settings are automatically saved to:
- **Settings**: `settings.json` in Electron user data directory
- **Logs**: In-memory with configurable retention

## 🧪 Testing

### **Test Structure**
```bash
src/
├── components/
│   └── __tests__/          # Component tests
├── pages/
│   └── __tests__/          # Page tests
└── layout/
    └── __tests__/          # Layout tests
```

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building

### **Development Build**
```bash
npm run build
```

### **Production Package**
```bash
npm run build
npm run electron:build
```

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** your changes
5. **Submit** a pull request

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Tests**: Unit tests for new features

### **Commit Convention**
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Carbon Design System**: IBM's open-source design system
- **Electron**: Cross-platform desktop framework
- **Vite**: Fast build tool and development server
- **React Team**: Modern React development

---

**Built with ❤️ using modern web technologies**
