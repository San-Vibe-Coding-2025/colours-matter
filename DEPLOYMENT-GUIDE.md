# Cividis Theme Engine - Deployment Guide

**Complete guide for deploying and distributing the Cividis Theme Engine**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Distribution Methods](#distribution-methods)
- [CDN Deployment](#cdn-deployment)
- [npm Package Publishing](#npm-package-publishing)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [API Server Deployment](#api-server-deployment)
- [Integration Examples](#integration-examples)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Cividis Theme Engine can be distributed in multiple ways to make it accessible to developers worldwide:

1. **CDN Distribution** - Global content delivery network
2. **npm Package** - Node.js package manager
3. **Self-Hosted Files** - Direct file hosting
4. **API Service** - Centralized theme service

---

## 🚀 Distribution Methods

### 1. CDN Deployment (Recommended)

**Benefits:**
- ⚡ Fast global delivery
- 📈 Automatic scaling
- 💰 Cost-effective
- 🔒 SSL by default

**Popular CDN Options:**

#### jsDelivr (Free)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
```

#### unpkg (npm-based)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/cividis-theme@latest/cividis-theme.css">

<!-- JavaScript -->
<script src="https://unpkg.com/cividis-theme@latest/cividis-theme.js"></script>
```

#### Cloudflare CDN
```html
<!-- Custom domain -->
<link rel="stylesheet" href="https://themes.coloursmatter.co.uk/cividis-theme.css">
<script src="https://themes.coloursmatter.co.uk/cividis-theme.js"></script>
```

---

### 2. npm Package Publishing

#### Step 1: Prepare Package

Create `package.json`:
```json
{
  "name": "cividis-theme",
  "version": "1.0.0",
  "description": "Colorblind-friendly theme engine using the Cividis color palette",
  "main": "cividis-theme.js",
  "files": [
    "cividis-theme.js",
    "cividis-theme.css",
    "README.md"
  ],
  "keywords": [
    "theme",
    "css",
    "accessibility",
    "colorblind",
    "cividis",
    "javascript"
  ],
  "author": "Colours Matter <team@coloursmatter.co.uk>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/San-Vibe-Coding-2025/colours-matter.git"
  },
  "homepage": "https://github.com/San-Vibe-Coding-2025/colours-matter",
  "bugs": {
    "url": "https://github.com/San-Vibe-Coding-2025/colours-matter/issues"
  }
}
```

#### Step 2: Publish to npm

```bash
# Login to npm
npm login

# Publish package
npm publish

# Update version and republish
npm version patch
npm publish
```

#### Step 3: User Installation

```bash
# Install via npm
npm install cividis-theme

# Install via yarn
yarn add cividis-theme
```

---

### 3. Self-Hosted Deployment

#### Option A: GitHub Pages (Free)

1. **Enable GitHub Pages:**
   - Go to Repository Settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose "main" branch

2. **Access files at:**
   ```
   https://san-vibe-coding-2025.github.io/colours-matter/cividis-theme.css
   https://san-vibe-coding-2025.github.io/colours-matter/cividis-theme.js
   ```

#### Option B: Netlify (Free tier available)

1. **Connect repository to Netlify**
2. **Build settings:**
   ```
   Build command: (leave empty)
   Publish directory: /
   ```
3. **Custom domain:** `themes.coloursmatter.co.uk`

#### Option C: Vercel (Free tier available)

1. **Connect GitHub repository**
2. **Deploy automatically on push**
3. **Custom domain setup available**

---

## 🖥️ API Server Deployment

### Cloud Deployment Options

#### 1. Vercel (Recommended for Node.js)

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api-server.js"
    }
  ]
}
```

**Deploy:**
```bash
npm install -g vercel
vercel --prod
```

#### 2. Heroku

**Procfile:**
```
web: node api-server.js
```

**Deploy:**
```bash
heroku create cividis-theme-api
git push heroku main
```

#### 3. Railway

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node api-server.js"
  }
}
```

#### 4. DigitalOcean App Platform

**app.yaml:**
```yaml
name: cividis-theme-api
services:
- name: api
  source_dir: /
  github:
    repo: San-Vibe-Coding-2025/colours-matter
    branch: main
  run_command: node api-server.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 8080
```

---

## 🔗 Integration Examples

### Basic HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <!-- Cividis Theme Engine -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My Site</h1>
        <button class="btn" style="background: var(--theme-primary); color: white;">
            Primary Button
        </button>
    </div>
    
    <script src="https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js"></script>
    <script>
        // Configure your API endpoint
        window.CividisTheme.updateConfig({
            apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis'
        });
    </script>
</body>
</html>
```

### React Integration

```jsx
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js';
    script.onload = () => {
      window.CividisTheme.updateConfig({
  apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis'
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="App">
      <h1>My React App</h1>
      <button style={{ 
        background: 'var(--theme-primary)', 
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px'
      }}>
        Primary Button
      </button>
    </div>
  );
}

export default App;
```

### WordPress Integration

**functions.php:**
```php
function enqueue_cividis_theme() {
    // Enqueue CSS
    wp_enqueue_style(
        'cividis-theme-css',
        'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.css'
    );
    
    // Enqueue JS
    wp_enqueue_script(
        'cividis-theme-js',
        'https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js',
        array(),
        '1.0',
        true
    );
    
    // Configure API endpoint
    wp_add_inline_script('cividis-theme-js', '
        window.addEventListener("DOMContentLoaded", function() {
            if (window.CividisTheme) {
                window.CividisTheme.updateConfig({
                    apiEndpoint: "' . get_site_url() . '/wp-json/cividis/v1/theme"
                });
            }
        });
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_cividis_theme');
```

---

## 📊 Monitoring & Analytics

### Usage Analytics

**Track integration usage:**
```javascript
// Add to cividis-theme.js
class CividisTheme {
    constructor() {
        // ... existing code ...
        this.trackUsage();
    }
    
    trackUsage() {
        // Simple analytics
        fetch('https://api.coloursmatter.co.uk/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                domain: window.location.hostname,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            })
        }).catch(() => {}); // Silent fail
    }
}
```

### Performance Monitoring

**Monitor load times:**
```javascript
// Track performance
window.addEventListener('Cividis-theme-applied', () => {
    const perfData = performance.getEntriesByName('Cividis-theme-load');
    if (perfData.length > 0) {
        console.log('Theme load time:', perfData[0].duration + 'ms');
    }
});
```

---

## 🚨 Version Management

### Semantic Versioning

```
1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features (backward compatible)
2.0.0 - Breaking changes
```

### Release Process

1. **Update version in package.json**
2. **Create GitHub release tag**
3. **Update CDN links in documentation**
4. **Publish to npm**
5. **Update changelog**

---

## 🔒 Security Considerations

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
        script-src 'self' https://cdn.jsdelivr.net;
  connect-src 'self' https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app;
      ">
```

### API Rate Limiting

```javascript
// Add rate limiting to API server
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🎯 Marketing & Distribution

### Developer Outreach

1. **Submit to directories:**
   - [cdnjs.com](https://cdnjs.com)
   - [jsdelivr.com](https://jsdelivr.com)
   - [unpkg.com](https://unpkg.com)

2. **Community engagement:**
   - Dev.to articles
   - Reddit r/webdev
   - Twitter/X announcements
   - Stack Overflow answers

3. **Documentation sites:**
   - Update README.md
   - Create GitHub Wiki
   - Write blog posts

### Integration Partners

**Reach out to:**
- CSS framework maintainers
- WordPress theme developers
- React component libraries
- Accessibility organizations

---

## 🐛 Troubleshooting Deployment

### Common Issues

**CDN Cache Issues:**
```bash
# Force CDN refresh (jsDelivr)
https://cdn.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js?v=123

# Purge cache
curl -X POST https://purge.jsdelivr.net/gh/San-Vibe-Coding-2025/colours-matter@main/cividis-theme.js
```

**CORS Issues:**
```javascript
// Add to API server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

**SSL Certificate Issues:**
- Ensure HTTPS for all CDN links
- Use Let's Encrypt for custom domains
- Check certificate expiration dates

---

## 📈 Scaling Considerations

### High Traffic Scenarios

1. **Use multiple CDNs**
2. **Implement fallback URLs**
3. **Cache API responses**
4. **Consider serverless functions**

### Global Distribution

```javascript
// Geo-distributed API endpoints
const apiEndpoints = {
    'us': 'https://us-api.coloursmatter.co.uk',
    'eu': 'https://eu-api.coloursmatter.co.uk',
    'asia': 'https://asia-api.coloursmatter.co.uk'
};

// Auto-select based on user location
const getOptimalEndpoint = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('America')) return apiEndpoints.us;
    if (timezone.includes('Europe')) return apiEndpoints.eu;
    return apiEndpoints.asia;
};
```

---

## 📞 Support & Maintenance

**Documentation:** Keep all docs updated  
**Issues:** Monitor GitHub issues daily  
**Updates:** Regular security and feature updates  
**Community:** Engage with users and contributors

**Contact:** team@coloursmatter.co.uk  
**Repository:** [colours-matter](https://github.com/San-Vibe-Coding-2025/colours-matter)

---

# IMPORTANT: NO FALLBACKS FOR COLOUR CHANGES

**MUST NOT add fallback to the implementation of the colour changes. If the API fails, log in console but NEVER, EVER use a fallback to change the colours.**

---

**🌍 Making colorblind-friendly themes accessible to developers worldwide**
