# Cividis Theme Engine 🎨

**Version 1.1** | **September 2025**

A powerful, pluggable JavaScript theming tool that dynamically manages CSS variables through remote API integration. Built with modern web standards and designed for seamless integration with any CSS framework.

## 🆕 Recent Updates (v1.1)

- ✅ **Text Contrast Rules**: Proper white/dark text contrast on all background colors for WCAG compliance
- ✅ **New CSS Variables**: Added `--theme-shadow-lg`, `--theme-border-radius`, `--theme-transition`
- ✅ **Accessibility Improvements**: Enhanced colorblind-safe design with scientific Cividis palette
- ✅ **Performance Optimization**: Eliminated hardcoded hex values in favor of CSS custom properties

## 🌐 Live Demo & API

- **🔗 Live Website:** https://colours-matter-git-main-ana-s-apps-projects.vercel.app
- **📡 API Endpoint:** https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme
- **📚 GitHub Repo:** https://github.com/San-Vibe-Coding-2025/colours-matter

![Cividis Color Palette](https://via.placeholder.com/800x200/440154/FFFFFF?text=Cividis+Color+Palette)

## ✨ Features

- **🔗 API Integration**: Fetches theme colors from remote REST endpoints
- **⚡ Dynamic CSS Variables**: Updates `:root` CSS custom properties in real-time
- **🎯 Single Script**: Only one script tag needed - no additional setup required
- **🎨 Framework Agnostic**: Works with Tailwind CSS, Bootstrap, custom CSS, and any framework
- **🔄 Auto CTA**: Automatically adds a themed activation button to your website
- **🛡️ Error Handling**: Robust fallback system with retry logic
- **📱 Responsive**: Works across all device sizes and screen types
- **♿ Accessible**: ARIA labels and keyboard navigation support

## 🚀 Quick Start

### 1. Include the Script

```html
<!-- Simple inclusion -->
<script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>

<!-- Or download and host locally -->
<script src="path/to/cividis-theme.js"></script>
```

### 2. Include the CSS Variables

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">
```

### 3. That's It! 

The theme engine will automatically:
- Apply fallback colors immediately
- Fetch colors from your API endpoint
- Add a "Try Cividis Theme" CTA button to your header
- Handle all errors gracefully

## 🔧 Configuration

### Basic Configuration

```javascript
// Auto-initialized with default settings
window.cividisTheme = new CividisTheme({
    apiEndpoint: 'https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme',
    debug: true
});
```

### Advanced Configuration

```javascript
const theme = new CividisTheme({
    // API Configuration
    apiEndpoint: 'https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme',
    retryAttempts: 3,
    retryDelay: 1000,
    
    // CTA Button Configuration  
    ctaConfig: {
        text: 'Try Cividis Theme',
        position: 'header', // 'header', 'top-right', 'bottom-right'
        gradient: 'linear-gradient(45deg, var(--theme-primary), var(--theme-warning))'
    },

    
    // Development
    debug: false
});
```

## 🎨 CSS Integration

### Using CSS Variables

```css
/* Your custom CSS */
.my-component {
    background: var(--theme-primary);
    color: var(--theme-background);
    border: 2px solid var(--theme-accent);
}

.gradient-header {
    background: linear-gradient(135deg, 
        var(--theme-primary), 
        var(--theme-accent)
    );
}
```

### Tailwind CSS Integration

The included `tailwind.config.js` provides theme-aware utilities:

```html
<!-- Use theme colors directly -->
<div class="bg-primary text-white p-4">
    Primary themed component
</div>

<!-- Gradient backgrounds -->
<div class="bg-gradient-primary p-8">
    Beautiful gradient background
</div>

<!-- Theme-aware utilities -->
<button class="bg-accent hover:opacity-theme transition-theme">
    Interactive button
</button>
```

## 📡 API Integration

### Expected API Response Format

```json
{
    "colors": {
        "primary": "#00204c",
        "secondary": "#64676f", 
        "accent": "#ccbb68",
        "success": "#0a376d",
        "warning": "#ffe945",
        "info": "#37476b",
        "background": "#ffffff",
        "text": "#1b1b1b",
        "border": "#e0e0e0"
    },
    "meta": {
        "name": "Cividis Theme",
        "version": "1.0"
    }
}
```

### API Endpoints

Your API should support:
- `GET /theme` - Return current theme colors
- Standard HTTP status codes
- JSON content type
- CORS headers (if serving from different domain)

## 🎯 CSS Variables Reference

| Variable | Purpose | Default Value |
|----------|---------|---------------|
| `--theme-primary` | Main brand color | `#00204c` |
| `--theme-secondary` | Secondary brand color | `#64676f` |
| `--theme-accent` | Accent/highlight color | `#ccbb68` |
| `--theme-success` | Success states | `#0a376d` |
| `--theme-warning` | Warning states | `#ffe945` |
| `--theme-info` | Information states | `#37476b` |
| `--theme-background` | Page background | `#ffffff` |
| `--theme-surface` | Card/surface backgrounds | `#f8f9fa` |
| `--theme-text` | Primary text color | `#1b1b1b` |
| `--theme-text-muted` | Muted text color | `#353a45` |
| `--theme-border` | Border colors | `#e0e0e0` |
| `--theme-shadow` | Box shadow colors | `rgba(14, 14, 14, 0.1)` |
| `--theme-shadow-lg` | Large box shadows | `rgba(14, 14, 14, 0.2)` |
| `--theme-shadow-lg` | Large shadows | `rgba(14, 14, 14, 0.3)` |
| `--theme-border-radius` | Border radius | `6px` |
| `--theme-border-radius-lg` | Large border radius | `12px` |
| `--theme-transition` | CSS transitions | `all 0.3s ease` |

## 🎪 Events & API

### Event Listeners

```javascript
// Theme applied successfully
window.addEventListener('cividis-theme-applied', (event) => {
    console.log('New theme:', event.detail.variables);
});

// CTA button clicked
window.addEventListener('cividis-cta-clicked', () => {
    console.log('User clicked the theme CTA');
    // Analytics tracking, etc.
});

// Error handling
window.addEventListener('cividis-theme-error', (event) => {
    console.error('Theme error:', event.detail.message, event.detail.error);
});
```

### JavaScript API

```javascript
// Manual theme refresh
await window.cividisTheme.refreshTheme();

// Get current theme data
const currentTheme = window.cividisTheme.getCurrentTheme();

// Update configuration
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://new-api.com/theme',
    debug: true
});

// Destroy theme engine
window.cividisTheme.destroy();
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your Website  │    │  Cividis Engine  │    │   Remote API    │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │    HTML     │ │    │ │ Theme Fetcher│ │◄──►│ │Theme Colors │ │
│ │             │ │    │ │              │ │    │ │    JSON     │ │
│ │ ┌─────────┐ │ │    │ └──────────────┘ │    │ └─────────────┘ │
│ │ │CSS Vars │ │◄┼────┼─ CSS Updater     │    │                 │
│ │ │:root{}  │ │ │    │                  │    │                 │
│ │ └─────────┘ │ │    │ ┌──────────────┐ │    │                 │
│ └─────────────┘ │    │ │ CTA Button   │ │    │                 │
│                 │    │ │ Generator    │ │    │                 │
│ ┌─────────────┐ │    │ └──────────────┘ │    │                 │
│ │Tailwind CSS │ │    │                  │    │                 │
│ │Custom CSS   │ │    │ ┌──────────────┐ │    │                 │
│ └─────────────┘ │    │ │Error Handler │ │    │                 │
│                 │    │ │& Fallbacks   │ │    │                 │
└─────────────────┘    │ └──────────────┘ │    │                 │
                       └──────────────────┘    └─────────────────┘
```

## 📱 Demo

Open `demo.html` in your browser to see the theme engine in action:

```bash
# Serve the demo locally
python -m http.server 8000
# Then visit: http://localhost:8000/demo.html
```

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/your-username/cividis-theme.git
cd cividis-theme

# Install dependencies  
npm install

# Start development server
npm run demo

# Build for production
npm run build
```

### File Structure

```
cividis-theme/
├── cividis-theme.js      # Main theme engine
├── cividis-theme.css     # CSS variables and utilities  
├── tailwind.config.js    # Tailwind configuration
├── demo.html            # Interactive demo
├── package.json         # NPM configuration
└── README.md           # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Color Palette

The Cividis color palette provides a scientifically-designed, colorblind-safe gradient:

- **Primary** (`#00204c`): Dark Blue
- **Secondary** (`#64676f`): Gray Blue  
- **Accent** (`#ccbb68`): Golden Yellow
- **Success** (`#0a376d`): Blue Gray
- **Warning** (`#ffe945`): Bright Yellow
- **Info** (`#37476b`): Light Blue

## 🚀 Roadmap

- [ ] Theme persistence (localStorage)
- [ ] Multiple theme switching
- [ ] Animation configurations
- [ ] React/Vue/Angular integrations
- [ ] Theme editor UI
- [ ] A11y contrast checking
- [ ] Theme scheduling

## 📞 Support

- 📧 Email: support@cividis-theme.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/cividis-theme/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/cividis-theme/discussions)

---

**Made with 💜 by the Cividis Theme Team**
