# Cividis Theme Engine - Quick Reference

**One-page reference for developers**

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
--theme-primary: #00204c;    /* Forest Green */
--theme-secondary: #ccbb68;  /* Teal */
--theme-accent: #64676f;     /* Aqua Teal */
--theme-success: #0a376d;    /* Cyan */
--theme-warning: #ffe945;    /* Golden Yellow */
--theme-info: #37476b;       /* Amber */

/* Layout */
--theme-background: #ffffff;
--theme-surface: #f8f9fa;
--theme-text: #333333;
--theme-text-muted: #6c757d;
--theme-border: #e0e0e0;

/* Gradients */
--theme-gradient-primary: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
--theme-gradient-accent: linear-gradient(135deg, var(--theme-accent), var(--theme-success));
--theme-gradient-warm: linear-gradient(135deg, var(--theme-warning), var(--theme-info));
```

---

## 🔌 API Format

Your endpoint should return:

```json
{
    "success": true,
    "colors": {
        "primary": "#00204c",
        "secondary": "#ccbb68",
        "accent": "#64676f",
        "success": "#0a376d",
        "warning": "#ffe945",
        "info": "#37476b",
        "background": "#ffffff",
        "text": "#333333",
        "border": "#e0e0e0"
    }
}
```

---

## ⚙️ Configuration

```javascript
// Basic config
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://your-api.com/theme',
    debug: true
});

// Advanced config
window.cividisTheme.updateConfig({
    apiEndpoint: 'https://your-api.com/theme',
    retryAttempts: 3,
    retryDelay: 1000,
    ctaConfig: {
        text: 'My Custom Button',
        position: 'top-right'
    },
    debug: true
});
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

✅ Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+  
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
   ✅ Success: Operation completed
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
