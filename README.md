# Viridis Theme Engine 🎨

A powerful, pluggable JavaScript theming tool that dynamically manages CSS variables through remote API integration. Built with modern web standards and designed for seamless integration with any CSS framework.

## 🌐 Live Demo & API

- **🔗 Live Website:** https://colours-matter-git-main-ana-s-apps-projects.vercel.app
- **📡 API Endpoint:** https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme
- **📚 GitHub Repo:** https://github.com/San-Vibe-Coding-2025/colours-matter

![Viridis Color Palette](https://via.placeholder.com/800x200/440154/FFFFFF?text=Viridis+Color+Palette)

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
<script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/viridis-theme.js"></script>

<!-- Or download and host locally -->
<script src="path/to/viridis-theme.js"></script>
```

### 2. Include the CSS Variables

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/viridis-theme.css">
```

### 3. That's It! 

The theme engine will automatically:
- Apply fallback colors immediately
- Fetch colors from your API endpoint
- Add a "Try Viridis Theme" CTA button to your header
- Handle all errors gracefully

## 🔧 Configuration

### Basic Configuration

```javascript
// Auto-initialized with default settings
window.viridisTheme = new ViridisTheme({
    apiEndpoint: 'https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme',
    debug: true
});
```

### Advanced Configuration

```javascript
const theme = new ViridisTheme({
    // API Configuration
    apiEndpoint: 'https://colours-matter-git-main-ana-s-apps-projects.vercel.app/api/theme',
    retryAttempts: 3,
    retryDelay: 1000,
    
    // CTA Button Configuration  
    ctaConfig: {
        text: 'Try Viridis Theme',
        position: 'header', // 'header', 'top-right', 'bottom-right'
        gradient: 'linear-gradient(45deg, #414487FF, #FDE725FF)'
    },
    
    // Fallback Colors (Viridis Palette)
    fallbackColors: {
        '--theme-primary': '#440154FF',    // Deep Purple
        '--theme-secondary': '#414487FF',  // Blue Purple  
        '--theme-accent': '#2A788EFF',     // Teal Blue
        '--theme-success': '#22A884FF',    // Green Teal
        '--theme-warning': '#7AD151FF',    // Lime Green
        '--theme-info': '#FDE725FF',       // Bright Yellow
        '--theme-background': '#ffffff',
        '--theme-text': '#333333',
        '--theme-border': '#e0e0e0'
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
        "primary": "#440154FF",
        "secondary": "#414487FF", 
        "accent": "#2A788EFF",
        "success": "#22A884FF",
        "warning": "#7AD151FF",
        "info": "#FDE725FF",
        "background": "#ffffff",
        "text": "#333333",
        "border": "#e0e0e0"
    },
    "meta": {
        "name": "Viridis Theme",
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
| `--theme-primary` | Main brand color | `#440154FF` |
| `--theme-secondary` | Secondary brand color | `#414487FF` |
| `--theme-accent` | Accent/highlight color | `#2A788EFF` |
| `--theme-success` | Success states | `#22A884FF` |
| `--theme-warning` | Warning states | `#7AD151FF` |
| `--theme-info` | Information states | `#FDE725FF` |
| `--theme-background` | Page background | `#ffffff` |
| `--theme-surface` | Card/surface backgrounds | `#f8f9fa` |
| `--theme-text` | Primary text color | `#333333` |
| `--theme-text-muted` | Muted text color | `#6c757d` |
| `--theme-border` | Border colors | `#e0e0e0` |
| `--theme-shadow` | Box shadow colors | `rgba(0, 0, 0, 0.1)` |

## 🎪 Events & API

### Event Listeners

```javascript
// Theme applied successfully
window.addEventListener('viridis-theme-applied', (event) => {
    console.log('New theme:', event.detail.variables);
});

// CTA button clicked
window.addEventListener('viridis-cta-clicked', () => {
    console.log('User clicked the theme CTA');
    // Analytics tracking, etc.
});

// Error handling
window.addEventListener('viridis-theme-error', (event) => {
    console.error('Theme error:', event.detail.message, event.detail.error);
});
```

### JavaScript API

```javascript
// Manual theme refresh
await window.viridisTheme.refreshTheme();

// Get current theme data
const currentTheme = window.viridisTheme.getCurrentTheme();

// Update configuration
window.viridisTheme.updateConfig({
    apiEndpoint: 'https://new-api.com/theme',
    debug: true
});

// Destroy theme engine
window.viridisTheme.destroy();
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your Website  │    │  Viridis Engine  │    │   Remote API    │
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
git clone https://github.com/your-username/viridis-theme.git
cd viridis-theme

# Install dependencies  
npm install

# Start development server
npm run demo

# Build for production
npm run build
```

### File Structure

```
viridis-theme/
├── viridis-theme.js      # Main theme engine
├── viridis-theme.css     # CSS variables and utilities  
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

The default Viridis color palette provides a scientifically-designed gradient from deep purple to bright yellow:

- **Primary** (`#440154FF`): Deep Purple
- **Secondary** (`#414487FF`): Blue Purple  
- **Accent** (`#2A788EFF`): Teal Blue
- **Success** (`#22A884FF`): Green Teal
- **Warning** (`#7AD151FF`): Lime Green
- **Info** (`#FDE725FF`): Bright Yellow

## 🚀 Roadmap

- [ ] Theme persistence (localStorage)
- [ ] Multiple theme switching
- [ ] Animation configurations
- [ ] React/Vue/Angular integrations
- [ ] Theme editor UI
- [ ] A11y contrast checking
- [ ] Theme scheduling

## 📞 Support

- 📧 Email: support@viridis-theme.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/viridis-theme/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/viridis-theme/discussions)

---

**Made with 💜 by the Viridis Theme Team**