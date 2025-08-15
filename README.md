# 🎯 Flutter Widget Catcher

[![CI/CD Pipeline](https://github.com/your-username/flutter-widget-catcher/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-username/flutter-widget-catcher/actions/workflows/ci-cd.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/fmodefdejfdmjjlfdodklhkoichndcgg)](https://chrome.google.com/webstore/detail/flutter-widget-catcher/fmodefdejfdmjjlfdodklhkoichndcgg)
[![Downloads](https://img.shields.io/chrome-web-store/d/fmodefdejfdmjjlfdodklhkoichndcgg)](https://chrome.google.com/webstore/detail/flutter-widget-catcher/fmodefdejfdmjjlfdodklhkoichndcgg)
[![Rating](https://img.shields.io/chrome-web-store/rating/fmodefdejfdmjjlfdodklhkoichndcgg)](https://chrome.google.com/webstore/detail/flutter-widget-catcher/fmodefdejfdmjjlfdodklhkoichndcgg)

A powerful Chrome extension that makes copying Flutter widgets with proper bracket matching effortless. No more counting brackets manually!

## ✨ Features

- 🎯 **Smart Widget Detection**: Automatically identifies Flutter widget structures
- 🔗 **Perfect Bracket Matching**: Handles nested parentheses, curly braces, and square brackets
- ⌨️ **Keyboard Shortcuts**: Quick access with `Ctrl+Shift+C` (or `Cmd+Shift+C` on Mac)
- 🎨 **Beautiful UI**: Modern, intuitive popup interface
- 📊 **Usage Statistics**: Track how many widgets you've caught
- 🛡️ **Error Handling**: Robust error handling with helpful notifications
- 🚀 **Performance Optimized**: Lightweight and fast
- 🔧 **Testing Built-in**: Test extension functionality directly from popup

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/flutter-widget-catcher/fmodefdejfdmjjlfdodklhkoichndcgg)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Development)
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` folder

## 🎯 How to Use

### Method 1: Right-Click Context Menu
1. Navigate to any webpage with Flutter widget code
2. Select the widget name (e.g., "Container", "Column", "Row")
3. Right-click and select "🎯 Catch Flutter Widget"
4. The complete widget with proper brackets will be copied to your clipboard!

### Method 2: Keyboard Shortcut
1. Select any Flutter widget text
2. Press `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
3. Widget automatically copied with perfect bracket matching!

### Example
```dart
// Before: You select just "Container"
Container(
  padding: EdgeInsets.all(16.0),
  child: Column(
    children: [
      Text('Hello'),
      Button(
        onPressed: () => print('Clicked'),
        child: Text('Click me'),
      ),
    ],
  ),
)

// After: Complete widget copied to clipboard with all brackets matched!
```

## 🛠️ Development

### Prerequisites
- Node.js 14+ and npm 6+
- Chrome browser for testing

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/flutter-widget-catcher.git
cd flutter-widget-catcher

# Install dependencies
npm install

# Start development with hot reload
npm run watch

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Create extension package
npm run package
```

### Project Structure
```
flutter-widget-catcher/
├── src/                    # Source code
│   ├── background.js       # Background script (service worker)
│   ├── contentScript.js    # Content script (injected into pages)
│   ├── popup.js           # Popup interface logic
│   ├── popup.css          # Popup styles
│   └── snackbar.css       # Notification styles
├── public/                 # Static assets
│   ├── manifest.json      # Extension manifest
│   ├── popup.html         # Popup HTML
│   └── icons/            # Extension icons
├── config/                # Build configuration
│   ├── webpack.config.js  # Webpack config
│   └── webpack.common.js  # Common webpack settings
├── scripts/               # Build and deployment scripts
│   ├── package.js         # Extension packaging
│   └── upload-to-store.js # Chrome Web Store upload
├── tests/                 # Test files
│   ├── chrome-mock.js     # Chrome API mocks
│   └── setup.js          # Test setup
└── .github/workflows/     # CI/CD workflows
    └── ci-cd.yml          # GitHub Actions
```

## 🚀 CI/CD Pipeline

This project features a comprehensive CI/CD pipeline that automatically:

### 🔄 Continuous Integration
- **Multi-Node Testing**: Tests on Node.js 16.x, 18.x, and 20.x
- **Code Quality**: ESLint for code standards
- **Security Scanning**: npm audit and Snyk vulnerability checks
- **Test Coverage**: Jest with coverage reporting
- **Build Validation**: Ensures extension builds successfully

### 🚢 Continuous Deployment

#### Development Environment
- **Trigger**: Push to `develop` branch
- **Action**: Deploys to development Chrome Web Store (unpublished)
- **Testing**: Safe environment for testing new features

#### Production Environment
- **Trigger**: Git tags (e.g., `v1.0.0`)
- **Action**: Deploys to production Chrome Web Store with auto-publishing
- **Release**: Creates GitHub release with changelog

### 📦 Automated Packaging
- Builds optimized extension bundle
- Creates downloadable ZIP package
- Validates manifest.json structure
- Uploads build artifacts

## 🔧 Chrome Web Store Setup

To enable automatic deployment to Chrome Web Store:

### 1. Get Chrome Web Store API Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the Chrome Web Store API
4. Create OAuth 2.0 credentials (Desktop application type)
5. Note down your `Client ID` and `Client Secret`

### 2. Generate Refresh Token
```bash
# Use the upload script helper
node scripts/upload-to-store.js --token-help
```

### 3. Set GitHub Secrets
Add these secrets to your GitHub repository:

```bash
# Required for all deployments
CHROME_CLIENT_ID=your_oauth_client_id
CHROME_CLIENT_SECRET=your_oauth_client_secret
CHROME_REFRESH_TOKEN=your_refresh_token

# Development environment
CHROME_EXTENSION_ID_DEV=your_dev_extension_id

# Production environment  
CHROME_EXTENSION_ID_PROD=your_prod_extension_id

# Optional: Notifications
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook
SNYK_TOKEN=your_snyk_token
```

### 4. Publishing Workflow

#### Development Release
```bash
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
# Automatically deploys to dev environment
```

#### Production Release
```bash
# Create and push a version tag
npm run version:patch  # or version:minor, version:major
# Automatically deploys to production and creates GitHub release
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test Chrome extension APIs
- **Mocking**: Chrome APIs are mocked for reliable testing

### Writing Tests
```javascript
// Example test
describe('Widget Catcher', () => {
  test('should extract widget name correctly', () => {
    const result = extractWidgetName('Container(child: Text("Hello"))');
    expect(result).toBe('Container');
  });
});
```

## 📋 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run watch` | Development mode with hot reload |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run clean` | Clean dist and build folders |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |
| `npm test` | Run tests |
| `npm run package` | Create extension ZIP package |
| `npm run release` | Build, package, and upload to store |
| `npm run version:patch` | Bump patch version and tag |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the linter**: `npm run lint:fix`
5. **Run tests**: `npm test`
6. **Commit changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Maintenance tasks

## 🐛 Issues and Support

- **Bug Reports**: [Create an issue](https://github.com/your-username/flutter-widget-catcher/issues/new?template=bug_report.md)
- **Feature Requests**: [Create an issue](https://github.com/your-username/flutter-widget-catcher/issues/new?template=feature_request.md)
- **Support**: [Discussions](https://github.com/your-username/flutter-widget-catcher/discussions)

## 📈 Roadmap

- [ ] **Firefox Support**: Extend to Firefox browser
- [ ] **Edge Support**: Microsoft Edge compatibility
- [ ] **Smart Widget Recognition**: AI-powered widget detection
- [ ] **Custom Shortcuts**: User-configurable keyboard shortcuts
- [ ] **Widget Templates**: Save and reuse common widget patterns
- [ ] **Syntax Highlighting**: Better visual feedback
- [ ] **Multi-language Support**: Internationalization

## 📊 Analytics

The extension includes privacy-friendly analytics:
- **Usage Statistics**: Number of widgets caught (stored locally)
- **Error Tracking**: Anonymous error reporting for improvements
- **No Personal Data**: We don't collect any personal information

## 🔒 Privacy

- **Local Storage Only**: All data stays on your device
- **No Tracking**: No user behavior tracking
- **Minimal Permissions**: Only necessary Chrome permissions
- **Open Source**: Complete transparency

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this extension
- Flutter community for inspiration and feedback
- Chrome Extension documentation and examples

## ☕ Support

If you find this extension helpful, consider:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/bawa)

---

**Made with ❤️ for Flutter developers**

⭐ Star this repository if you find it useful!

