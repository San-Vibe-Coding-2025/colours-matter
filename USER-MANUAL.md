# Cividis Theme Engine - User Manual

**Version 1.0** | **September 2025**

A complete guide to implementing the Cividis Theme Engine for colorblind-accessible web applications.

---

# IMPORTANT: NO FALLBACKS FOR COLOUR CHANGES

**MUST NOT add fallback to the implementation of the colour changes. If the API fails, log in console but NEVER, EVER use a fallback to change the colours.**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [What is Cividis?](#what-is-cividis)
3. [Installation Methods](#installation-methods)
4. [Basic Usage](#basic-usage)
5. [API Integration](#api-integration)
6. [CSS Integration](#css-integration)
7. [Configuration Options](#configuration-options)
8. [Advanced Usage](#advanced-usage)
9. [Troubleshooting](#troubleshooting)
10. [Browser Support](#browser-support)
11. [FAQ](#faq)
12. [Support](#support)

---

## 🚀 Quick Start

### 30-Second Setup

Add these two lines to your HTML and you're done:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include Cividis Theme CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">
</head>
<body>
    <!-- Your content here -->
    
    <!-- Include Cividis Theme Engine - Add before closing body tag -->
    <script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
</body>
</html>
```

**That's it!** Your website is now colorblind-accessible with:
☑️ Scientifically-designed colors
☑️ Automatic "Cividis Theme" button
☑️ CSS variables for easy styling
☑️ Error handling (no color fallback)

---

## 🎨 What is Cividis?

### The Problem
**300 million people worldwide** have Color Vision Deficiency (CVD). Traditional red/green color schemes exclude:
- **8% of men** (1 in 12)
- **0.5% of women** (1 in 200)
- People who can't distinguish traffic lights, form errors, or data visualizations

### The Solution
**Cividis** is a scientifically-designed color palette that:
- **🚫 Contains no green colors** that cause red/green confusion
- **🔬 Is perceptually uniform** - colors appear equally spaced
- **♿ Is 100% accessible** to all types of color vision deficiency
- **🎯 Maintains beauty** while being completely inclusive

### Color Palette
```css
**Primary** (`#00204c`): Dark Blue
**Secondary** (`#7f7c75`): Gray Blue  
**Accent** (`#bbaf71`): Golden Yellow
**Success** (`#0a376d`): Blue Gray
**Warning** (`#ffe945`): Bright Yellow
**Info** (`#37476b`): Light Blue
```

---

## 💾 Installation Methods

### Method 1: CDN (Recommended)
```html
<!-- CSS Variables -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">

<!-- JavaScript Engine -->
<script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
```

### Method 2: Download Files
1. Download `cividis-theme.css` and `cividis-theme.js`
2. Host on your server
3. Include in your HTML:

```html
<link rel="stylesheet" href="/path/to/cividis-theme.css">
<script src="/path/to/cividis-theme.js"></script>
```

### Method 3: NPM Package (Coming Soon)
```bash
npm install cividis-theme
```

### Method 4: WordPress Plugin
```php
// Add to your theme's functions.php
function enqueue_cividis_theme() {
    wp_enqueue_style('cividis-theme', 'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css');
    wp_enqueue_script('cividis-theme', 'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js');
}
add_action('wp_enqueue_scripts', 'enqueue_cividis_theme');
```

---

## 🎯 Basic Usage

### Step 1: Include the Files
```html
<link rel="stylesheet" href="cividis-theme.css">
<script src="cividis-theme.js"></script>
```

### Step 2: Use CSS Variables in Your Styles
```css
/* Your CSS automatically inherits theme colors */
.my-button {
    background: var(--theme-primary);
    color: var(--theme-background);
    border: 2px solid var(--theme-accent);
}

.success-alert {
    background: var(--theme-success);
    color: white;
    padding: 1rem;
}

.gradient-hero {
    background: linear-gradient(135deg, 
        var(--theme-primary), 
        var(--theme-accent)
    );
}
```

### Step 3: That's It!
The theme engine automatically:
Applies Cividis colors
Adds a "Cividis Theme" button
Handles errors (no color fallback)

---

## 🔌 API Integration

### Setting Up Your API Endpoint

Create an endpoint that returns theme colors in JSON format:

#### Required Response Format:
```json
{
    "success": true,
    "colors": {
        "primary": "#00204c",
        "secondary": "#7f7c75", 
        "accent": "#bbaf71",
        "success": "#0a376d",
        "warning": "#ffe945",
        "info": "#37476b",
        "background": "#ffffff",
        "text": "#333333",
        "border": "#e0e0e0"
    },
    "meta": {
        "name": "My Custom Theme",
        "timestamp": "2025-09-24T10:30:00Z"
    }
}
```

#### API Implementation Examples:

**Node.js/Express:**
```javascript
const express = require('express');
const app = express();

app.get('/api/theme', (req, res) => {
    res.json({
        success: true,
        colors: {
            primary: "#00204c",
            secondary: "#7f7c75",
            accent: "#bbaf71",
            success: "#0a376d",
            warning: "#ffe945",
            info: "#37476b",
            background: "#ffffff",
            text: "#333333",
            border: "#e0e0e0"
        }
    });
});

app.listen(3000);
```

**PHP:**
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$theme = [
    'success' => true,
    'colors' => [
        'primary' => '#00204c',
        'secondary' => '#7f7c75',
        'accent' => '#bbaf71',
        'success' => '#0a376d',
        'warning' => '#ffe945',
        'info' => '#37476b',
        'background' => '#ffffff',
        'text' => '#333333',
        'border' => '#e0e0e0'
    ]
];

echo json_encode($theme);
?>
```

**Python/Flask:**
```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/theme')
def get_theme():
    return jsonify({
        'success': True,
        'colors': {
            'primary': '#00204c',
            'secondary': '#bbaf71',
            'accent': '#7f7c75',
            'success': '#0a376d',
            'warning': '#ffe945',
            'info': '#37476b',
            'background': '#ffffff',
            'text': '#333333',
            'border': '#e0e0e0'
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
```

### Configuring the API Endpoint
```javascript
// Set your API endpoint
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis'
});
```

---

## 🎨 CSS Integration

### Available CSS Variables

The theme engine provides these CSS custom properties:

```css
:root {
    /* Core Colors */
    --theme-primary: #00204c;      /* Main brand color */
    --theme-secondary: #7f7c75;    /* Secondary brand */
    --theme-accent: #bbaf71;       /* Highlights */
    --theme-success: #0a376d;      /* Success states */
    --theme-warning: #ffe945;      /* Warnings */
    --theme-info: #37476b;         /* Information */
    
    /* Layout Colors */
    --theme-background: #ffffff;   /* Page background */
    --theme-surface: #f8f9fa;      /* Card backgrounds */
    --theme-text: #1b1b1b;         /* Primary text */
    --theme-text-muted: #353a45;   /* Secondary text */
    --theme-border: #e0e0e0;       /* Borders */
    --theme-shadow: rgba(14, 14, 14, 0.1); /* Box shadows */
    --theme-shadow-lg: rgba(14, 14, 14, 0.2); /* Large shadows */
    --theme-shadow-xl: rgba(14, 14, 14, 0.3); /* Extra large shadows */
    
    /* Gradients */
    --theme-gradient-primary: linear-gradient(135deg, var(--theme-success), var(--theme-secondary));
    --theme-gradient-accent: linear-gradient(135deg, var(--theme-warning), var(--theme-success));
    --theme-gradient-cool: linear-gradient(135deg, var(--theme-primary), var(--theme-warning));
    
    /* Interaction States */
    --theme-hover-opacity: 0.8;
    --theme-active-opacity: 0.6;
    --theme-disabled-opacity: 0.4;
    
    /* Layout Properties */
    --theme-border-radius: 6px;
    --theme-border-radius-lg: 12px;
    --theme-transition: all 0.3s ease;
}
```

### CSS Usage Examples

#### Basic Styling:
```css
.card {
    background: var(--theme-surface);
    border: 2px solid var(--theme-border);
    border-radius: var(--theme-border-radius);
    box-shadow: 0 4px 16px var(--theme-shadow);
    color: var(--theme-text);
}

.button {
    background: var(--theme-primary);
    color: var(--theme-background);
    border: none;
    padding: 12px 24px;
    border-radius: var(--theme-border-radius);
    transition: var(--theme-transition);
}

.button:hover {
    opacity: var(--theme-hover-opacity);
}
```

#### Text Color Rules:
The Cividis theme follows strict accessibility guidelines for text contrast:

```css
/* WHITE text on dark backgrounds */
.primary-button { background: var(--theme-primary); color: white; }
.success-button { background: var(--theme-success); color: white; }
.info-button { background: var(--theme-info); color: white; }
.accent-button { background: var(--theme-accent); color: white; }

/* DARK text on light backgrounds */
.secondary-button { background: var(--theme-secondary); color: var(--theme-text); }
.warning-button { background: var(--theme-warning); color: var(--theme-text); }
```

#### Gradient Backgrounds:
```css
.hero-section {
    background: var(--theme-gradient-primary);
    color: white;
}

.accent-panel {
    background: var(--theme-gradient-accent);
}

```

#### Text Colors:
```css
.primary-text { color: var(--theme-primary); }
.success-text { color: var(--theme-success); }
.warning-text { color: var(--theme-warning); }
.muted-text { color: var(--theme-text-muted); }
```

### Tailwind CSS Integration

If using the provided `tailwind.config.js`:

```html
<!-- Background Colors -->
<div class="bg-primary text-white">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-accent">Accent background</div>

<!-- Gradient Backgrounds -->
<div class="bg-gradient-primary">Primary gradient</div>
<div class="bg-gradient-accent">Accent gradient</div>

<!-- Text Colors -->
<h1 class="text-primary">Primary heading</h1>
<p class="text-theme-muted">Muted text</p>

<!-- Interactive Elements -->
<button class="bg-primary hover:opacity-theme transition-theme">
    Interactive button
</button>
```

---

## ⚙️ Configuration Options

### Default Configuration:
```javascript
{
    // API Settings
    apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis',
    retryAttempts: 3,
    retryDelay: 1000,
    
    // CTA Button Settings
    ctaConfig: {
        text: 'Cividis Theme',
        position: 'header',
        gradient: 'linear-gradient(45deg, #00204c, #ffe945)'
    },
    
    // Development
    debug: false
}
```

### Custom Configuration:

#### Method 1: At Initialization
```javascript
window.cividisTheme = new CividisTheme({
    apiEndpoint: 'https://my-api.com/colors',
    debug: true,
    ctaConfig: {
        text: 'My Custom Button',
        position: 'top-right'
    }
});
```

#### Method 2: Update After Load
```javascript
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis',
    retryAttempts: 5,
    debug: true
});
```

### CTA Button Positions:
- `'header'` - Automatically finds and inserts into navigation
- `'top-right'` - Fixed position top right corner
- `'bottom-right'` - Fixed position bottom right corner
- `'top-left'` - Fixed position top left corner
- `'bottom-left'` - Fixed position bottom left corner

### Error Handling Configuration:
```javascript
window.cividisTheme.updateConfig({
    retryAttempts: 3,        // Number of API retry attempts
    retryDelay: 1000,        // Delay between retries (ms)
});
```

---

## 🔥 Advanced Usage

### Event Listeners

Listen to theme engine events:

```javascript
// Theme successfully applied
window.addEventListener('cividis-theme-applied', (event) => {
    console.log('New theme colors:', event.detail.variables);
    
    // Update your UI, save preferences, etc.
    updateCustomComponents(event.detail.variables);
    saveUserPreference('theme', event.detail.variables);
});

// CTA button clicked
window.addEventListener('cividis-cta-clicked', () => {
    console.log('User clicked theme button');
    
    // Analytics tracking
    gtag('event', 'accessibility_button_clicked', {
        'feature': 'cividis_theme',
        'accessibility': true
    });
});

// Theme loading errors
window.addEventListener('cividis-theme-error', (event) => {
    console.warn('Theme error:', event.detail.message);
    // You may notify the user, but DO NOT change colors or apply fallback theme.
});
```

### Manual Theme Control

```javascript
// Manually refresh theme
await window.cividisTheme.refreshTheme();

// Get current theme data
const currentColors = window.cividisTheme.getCurrentTheme();
console.log('Current primary color:', currentColors['--theme-primary']);

// Check if theme is loaded
if (window.cividisTheme.isInitialized) {
    console.log('Theme system ready');
}

// Destroy theme engine (cleanup)
window.cividisTheme.destroy();
```

### Dynamic Theme Switching

```javascript
async function switchTheme(themeName) {
    // Update API endpoint
    window.cividisTheme.updateConfig({
        apiEndpoint: `https://api.mysite.com/themes/${themeName}`
    });
    
    // Apply new theme
    await window.cividisTheme.refreshTheme();
    
    console.log(`Switched to ${themeName} theme`);
}

// Usage
switchTheme('dark');           // Load dark theme
switchTheme('high-contrast');  // Load high contrast theme
switchTheme('cividis');        // Back to default Cividis
```

### User Preference Storage

```javascript
// Save user's color preferences
window.addEventListener('cividis-theme-applied', (event) => {
    localStorage.setItem('cividis-theme-preferences', 
        JSON.stringify(event.detail.variables));
});

// Load saved preferences on page load
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('cividis-theme-preferences');
    if (saved) {
        const colors = JSON.parse(saved);
        // Apply saved colors manually if needed
        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }
});
```

### Custom Color Validation

```javascript
// Validate colors before applying
window.addEventListener('cividis-theme-applied', (event) => {
    const colors = event.detail.variables;
    
    // Check color contrast ratios
    if (!isAccessibleContrast(colors['--theme-text'], colors['--theme-background'])) {
        console.warn('Poor color contrast detected');
        // DO NOT apply fallback colors. Log only.
    }
});

function isAccessibleContrast(textColor, bgColor) {
    // Implement WCAG contrast ratio checking
    const ratio = calculateContrastRatio(textColor, bgColor);
    return ratio >= 4.5; // WCAG AA standard
}
```

### Integration with Popular Frameworks

#### React Integration:
```jsx
import { useEffect, useState } from 'react';

function ThemeProvider({ children }) {
    const [themeLoaded, setThemeLoaded] = useState(false);
    
    useEffect(() => {
        window.addEventListener('cividis-theme-applied', () => {
            setThemeLoaded(true);
        });
        
        return () => {
            window.removeEventListener('cividis-theme-applied');
        };
    }, []);
    
    return (
        <div className={`app ${themeLoaded ? 'theme-loaded' : 'loading'}`}>
            {children}
        </div>
    );
}
```

#### Vue.js Integration:
```vue
<template>
    <div :class="{ 'theme-loaded': themeReady }">
        <slot />
    </div>
</template>

<script>
export default {
    data() {
        return {
            themeReady: false
        };
    },
    mounted() {
        window.addEventListener('cividis-theme-applied', () => {
            this.themeReady = true;
        });
    }
};
</script>
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Colors Not Appearing
**Problem:** CSS variables not working  
**Solution:**
```css
/* Make sure you're using CSS variables correctly */
.my-element {
    /* ☑️ Correct */
    background: var(--theme-primary);
    
    /* ❌ Wrong */
    background: --theme-primary;
}
```

#### 2. CTA Button Not Showing
**Problem:** Button not appearing in header  
**Solutions:**
- Ensure you have a `<nav>` element in your HTML
- Try a different position: `position: 'top-right'`
- Check console for JavaScript errors

```javascript
// Debug CTA button placement
window.cividisTheme.updateConfig({
    ctaConfig: {
        position: 'top-right' // Try different positions
    },
    debug: true // Enable debug logging
});
```

#### 3. API Endpoint Not Working
**Problem:** Themes not loading from API  
**Solutions:**
- Check CORS headers on your API
- Verify JSON response format
- Check network tab in browser dev tools

```javascript
// Test API endpoint manually
fetch('https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis')
    .then(response => response.json())
    .then(data => console.log('API Response:', data))
    .catch(error => console.error('API Error:', error));
```

#### 4. Gradients Not Working
**Problem:** CSS gradients showing as solid colors  
**Solution:**
```css
/* Make sure to use the gradient variables */
.gradient-bg {
    /* ☑️ Correct */
    background: var(--theme-gradient-primary);
    
    /* ❌ Wrong - this won't work */
    background: gradient(var(--theme-primary), var(--theme-secondary));
}
```

### Debug Mode

Enable debug mode for detailed logging:

```javascript
window.cividisTheme.updateConfig({
    debug: true
});
```

Debug mode will log:
- Theme loading progress
- API requests and responses
- Color application status
- Error details

### Browser Console Commands

Use these in browser console for debugging:

```javascript
// Check current configuration
console.log(window.cividisTheme.config);

// Check current theme colors
console.log(window.cividisTheme.getCurrentTheme());

// Manual theme refresh
window.cividisTheme.refreshTheme();

// Check CSS variables
console.log(getComputedStyle(document.documentElement).getPropertyValue('--theme-primary'));
```

---

## 🌐 Browser Support

### Fully Supported:
- ☑️ Chrome 49+
- ☑️ Firefox 31+  
- ☑️ Safari 9.1+
- ☑️ Edge 16+
- ☑️ Opera 36+

### Partially Supported:
- ⚠️ Internet Explorer 11 (CSS variables with polyfill)

### Mobile Support:
- ☑️ iOS Safari 9.3+
- ☑️ Android Chrome 49+
- ☑️ Samsung Internet 5+

### CSS Variables Support
The theme engine requires CSS Custom Properties (variables). For older browsers, include this polyfill:

```html
<!-- CSS Variables Polyfill for IE11 -->
<script src="https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2.4.7/dist/css-vars-ponyfill.min.js"></script>
<script>
    if (!window.CSS || !CSS.supports('color', 'var(--fake-var)')) {
        cssVars();
    }
</script>
```

---

## ❓ FAQ

### General Questions

**Q: What makes Cividis better than other color palettes?**  
A: Cividis is specifically designed to avoid green colors that cause problems for the most common types of colorblindness (affecting 8% of men). It's not just "colorblind-friendly" - it's 100% accessible to all types of color vision deficiency.

**Q: Will this slow down my website?**  
A: No. The theme engine is lightweight (~5KB gzipped) and only runs once on page load. It uses efficient CSS variables that have minimal performance impact.

**Q: Can I customize the colors?**  
A: Yes! You can override any color through your API endpoint or by manually setting CSS variables. The system is fully customizable while maintaining accessibility.

**Q: Do I need an API to use this?**  
A: No. The theme engine works with fallback colors if no API is provided. The API is optional for dynamic theming.

### Technical Questions

**Q: How do CSS variables work with this system?**  
A: The theme engine sets CSS custom properties on the `:root` element. Your CSS references these variables, and when they change, your styles automatically update.

**Q: Can I use this with existing CSS frameworks?**  
A: Yes! Works with Bootstrap, Tailwind, Bulma, and any CSS framework. Just use the CSS variables in your styles.

**Q: What happens if JavaScript is disabled?**  
A: The fallback colors in your CSS file will be used. Users get a consistent (though static) color scheme.

**Q: Can I have multiple themes on one page?**  
A: The current version applies one theme globally. Multiple themes would require custom implementation.

### Accessibility Questions

**Q: Is this WCAG compliant?**  
A: Yes! Cividis colors meet WCAG AA contrast requirements and are designed specifically for accessibility.

**Q: What types of colorblindness does this help?**  
A: All types! Specifically deuteranopia, protanopia, tritanopia, and monochromacy. The green-free design eliminates the most common accessibility barriers.

**Q: Should I still use other accessibility features?**  
A: Absolutely! This handles color accessibility, but you should still use proper alt text, semantic HTML, keyboard navigation, etc.

### Implementation Questions

**Q: Can I use this in a React/Vue/Angular app?**  
A: Yes! The theme engine works with any JavaScript framework. Just include the script and listen for events in your components.

**Q: How do I test colorblind accessibility?**  
A: Use browser extensions like "Colorblinding" or online simulators. The comparison page also shows how traditional vs. Cividis colors appear.

**Q: Can I contribute to this project?**  
A: Yes! The project is open source. Submit issues, suggestions, or pull requests on GitHub.

---

## 📞 Support

### Getting Help

**📧 Email:** team@coloursmatter.co.uk  
**🐛 Issues:** [GitHub Issues](https://github.com/San-Vibe-Coding-2025/colours-matter/issues)  
**💬 Discussions:** [GitHub Discussions](https://github.com/San-Vibe-Coding-2025/colours-matter/discussions)  

### Before Contacting Support

1. **Check this manual** - Most questions are answered here
2. **Enable debug mode** - Add `debug: true` to your configuration
3. **Check browser console** - Look for error messages
4. **Test in multiple browsers** - Verify it's not browser-specific
5. **Check the demo** - Compare your implementation to our working example

### What to Include in Support Requests

- **Browser and version**
- **Your configuration code**
- **Console error messages**
- **Steps to reproduce the issue**
- **Expected vs. actual behavior**

### Community

Join our community of developers building accessible web experiences:

- **Demo:** [View live examples](https://github.com/San-Vibe-Coding-2025/colours-matter)
- **Examples:** See implementation examples in the repository
- **Updates:** Follow the repository for new features and bug fixes

---

## 📊 Examples

### Complete Working Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cividis Theme Example</title>
    
    <!-- Include Cividis Theme CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">
    
    <style>
        body {
            font-family: system-ui, sans-serif;
            background: var(--theme-background);
            color: var(--theme-text);
            margin: 0;
            padding: 2rem;
        }
        
        .hero {
            background: var(--theme-gradient-primary);
            color: white;
            padding: 3rem;
            border-radius: var(--theme-border-radius-lg);
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .card {
            background: var(--theme-surface);
            border: 2px solid var(--theme-border);
            border-radius: var(--theme-border-radius);
            padding: 2rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 16px var(--theme-shadow);
        }
        
        .button {
            background: var(--theme-primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--theme-border-radius);
            cursor: pointer;
            transition: var(--theme-transition);
        }
        
        .button:hover {
            opacity: var(--theme-hover-opacity);
        }
        
        .success { background: var(--theme-success); color: white; padding: 1rem; }
        .warning { background: var(--theme-warning); color: black; padding: 1rem; }
        .info { background: var(--theme-info); color: black; padding: 1rem; }
    </style>
</head>
<body>
    <nav>
        <h1>My Website</h1>
        <!-- CTA button will be automatically inserted here -->
    </nav>
    
    <div class="hero">
        <h1>Welcome to Accessible Design</h1>
        <p>This website uses the Cividis color palette for 100% colorblind accessibility</p>
    </div>
    
    <div class="card">
        <h2>About Our Colors</h2>
        <p>These colors are scientifically designed to be visible to all users, including the 300 million people worldwide with color vision deficiency.</p>
        <button class="button">Learn More</button>
    </div>
    
    <div class="card">
        <h2>Status Messages</h2>
        <div class="success">☑️ Success: Operation completed successfully</div>
        <br>
        <div class="warning">⚠️ Warning: Please review your settings</div>
        <br>
        <div class="info">ℹ️ Info: New features available</div>
    </div>
    
    <!-- Include Cividis Theme Engine -->
    <script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
    
    <script>
        // Optional: Listen for theme events
        window.addEventListener('cividis-theme-applied', (event) => {
            console.log('Cividis theme applied successfully!');
            console.log('Colors:', event.detail.variables);
        });
        
        // Optional: Configure the theme engine
        window.addEventListener('DOMContentLoaded', () => {
            if (window.cividisTheme) {
                window.cividisTheme.updateConfig({
                    debug: true,
                    ctaConfig: {
                        text: 'Try Accessible Colors'
                    }
                });
            }
        });
    </script>
</body>
</html>
```

---

## 🎯 Best Practices

### 1. Always Provide Browser Fallbacks (for legacy browser support only)
```css
.my-element {
    /* Fallback for browsers without CSS variables (legacy support only) */
    background: #00204c;
    /* Theme variable */
    background: var(--theme-primary);
}
```

### 2. Use Semantic Color Names
```css
/* ☑️ Good - semantic naming */
.error-message { background: var(--theme-warning); }
.success-badge { background: var(--theme-success); }

/* ❌ Avoid - color-based naming */
.red-alert { background: var(--theme-warning); }
.green-button { background: var(--theme-success); }
```

### 3. Test with Colorblind Simulators
Use browser extensions or online tools to verify accessibility:
- Colorblinding (Chrome Extension)
- Stark (Figma/Sketch Plugin)
- Coblis Color Blindness Simulator

### 4. Don't Rely Solely on Color
```html
<!-- ☑️ Good - uses color AND icons/text -->
<div class="success-message">
    ☑️ Success: Your changes have been saved
</div>

<!-- ❌ Poor - color only -->
<div class="success-message">
    Your changes have been saved
</div>
```

### 5. Performance Optimization
```javascript
// Load theme engine after critical content
window.addEventListener('DOMContentLoaded', () => {
    // Theme engine initialization
});

// Or use async loading
<script async src="cividis-theme.js"></script>
```

---


**Made with 💙 for the 300 million people worldwide with color vision deficiency.**

*Last updated: September 2025 | Version 1.0*
