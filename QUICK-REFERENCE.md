# IMPORTANT: NO FALLBACKS FOR COLOUR CHANGES

**MUST NOT add fallback to the implementation of the colour changes. If the API fails, log in console but NEVER, EVER use a fallback to change the colours.**

---

# Cividis Theme Engine - Quick Reference

**Version 1.1 | One-page reference for developers**

## 🆕 Recent Updates (v1.1)
- ☑️ CSS Variables: CTA button uses `var(--theme-primary)`, `var(--theme-warning)`
- ☑️ Text Contrast: White text on dark backgrounds, dark text on light backgrounds
- ☑️ New Variables: `--theme-shadow-lg`, `--theme-transition`

---

## 🚀 Quick Setup

```html
<!-- 1. Include CSS -->
<link rel="stylesheet" href="cividis-theme.css">

<!-- 2. Include JS -->
<script src="cividis-theme.js"></script>

<!-- 3. Done! -->
```

---

## 🎨 CSS Variables

```css
/* Core Colors */
--theme-primary: #00204c;    /* Dark Blue */
--theme-secondary: #7f7c75;  /* Yellow */
--theme-accent: #bbaf71;       /* Golden Yellow */
--theme-success: #0a376d;      /* blue gray */
--theme-warning: #ffe945;      /* Bright Yellow */
--theme-info: #37476b;       /* Light Blue */

/* Layout */
--theme-background: #ffffff;
--theme-surface: #f8f9fa;
--theme-text: #1b1b1b;
--theme-text-muted: #353a45;
--theme-border: #e0e0e0;
--theme-shadow: rgba(14, 14, 14, 0.1);
--theme-shadow-lg: rgba(14, 14, 14, 0.2);
--theme-shadow-xl: rgba(14, 14, 14, 0.3);

/* Layout Properties */
--theme-border-radius: 6px;
--theme-border-radius-lg: 12px;
--theme-transition: all 0.3s ease;

/* Gradients */
--theme-gradient-primary: linear-gradient(135deg, var(--theme-success), var(--theme-secondary));
--theme-gradient-accent: linear-gradient(135deg, var(--theme-warning), var(--theme-success));
--theme-gradient-cool: linear-gradient(135deg, var(--theme-primary), var(--theme-warning));
```

---

## 🔌 API Format

Your endpoint should return:

```json
{
    "success": true,
    "colors": {
        "primary": "#00204c",
        "secondary": "#bbaf71",
        "accent": "#7f7c75",
        "success": "#0a376d",
        "warning": "#ffe945",
        "info": "#37476b",
        "background": "#ffffff",
        "text": "#1b1b1b",
        "border": "#e0e0e0"
    }
}
```

---

## ⚙️ Configuration

```javascript
// Basic config
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis',
    debug: true
});

// Advanced config
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://your-api.com/theme',
    retryAttempts: 3,
    retryDelay: 1000,
    ctaConfig: {
        text: 'My Custom Button',
        position: 'top-right',
        gradient: 'linear-gradient(45deg, var(--theme-primary), var(--theme-warning))'
    },
    debug: true
});
```

---

## 📝 Text Color Rules (WCAG Compliant)

```css
/* WHITE text on dark backgrounds */
.bg-primary, .bg-success, .bg-info, .bg-accent { color: white; }

/* THEME-TEXT on light backgrounds */  
.bg-secondary, .bg-warning { color: var(--theme-text); }
```

---

## 🎯 Event Listeners

```javascript
// Theme applied successfully
window.addEventListener('cividis-theme-applied', (event) => {
    console.log('Colors:', event.detail.variables);
});

// CTA button clicked
window.addEventListener('cividis-cta-clicked', () => {
    console.log('Button clicked');
});

// Theme loading error
window.addEventListener('cividis-theme-error', (event) => {
    console.warn('Error:', event.detail.message);
});
```

---

## 🔧 Manual Control

```javascript
// Refresh theme
await window.cividisTheme.refreshTheme();

// Get current colors
const colors = window.cividisTheme.getCurrentTheme();

// Check if loaded
if (window.cividisTheme.isInitialized) {
    // Theme ready
}

// Update config
window.cividisTheme.updateConfig({ debug: true });
```

---

## 💡 CSS Usage Examples

```css
/* Buttons */
.btn-primary {
    background: var(--theme-primary);
    color: var(--theme-background);
}

/* Cards */
.card {
    background: var(--theme-surface);
    border: 1px solid var(--theme-border);
    color: var(--theme-text);
}

/* Gradients */
.hero {
    background: var(--theme-gradient-primary);
}

/* States */
.success { background: var(--theme-success); }
.warning { background: var(--theme-warning); }
.info { background: var(--theme-info); }
```

---

## 🐛 Debug Commands

```javascript
// Enable debug mode
window.cividisTheme.updateConfig({ debug: true });

// Check config
console.log(window.cividisTheme.config);

// Check current theme
console.log(window.cividisTheme.getCurrentTheme());

// Check CSS variable
console.log(getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-primary'));

// Manual refresh
window.cividisTheme.refreshTheme();
```

---

## 🌐 CDN Links

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
```

---

## 📱 Browser Support

☑️ Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+  
⚠️ IE11 (needs CSS variables polyfill)

---

## 🎯 Best Practices

1. **Always provide fallbacks:**
   ```css
   background: #00204c;  /* fallback */
   background: var(--theme-primary);
   ```

2. **Use semantic naming:**
   ```css
   .success-msg { background: var(--theme-success); }
   ```

3. **Don't rely on color alone:**
   ```html
   ☑️ Success: Operation completed
   ```

4. **Test with colorblind simulators**

5. **Enable debug mode during development**

---

## 📞 Support

**Email:** team@coloursmatter.co.uk  
**GitHub:** [colours-matter](https://github.com/San-Vibe-Coding-2025/colours-matter)  
**Issues:** [Report bugs](https://github.com/San-Vibe-Coding-2025/colours-matter/issues)

---

**🎨 Making the web accessible to 300M+ people with colorblindness**
