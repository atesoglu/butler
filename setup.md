# Butler Setup Guide 🎩

Comprehensive setup instructions for the Butler Electron desktop application.

## 📋 Prerequisites

### **System Requirements**
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: For version control

### **Operating Systems**
- **Windows**: 10 or higher
- **macOS**: 10.15 or higher
- **Linux**: Ubuntu 18.04+, CentOS 7+, or equivalent

### **Development Tools** (Optional)
- **VS Code**: Recommended IDE with extensions
- **Git**: Version control system

## 🚀 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/your-org/butler.git
cd butler
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Verify Installation**
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 9.0.0

# Verify TypeScript
npx tsc --version
```

## 🛠️ Development

### **Start Development Server**
```bash
npm run dev
```

This command will:
1. Start the Vite development server on `http://localhost:5173`
2. Wait for the server to be ready
3. Launch the Electron application

### **Development Workflow**
```bash
# Start development (recommended)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Package Electron app
npm run electron:build
```

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### **Test Structure**
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Page and feature tests
- **E2E Tests**: End-to-end application tests (planned)

## 🔧 Code Quality

### **Linting and Formatting**
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Check TypeScript types
npm run type-check

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### **Pre-commit Setup** (Recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Add to package.json scripts
{
  "prepare": "husky install",
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🌍 Environment Configuration

### **Environment Files**
Create environment-specific configuration files:

```bash
# Development
.env.development
VITE_ENV=development
VITE_API_URL=http://localhost:3000

# Production
.env.production
VITE_ENV=production
VITE_API_URL=https://api.butler.com
```

### **Environment Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENV` | Environment name | `development` |
| `VITE_API_URL` | API endpoint | `http://localhost:3000` |

## 📦 Building

### **Development Build**
```bash
npm run build
```

### **Production Package**
```bash
# Build the application
npm run build

# Package for distribution
npm run electron:build
```

### **Build Outputs**
- **Development**: `dist/` directory with optimized assets
- **Production**: Platform-specific installers in `dist/`

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Node Modules Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **2. Electron Build Issues**
```bash
# Rebuild native modules
npm run electron:rebuild

# Clear Electron cache
rm -rf ~/.electron
```

#### **3. TypeScript Errors**
```bash
# Check TypeScript configuration
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### **4. Vite Build Issues**
```bash
# Clear Vite cache
npm run clean

# Check Vite configuration
npx vite --config vite.config.ts
```

### **Platform-Specific Issues**

#### **Windows**
- Ensure Visual Studio Build Tools are installed
- Run PowerShell as Administrator if needed
- Check Windows Defender exclusions

#### **macOS**
- Install Xcode Command Line Tools: `xcode-select --install`
- Grant necessary permissions to Terminal/VS Code

#### **Linux**
- Install build essentials: `sudo apt-get install build-essential`
- Install additional dependencies for Electron

## 📁 Project Structure

```
butler/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── layout/            # Layout components
│   ├── pages/             # Page components
│   ├── styles/            # Global styles
│   ├── assets/            # Static assets
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── electron-main.cjs      # Electron main process
├── preload.js            # IPC bridge
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔐 Security

### **Electron Security**
- **Context Isolation**: Enabled by default
- **Node Integration**: Disabled for security
- **Preload Scripts**: Secure IPC communication
- **Content Security Policy**: Configured for production

### **Best Practices**
- Never use `nodeIntegration: true`
- Always use `contextIsolation: true`
- Validate all IPC messages
- Keep dependencies updated

## 📊 Performance

### **Development Performance**
- **Hot Module Replacement**: Fast development cycles
- **Vite Dev Server**: Optimized for speed
- **TypeScript**: Incremental compilation

### **Production Performance**
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed and optimized assets

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### **Code Standards**
- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write unit tests for new features
- Follow commit message conventions

## 📞 Support

### **Getting Help**
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check README.md and this setup guide

### **Useful Commands**
```bash
# Check project status
npm run type-check
npm run lint
npm test

# Development shortcuts
npm run dev          # Start development
npm run build        # Build for production
npm run clean        # Clean build artifacts
```

---

**Happy coding! 🎉** 