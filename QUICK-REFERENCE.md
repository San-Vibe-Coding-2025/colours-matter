# Cividis Theme Engine - Quick Reference

**One-page reference for developers**

---

## 🚀 Quick Setup

```html
<!-- 1. Include CSS -->
<link rel="stylesheet" href="viridis-theme.css">

<!-- 2. Include JS -->
<script src="viridis-theme.js"></script>

<!-- 3. Done! -->
```

---

## 🎨 CSS Variables

```css
/* Core Colors */
--theme-primary: #3C873D;    /* Forest Green */
--theme-secondary: #2EBD91;  /* Teal */
--theme-accent: #16D8BA;     /* Aqua Teal */
--theme-success: #4DF9FF;    /* Cyan */
--theme-warning: #FCE34F;    /* Golden Yellow */
--theme-info: #F7CB17;       /* Amber */

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
        "primary": "#3C873D",
        "secondary": "#2EBD91",
        "accent": "#16D8BA",
        "success": "#4DF9FF",
        "warning": "#FCE34F",
        "info": "#F7CB17",
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
window.viridisTheme.updateConfig({
    apiEndpoint: 'https://your-api.com/theme',
    debug: true
});

// Advanced config
window.viridisTheme.updateConfig({
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
window.addEventListener('viridis-theme-applied', (event) => {
    console.log('Colors:', event.detail.variables);
});

// CTA button clicked
window.addEventListener('viridis-cta-clicked', () => {
    console.log('Button clicked');
});

// Theme loading error
window.addEventListener('viridis-theme-error', (event) => {
    console.warn('Error:', event.detail.message);
});
```

---

## 🔧 Manual Control

```javascript
// Refresh theme
await window.viridisTheme.refreshTheme();

// Get current colors
const colors = window.viridisTheme.getCurrentTheme();

// Check if loaded
if (window.viridisTheme.isInitialized) {
    // Theme ready
}

// Update config
window.viridisTheme.updateConfig({ debug: true });
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
window.viridisTheme.updateConfig({ debug: true });

// Check config
console.log(window.viridisTheme.config);

// Check current theme
console.log(window.viridisTheme.getCurrentTheme());

// Check CSS variable
console.log(getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-primary'));

// Manual refresh
window.viridisTheme.refreshTheme();
```

---

## 🌐 CDN Links

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cividis-theme@1.0.0/viridis-theme.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/cividis-theme@1.0.0/viridis-theme.js"></script>
```

---

## 📱 Browser Support

✅ Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+  
⚠️ IE11 (needs CSS variables polyfill)

---

## 🎯 Best Practices

1. **Always provide fallbacks:**
   ```css
   background: #3C873D;  /* fallback */
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