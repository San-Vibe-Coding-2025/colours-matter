/**
 * Cividis Theme Engine
 * A pluggable JavaScript theming tool for dynamic CSS variable management
 * 
 * Features:
 * - Fetches theme data from REST API
 * - Dynamically updates CSS variables on :root
 * - Adds CTA button to website header
 * - Error handling (no fallback)
 * - Single script inclusion
 */

class CividisTheme {
    constructor(config = {}) {
        this.config = {
            apiEndpoint: config.apiEndpoint || 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis',
            ctaConfig: {
                text: 'Cividis Theme',
                position: 'header', // 'header', 'top-right', 'bottom-right'
                gradient: 'var(--theme-gradient-cool)',
                textColor: '#ffffffff'
            },
            // Retry, but absolutely no fallback color logic
            retryAttempts: typeof config.retryAttempts === 'number' ? config.retryAttempts : 3,
            retryDelay: typeof config.retryDelay === 'number' ? config.retryDelay : 1000,
            debug: config.debug || false,
            intelligentMapping: config.intelligentMapping !== false, // Enabled by default
            ...config
        };

        this.isInitialized = false;
        this.currentTheme = null;
        this.ctaButton = null;
        this.detectedColors = null;
        
        this.init();
    }

    /**
     * Analyze website colors and create intelligent mapping
     */
    async analyzeWebsiteColors() {
        this.log('Analyzing website colors for intelligent mapping...');
        
        try {
            const colorUsage = new Map();
            
            // Get a sample of elements for performance (not every single element)
            const allElements = document.querySelectorAll('*');
            const sampleSize = Math.min(1000, allElements.length); // Limit to 1000 elements max
            const elements = Array.from(allElements).slice(0, sampleSize);
            
            this.log(`Analyzing ${elements.length} elements (sample of ${allElements.length} total)`);
            
            // Analyze sample elements for color usage
            elements.forEach(element => {
                try {
                    const styles = window.getComputedStyle(element);
                    
                    // Check background colors
                    const bgColor = styles.backgroundColor;
                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                        const normalizedBg = this.normalizeColorForDetection(bgColor);
                        if (normalizedBg && !this.isNeutralColor(normalizedBg)) {
                            colorUsage.set(normalizedBg, (colorUsage.get(normalizedBg) || 0) + 1);
                        }
                    }
                    
                    // Check text colors
                    const textColor = styles.color;
                    if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
                        const normalizedText = this.normalizeColorForDetection(textColor);
                        if (normalizedText && !this.isNeutralColor(normalizedText)) {
                            colorUsage.set(normalizedText, (colorUsage.get(normalizedText) || 0) + 1);
                        }
                    }
                    
                    // Check border colors (only if not default)
                    const borderColor = styles.borderColor;
                    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== styles.color) {
                        const normalizedBorder = this.normalizeColorForDetection(borderColor);
                        if (normalizedBorder && !this.isNeutralColor(normalizedBorder)) {
                            colorUsage.set(normalizedBorder, (colorUsage.get(normalizedBorder) || 0) + 1);
                        }
                    }
                } catch (elementError) {
                    // Skip problematic elements silently
                }
            });
            
            // Sort colors by usage frequency (minimum 2 occurrences to be considered)
            const sortedColors = Array.from(colorUsage.entries())
                .filter(([, count]) => count >= 2) // Must appear at least twice
                .sort(([,a], [,b]) => b - a)
                .map(([color, count]) => ({ color, count }));
            
            this.log(`Detected ${sortedColors.length} significant brand colors:`, sortedColors);
            
            // Only proceed if we found meaningful colors
            if (sortedColors.length === 0) {
                this.log('No significant brand colors detected.');
                return null;
            }
            
            // Create intelligent mapping
            const mapping = this.createIntelligentMapping(sortedColors.map(c => c.color));
            this.detectedColors = { colors: sortedColors, mapping };
            
            return mapping;
            
        } catch (error) {
            this.log('Color analysis failed:', error.message);
            return null;
        }
    }
    
    /**
     * Create intelligent mapping from detected colors to Cividis palette
     */
    createIntelligentMapping(detectedColors) {
        const cividisColors = [
            { key: 'primary', color: '#00204c', priority: 1 },
            { key: 'secondary', color: '#7f7c75', priority: 2 }, 
            { key: 'accent', color: '#bbaf71', priority: 3 },
            { key: 'success', color: '#0a376d', priority: 4 },
            { key: 'warning', color: '#ffe945', priority: 5 },
            { key: 'info', color: '#37476b', priority: 6 }
        ];
        
        const mapping = {};
        
        // Map most used colors to primary Cividis colors
        for (let i = 0; i < Math.min(detectedColors.length, 6); i++) {
            const detectedColor = detectedColors[i];
            const cividisColor = cividisColors[i];
            mapping[`--theme-${cividisColor.key}`] = cividisColor.color;
            
            this.log(`Mapping rank ${i+1} color ${detectedColor} → --theme-${cividisColor.key} (${cividisColor.color})`);
        }
        
        // Handle extra colors (7+) by cycling through info, accent, secondary
        if (detectedColors.length > 6) {
            const extraColors = detectedColors.slice(6);
            const extraTargets = ['info', 'accent', 'secondary']; // Priority targets for extra colors
            
            extraColors.forEach((color, index) => {
                const targetKey = extraTargets[index % extraTargets.length];
                const cividisColor = cividisColors.find(c => c.key === targetKey);
                
                this.log(`Extra color ${index + 7}: ${color} → --theme-${targetKey} (${cividisColor.color})`);
                mapping[`--theme-${targetKey}`] = cividisColor.color;
            });
        }
        
        // Always include neutral colors
        mapping['--theme-background'] = '#ffffff';
        mapping['--theme-surface'] = '#f8f9fa';
        mapping['--theme-text'] = '#1b1b1b';
        mapping['--theme-text-muted'] = '#353a45';
        mapping['--theme-border'] = '#e0e0e0';
        
        return mapping;
    }
    
    /**
     * Normalize color for detection (convert to hex)
     */
    normalizeColorForDetection(colorString) {
        if (!colorString) return null;
        
        // Handle rgb/rgba
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbMatch) {
            const [, r, g, b, a] = rgbMatch;
            // Skip transparent or very transparent colors
            if (a && parseFloat(a) < 0.1) return null;
            
            return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
        }
        
        // Handle hex colors
        if (colorString.startsWith('#')) {
            return colorString.toLowerCase();
        }
        
        // Handle named colors (basic support)
        const namedColors = {
            'white': '#ffffff',
            'black': '#000000',
            'red': '#ff0000',
            'green': '#008000',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'purple': '#800080',
            'orange': '#ffa500'
        };
        
        return namedColors[colorString.toLowerCase()] || null;
    }
    
    /**
     * Check if color is neutral (should be ignored for brand mapping)
     */
    isNeutralColor(color) {
        const neutrals = [
            '#ffffff', '#000000', // Pure white/black
            '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', // Bootstrap grays
            '#6c757d', '#495057', '#343a40', '#212529', // Bootstrap darker grays
            '#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', // Near whites
            '#010101', '#020202', '#030303', '#040404'  // Near blacks
        ];
        
        return neutrals.includes(color.toLowerCase());
    }

    /**
     * Initialize the theme engine
     */
    async init() {
        try {
            this.log('Initializing Cividis Theme Engine...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                await this.start();
            }
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    /**
     * Start the theme engine
     */
    async start() {
        try {
            // No fallback theme is applied. Only apply theme if API succeeds.
            
            // Analyze website colors for intelligent mapping (if enabled)
            if (this.config.intelligentMapping) {
                const intelligentMapping = await this.analyzeWebsiteColors();
                
                // If we have intelligent mapping, use it (never fallback)
                if (intelligentMapping) {
                    this.log('Applying intelligent color mapping based on website analysis');
                    this.applyTheme(intelligentMapping);
                }
            }
            
            // Create CTA button
            this.createCTAButton();
            
            // Fetch and apply remote theme (this will override with API colors if available)
            await this.fetchAndApplyTheme();
            
            this.isInitialized = true;
            this.log('Cividis Theme Engine initialized successfully');
            
        } catch (error) {
            this.handleError('Startup failed', error);
        }
    }

    /**
     * Fetch theme data from API with retry logic
     */
    async fetchThemeData() {
        let attempt = 0;
        let lastError = null;
        const maxAttempts = this.config.retryAttempts || 3;
        const delay = this.config.retryDelay || 1000;
        while (attempt < maxAttempts) {
            try {
                this.log(`Fetching theme data... (attempt ${attempt + 1} of ${maxAttempts})`);
                const response = await fetch(this.config.apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                this.validateThemeData(data);
                return data;
            } catch (error) {
                lastError = error;
                this.log(`Theme fetch failed (attempt ${attempt + 1}):`, error.message);
                if (attempt < maxAttempts - 1) {
                    await new Promise(res => setTimeout(res, delay));
                }
            }
            attempt++;
        }
        this.log('All theme fetch attempts failed. No fallback color will be applied.');
        throw lastError;
    }

    /**
     * Validate theme data structure
     */
    validateThemeData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid theme data: must be an object');
        }

        if (!data.colors || typeof data.colors !== 'object') {
            throw new Error('Invalid theme data: colors object required');
        }

        // Validate required color properties
        const requiredColors = ['primary', 'secondary', 'accent'];
        for (const color of requiredColors) {
            if (!data.colors[color]) {
                this.log(`Warning: Missing required color '${color}'`);
            }
        }
    }

    /**
     * Fetch and apply theme from API
     */
    async fetchAndApplyTheme() {
        try {
            const themeData = await this.fetchThemeData();
            const cssVariables = this.transformToCSSVariables(themeData.colors);
            
            this.applyTheme(cssVariables);
            
            // Apply styling rules if they exist
            if (themeData.styling_rules) {
                this.applyStylingRules(themeData.styling_rules);
            }
            
            this.currentTheme = themeData;
            
            this.log('Remote theme applied successfully');
            
        } catch (error) {
            this.handleError('Failed to fetch remote theme (no fallback, API required)', error);
        }
    }

    /**
     * Transform theme colors to CSS variables
     */
    transformToCSSVariables(colors) {
    const cssVars = {};

        // Map API colors to CSS variables
        const colorMap = {
            primary: '--theme-primary',
            secondary: '--theme-secondary',
            accent: '--theme-accent',
            success: '--theme-success',
            warning: '--theme-warning',
            info: '--theme-info',
            background: '--theme-background',
            text: '--theme-text',
            border: '--theme-border'
        };

        for (const [apiKey, cssVar] of Object.entries(colorMap)) {
            if (colors[apiKey]) {
                cssVars[cssVar] = this.normalizeColor(colors[apiKey]);
            }
        }

        return cssVars;
    }

    /**
     * Normalize color format (ensure hex format with #)
     */
    normalizeColor(color) {
        if (typeof color !== 'string') {
            return color;
        }
        
        // Remove whitespace
        color = color.trim();
        
        // Add # if missing for hex colors
        if (/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(color)) {
            return `#${color}`;
        }
        
        return color;
    }

    /**
     * Determine if the script is running on a local/dev origin
     * (localhost, 127.0.0.1, or common private LAN ranges)
     */
    isLocalOrigin() {
        try {
            const host = window.location.hostname;
            if (!host) return false;
            if (host === 'localhost' || host === '127.0.0.1') return true;
            if (/^192\.168\./.test(host)) return true;
            if (/^10\./.test(host)) return true;
            // 172.16.0.0 — 172.31.255.255
            if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true;
            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * Given a CSS background value (hex, rgb or var(...)), return a readable
    * contrasting text color (#000 or #fff or --theme-text).
     */
    getContrastTextColor(bgValue) {
        try {
            // Create a temporary element to resolve computed color if needed
            const temp = document.createElement('div');
            temp.style.position = 'absolute';
            temp.style.left = '-9999px';
            temp.style.background = bgValue;
            document.body.appendChild(temp);

            const computed = window.getComputedStyle(temp).backgroundColor;
            document.body.removeChild(temp);

            // Parse rgb/rgba
            const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (!m) return 'var(--theme-text)';

            const r = parseInt(m[1], 10);
            const g = parseInt(m[2], 10);
            const b = parseInt(m[3], 10);

            // Calculate relative luminance
            const srgb = [r, g, b].map(v => v / 255).map(v => {
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];

            // WCAG contrast threshold: use dark text for light backgrounds
            return luminance > 0.5 ? 'var(--theme-text, #1b1b1b)' : '#ffffff';
        } catch (e) {
            return 'var(--theme-text)';
        }
    }

    /**
     * Apply theme variables to :root element
     */
    applyTheme(cssVariables) {
        const root = document.documentElement;
        
        for (const [variable, value] of Object.entries(cssVariables)) {
            root.style.setProperty(variable, value);
            this.log(`Applied: ${variable} = ${value}`);
        }

        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('cividis-theme-applied', {
            detail: { variables: cssVariables }
        }));
        
        // Re-apply CTA button styles after theme variables are updated
        this.reapplyCTAGradient();
    }

    /**
     * Re-apply CTA gradient after theme updates
     */
    reapplyCTAGradient() {
        if (this.ctaButton) {
            // Force update the gradient with current CSS variables
            this.ctaButton.style.setProperty('background', this.config.ctaConfig.gradient, 'important');
            this.ctaButton.style.setProperty('color', this.config.ctaConfig.textColor || '#ffffffff', 'important');
            this.log('CTA gradient re-applied');
        }
    }

    /**
     * Apply styling rules from API
     */
    applyStylingRules(stylingRules) {
        this.log('Applying styling rules from API');
        
        // Handle warning container styling
        if (stylingRules.warning_container) {
            this.applyWarningContainerStyling(stylingRules.warning_container);
        }

        // Handle secondary container styling
        if (stylingRules.secondary_container) {
            this.applySecondaryContainerStyling(stylingRules.secondary_container);
        }

        // Add more styling rule handlers here as needed
        // if (stylingRules.info_container) {
        //     this.applyInfoContainerStyling(stylingRules.info_container);
        // }
        
        this.log('Styling rules applied successfully');
    }

    /**
     * Apply warning container styling rule
     */
    applyWarningContainerStyling(warningRule) {
        // Create or update CSS style element for warning containers
        let styleElement = document.getElementById('cividis-warning-styles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'cividis-warning-styles';
            document.head.appendChild(styleElement);
        }

        const css = `
            /* Warning text container styling - dynamically applied */
            *:has(> [style*="color: var(--theme-warning)"]:not([style*="background"])):not(#cividis-cta-button):not(:has(#cividis-cta-button)), 
            *:has(> .text-warning):not([style*="background"]):not(#cividis-cta-button):not(:has(#cividis-cta-button)) {
                background: ${warningRule.background} !important;
            }
            
            *:has(> [style*="color: var(--theme-warning)"]:not([style*="background"])):not(#cividis-cta-button):not(:has(#cividis-cta-button)) *:not([style*="background"]):not(#cividis-cta-button), 
            *:has(> .text-warning):not([style*="background"]):not(#cividis-cta-button):not(:has(#cividis-cta-button)) *:not([style*="background"]):not(#cividis-cta-button) {
                color: ${warningRule.text_color} !important;
            }
            
            /* Alternative selector for containers with warning text */
            .warning-text-container:not(:has(#cividis-cta-button)) {
                background: ${warningRule.background} !important;
            }
            
            .warning-text-container:not(:has(#cividis-cta-button)) *:not(#cividis-cta-button) {
                color: ${warningRule.text_color} !important;
            }
            
            /* Ensure CTA button gradient and text are preserved */
            #cividis-cta-button {
                background: var(--theme-gradient-cool) !important;
                color: #ffffffff !important;
            }
        `;

        styleElement.textContent = css;
        this.log(`Applied warning container styling: bg=${warningRule.background}, text=${warningRule.text_color}`);
    }

    /**
     * Apply secondary container styling rule
     */
    applySecondaryContainerStyling(secondaryRule) {
        // Create or update CSS style element for secondary containers
        let styleElement = document.getElementById('cividis-secondary-styles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'cividis-secondary-styles';
            document.head.appendChild(styleElement);
        }

        const css = `
            /* GLOBAL secondary text styling - works on ALL pages */
            
            /* Target any element that contains secondary color text */
            *:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            *:has(.text-secondary):not(#cividis-cta-button),
            .secondary-text-container:not(#cividis-cta-button),
            
            /* More aggressive selectors for deep nesting */
            body *:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            body *:has(.text-secondary):not(#cividis-cta-button),
            
            /* Target parent containers */
            section:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            div:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            article:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            main:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            header:has([style*="--theme-secondary"]):not(#cividis-cta-button),
            footer:has([style*="--theme-secondary"]):not(#cividis-cta-button) {
                background: ${secondaryRule.background} !important;
                border-radius: var(--theme-border-radius) !important;
                padding: 1rem !important;
                margin: 0.5rem 0 !important;
            }
            
            /* Make ALL text white in containers with secondary color */
            *:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            *:has(.text-secondary) *:not(#cividis-cta-button),
            .secondary-text-container *:not(#cividis-cta-button),
            
            body *:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            body *:has(.text-secondary) *:not(#cividis-cta-button),
            
            section:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            div:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            article:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            main:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            header:has([style*="--theme-secondary"]) *:not(#cividis-cta-button),
            footer:has([style*="--theme-secondary"]) *:not(#cividis-cta-button) {
                color: ${secondaryRule.text_color} !important;
            }
            
            /* Ensure CTA button is never affected */
            #cividis-cta-button {
                background: var(--theme-gradient-cool) !important;
                color: #ffffffff !important;
            }
        `;

        styleElement.textContent = css;
        this.log(`Applied secondary container styling: bg=${secondaryRule.background}, text=${secondaryRule.text_color}`);
    }

    /**
     * Create CTA button for theme activation
     */
    createCTAButton() {
        this.log('Creating CTA button...');
        
        // Remove existing CTA if present
        if (this.ctaButton) {
            this.ctaButton.remove();
            this.log('Removed existing CTA button');
        }

        // Create button element
        this.ctaButton = document.createElement('button');
        this.ctaButton.id = 'cividis-cta-button';
        this.ctaButton.textContent = this.config.ctaConfig.text;
        this.ctaButton.setAttribute('aria-label', 'Activate Cividis Theme');
        
        this.log('CTA button element created with text:', this.config.ctaConfig.text);
        
        // Apply styles
        this.applyCTAStyles();
        
        // Add click handler
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick();
            });
        }

        // Insert into DOM
        this.insertCTAButton();
        
        // Add window resize listener to keep CTA aligned with container
        this.addResizeListener();
        
        this.log('CTA button created and inserted successfully');
    }

    /**
     * Apply styles to CTA button
     */
    applyCTAStyles() {
        // First, detect the main container and its width constraints
        const mainContainer = this.detectMainContainer();
        const containerWidth = this.getContainerWidth(mainContainer);
        
        const styles = {
            background: this.config.ctaConfig.gradient,
            color: this.config.ctaConfig.textColor || '#ffffffff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 'var(--theme-border-radius)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: 'var(--theme-shadow)',
            transition: 'var(--theme-transition)',
            zIndex: '9999',
            fontFamily: 'inherit',
            textDecoration: 'none',
            display: 'inline-block',
            margin: '0 8px',
            // Responsive width based on container
            maxWidth: containerWidth ? `${Math.min(160, containerWidth * 0.12)}px` : '160px',
            minWidth: '100px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        };

        Object.assign(this.ctaButton.style, styles);
        
        // Force the gradient and text color with !important using setProperty
        this.ctaButton.style.setProperty('background', this.config.ctaConfig.gradient, 'important');
        this.ctaButton.style.setProperty('color', this.config.ctaConfig.textColor || '#ffffffff', 'important');

        // Add hover effects
        if (this.ctaButton) {
            this.ctaButton.addEventListener('mouseenter', () => {
                this.ctaButton.style.transform = 'translateY(-2px)';
                this.ctaButton.style.boxShadow = 'var(--theme-shadow-lg)';
            });
            this.ctaButton.addEventListener('mouseleave', () => {
                this.ctaButton.style.transform = 'translateY(0)';
                this.ctaButton.style.boxShadow = 'var(--theme-shadow)';
            });
        }
    }

    /**
     * Detect the main content container on the page
     */
    detectMainContainer() {
        // Try common main container selectors in order of preference
        const selectors = [
            'main',
            '.main',
            '#main',
            '.container',
            '.main-content', 
            '.content',
            '.wrapper',
            '.page-wrapper',
            '.site-content',
            'body > div:first-of-type', // Often the main wrapper
            'body'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetWidth > 0) {
                this.log(`Main container detected: ${selector} (width: ${element.offsetWidth}px)`);
                return element;
            }
        }
        
        this.log('No suitable main container found, using body');
        return document.body;
    }

    /**
     * Get the effective width of the container for responsive sizing
     */
    getContainerWidth(container) {
        if (!container) return null;
        
        // Get computed styles
        const computedStyle = window.getComputedStyle(container);
        const width = container.offsetWidth;
        const maxWidth = parseInt(computedStyle.maxWidth) || width;
        
        // Use the smaller of actual width or max-width
        const effectiveWidth = Math.min(width, maxWidth);
        
        this.log(`Container width: ${width}px, max-width: ${computedStyle.maxWidth}, effective: ${effectiveWidth}px`);
        return effectiveWidth;
    }

    /**
     * Add window resize listener to keep CTA button responsive
     */
    addResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
        
        this.resizeListener = () => {
            if (this.ctaButton) {
                // Re-detect container and update CTA sizing
                const mainContainer = this.detectMainContainer();
                const containerWidth = this.getContainerWidth(mainContainer);
                
                if (containerWidth) {
                    const newMaxWidth = Math.min(160, containerWidth * 0.12);
                    this.ctaButton.style.setProperty('max-width', `${newMaxWidth}px`, 'important');
                    this.log(`CTA button resized: max-width = ${newMaxWidth}px`);
                }
            }
        };
        
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('resize', this.resizeListener);
        }
        this.log('Resize listener added for CTA button responsiveness');
    }

    /**
     * Insert CTA button into DOM
     */
    insertCTAButton() {
        this.log('Attempting to insert CTA button...');
        const position = this.config.ctaConfig.position;
        let targetElement = null;

        // Try to find header element with expanded selectors
        const headerSelectors = [
            'header', '.header', '#header', 
            'nav', '.navbar', '.nav', '.navigation',
            '[role="banner"]', '[role="navigation"]',
            '.top-nav', '.main-nav', '.primary-nav',
            '.site-header', '.page-header',
            'header nav', 'nav ul', '.menu'
        ];
        
        for (const selector of headerSelectors) {
            try {
                targetElement = document.querySelector(selector);
                if (targetElement && targetElement.offsetParent !== null) { // Visible element
                    this.log(`Found target element with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Skip invalid selectors
                continue;
            }
        }

        if (targetElement && position === 'header') {
            try {
                // Try to insert into the most appropriate location within the header
                const bestLocation = this.findBestInsertionPoint(targetElement);
                bestLocation.appendChild(this.ctaButton);
                this.log('CTA button inserted into header element');
            } catch (insertError) {
                this.log('Failed to insert into header, falling back to floating:', insertError.message);
                this.createFloatingCTA(position);
            }
        } else {
            // Create floating button
            this.log('No suitable header found, creating floating CTA');
            this.createFloatingCTA(position);
        }
        
    // Force visibility with additional technical fallbacks (not color)
        this.ctaButton.style.setProperty('display', 'inline-block', 'important');
        this.ctaButton.style.setProperty('visibility', 'visible', 'important');
        this.ctaButton.style.setProperty('opacity', '1', 'important');
        this.ctaButton.style.setProperty('pointer-events', 'auto', 'important');
        
        this.log('CTA button visibility forced');
    }
    
    /**
     * Find the best insertion point within a header element
     */
    findBestInsertionPoint(headerElement) {
        // Look for common navigation patterns
        const navContainers = [
            headerElement.querySelector('ul'),
            headerElement.querySelector('.nav-links'),
            headerElement.querySelector('.menu-items'),
            headerElement.querySelector('nav'),
            headerElement.querySelector('.navigation'),
            headerElement
        ];
        
        for (const container of navContainers) {
            if (container && container.offsetParent !== null) {
                return container;
            }
        }
        
    return headerElement; // Use header itself if no better container
    }

    /**
     * Create floating CTA button
     */
    createFloatingCTA(position) {
        this.log(`Creating floating CTA at position: ${position}`);
        
        const positionStyles = {
            'top-right': { top: '20px', right: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' }
        };

        const pos = positionStyles[position] || positionStyles['top-right'];
        
        Object.assign(this.ctaButton.style, {
            position: 'fixed',
            zIndex: '999999',
            ...pos
        });

        document.body.appendChild(this.ctaButton);
        this.log('Floating CTA button appended to body');
    }

    /**
     * Handle CTA button click - Toggle theme on/off
     */
    async handleCTAClick() {
        this.log('CTA button clicked - toggling theme');
        
        // Add loading state
        const originalText = this.ctaButton.textContent;
        this.ctaButton.textContent = 'Loading...';
        this.ctaButton.disabled = true;

        try {
            // Check if we have a toggle endpoint
            let response;
            const clientId = `page-${window.location.pathname}`;

            // Always use the production Vercel API first (per project requirement).
            // To avoid CORS preflight failures when running on dev origins, use
            // navigator.sendBeacon if available, or a fetch with mode:'no-cors' as a technical fallback (not color)
            const prodToggle = 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/toggle';
            let requestSucceeded = false;
            let lastError = null;

            try {
                // Try sendBeacon first (fire-and-forget, avoids CORS preflight)
                if (navigator && typeof navigator.sendBeacon === 'function') {
                    try {
                        const payload = JSON.stringify({ clientId });
                        const blob = new Blob([payload], { type: 'application/json' });
                        requestSucceeded = navigator.sendBeacon(prodToggle, blob);
                        this.log('sendBeacon used for toggle, success flag:', requestSucceeded);
                    } catch (beaconErr) {
                        this.log('sendBeacon failed, will try fetch no-cors:', beaconErr.message);
                        requestSucceeded = false;
                    }
                }

                // If sendBeacon unavailable or failed, try fetch with mode:'no-cors' and simple body
                if (!requestSucceeded) {
                    try {
                        // Use URLSearchParams to ensure a simple content type (application/x-www-form-urlencoded)
                        const params = new URLSearchParams();
                        params.append('clientId', clientId);

                        // mode:'no-cors' prevents preflight; response will be opaque, so we treat success optimistically
                        await fetch(prodToggle, {
                            method: 'POST',
                            body: params,
                            mode: 'no-cors'
                        });

                        requestSucceeded = true;
                        this.log('fetch POST (no-cors) attempted to production toggle endpoint');
                    } catch (fetchErr) {
                        lastError = fetchErr;
                        this.log('fetch no-cors failed:', fetchErr.message);
                        requestSucceeded = false;
                    }
                }
            } catch (outerErr) {
                lastError = outerErr;
                requestSucceeded = false;
            }

            if (!requestSucceeded) {
                // If the production endpoint cannot be reached with the above methods, surface a readable error
                throw lastError || new Error('Failed to contact production toggle endpoint');
            }

            // At this point the production API has been contacted (fire-and-forget). No fallback or local color toggle.
            // Only show error if API fails.
            this.ctaButton.textContent = originalText;
            this.ctaButton.disabled = false;
            this.showToggleFeedback('API unavailable - cannot toggle theme', 'error');
            
        } catch (error) {
            this.log('Toggle failed, handling locally:', error.message);
            
            // Always show error if API fails, do not toggle theme locally
            this.ctaButton.textContent = originalText;
            this.ctaButton.disabled = false;
            this.showToggleFeedback('API unavailable - cannot toggle theme', 'error');
        }
    }

    /**
     * Apply theme from toggle API response data
     */
    async applyThemeFromData(themeData) {
        this.log('Applying theme from API data:', themeData.state);
        
        if (themeData.colors) {
            // Apply all color variables to :root
            Object.entries(themeData.colors).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--theme-${key}`, value);
            });
            
            // Apply styling rules if present
            if (themeData.styling_rules) {
                this.applyIntelligentStylingRules(themeData.styling_rules);
            }
            
            // Update current theme state
            this.currentTheme = {
                name: themeData.theme || themeData.state,
                colors: themeData.colors,
                styling_rules: themeData.styling_rules || {},
                applied_at: new Date().toISOString()
            };
            
            // Re-apply intelligent styling if enabled
            if (this.config.intelligentMapping && themeData.state === 'cividis') {
                this.applyIntelligentStyling(this.currentTheme);
            }
            
            this.log(`☑️ ${themeData.state} theme applied successfully`);
            
            // Dispatch theme applied event
            window.dispatchEvent(new CustomEvent('cividis-theme-applied', {
                detail: this.currentTheme
            }));
        }
    }



    /**
     * Apply intelligent styling rules from API
     */
    applyIntelligentStylingRules(stylingRules) {
        if (!stylingRules) return;
        
        this.log('Applying intelligent styling rules from API');
        
        // Remove existing intelligent styling if any
        const existingStyle = document.getElementById('cividis-intelligent-styling');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create new style element
        const styleElement = document.createElement('style');
        styleElement.id = 'cividis-intelligent-styling';
        styleElement.type = 'text/css';
        
        let cssRules = '';
        
        // Process each styling rule
        Object.entries(stylingRules).forEach(([ruleName, rule]) => {
            if (rule.selector) {
                let ruleCSS = `${rule.selector} {\n`;
                
                if (rule.background) {
                    ruleCSS += `  background: ${rule.background} !important;\n`;
                }
                if (rule.text_color) {
                    ruleCSS += `  color: ${rule.text_color} !important;\n`;
                }
                if (rule.border_color) {
                    ruleCSS += `  border-color: ${rule.border_color} !important;\n`;
                }
                
                ruleCSS += '}\n\n';
                cssRules += ruleCSS;
                
                this.log(`Applied rule ${ruleName}:`, rule.description || 'No description');
            }
        });
        
        // Add CSS to style element
        styleElement.textContent = cssRules;
        
        // Append to head
        document.head.appendChild(styleElement);
        
        this.log('☑️ All intelligent styling rules applied');
    }

    /**
     * Show visual feedback for toggle actions
     */
    // Accept optional styleOverrides: { background, color }
    showToggleFeedback(message, type = 'info', styleOverrides = {}) {
        // Create or update feedback element
        let feedback = document.getElementById('cividis-toggle-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'cividis-toggle-feedback';
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                max-width: 300px;
                pointer-events: none;
            `;
            document.body.appendChild(feedback);
        }
        
        // Set style based on type
        const typeStyles = {
            success: { 
                background: 'var(--theme-success, #16a34a)', 
                color: '#ffffff' 
            },
            error: { 
                background: 'var(--theme-warning, #ea580c)', 
                color: '#ffffff' 
            },
            info: { 
                background: 'var(--theme-info, #0ea5e9)', 
                color: '#ffffff' 
            }
        };
        
        const style = typeStyles[type] || typeStyles.info;
        const bg = styleOverrides.background || style.background;
        let color = styleOverrides.color || style.color;

        // If color not explicitly provided, compute a readable one
        if (!styleOverrides.color) {
            color = this.getContrastTextColor(bg);
        }

        feedback.style.background = bg;
        feedback.style.color = color;
        feedback.textContent = message;
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (feedback) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    if (feedback && feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * Utility: Delay function
     */
    async refreshTheme() {
        if (!this.isInitialized) {
            throw new Error('Theme engine not initialized');
        }
        
        await this.fetchAndApplyTheme();
    }

    /**
     * Public API: Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Public API: Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Public API: Destroy theme engine
     */
    destroy() {
        if (this.ctaButton) {
            this.ctaButton.remove();
        }
        
        this.isInitialized = false;
        this.currentTheme = null;
        this.ctaButton = null;
    }
}

// Auto-initialize if not in module environment
if (typeof window !== 'undefined' && !window.CividisTheme) {
    window.CividisTheme = CividisTheme;
    
    // Auto-start with default configuration
    window.cividisTheme = new CividisTheme({
        debug: true, // Enable debug mode by default
        apiEndpoint: 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis', // Production API endpoint
        intelligentMapping: true // Enable intelligent color analysis
    });
    
    // FORCE CTA BUTTON CREATION - BULLETPROOF METHOD
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded - FORCING CTA button creation');
        
        // Wait a bit for everything to load, then force CTA creation
        setTimeout(() => {
            if (window.cividisTheme) {
                console.log('Creating CTA button via timeout (not color fallback)');
                window.cividisTheme.createCTAButton();
            }
            
            // If still no CTA, create it manually
            setTimeout(() => {
                if (!document.getElementById('cividis-cta-button')) {
                    console.log('EMERGENCY CTA CREATION - No CTA found, creating manually');
                    const header = document.querySelector('header nav');
                    if (header) {
                        const ctaButton = document.createElement('button');
                        ctaButton.id = 'cividis-cta-button';
                        ctaButton.textContent = 'Cividis Theme';
                        ctaButton.style.cssText = `
                            background: var(--theme-gradient-cool) !important;
                            color: #ffffffff !important;
                            border: none !important;
                            padding: 4px 8px !important;
                            border-radius: 8px !important;
                            font-size: 12px !important;
                            font-weight: 500 !important;
                            cursor: pointer !important;
                            margin-left: 8px !important;
                            display: inline-block !important;
                            z-index: 999999 !important;
                        `;
                        if (ctaButton) {
                            ctaButton.addEventListener('click', async () => {
                                // Use the same toggle functionality as main class
                                if (window.cividisTheme && window.cividisTheme.handleCTAClick) {
                                    // Update reference to emergency button
                                    const originalButton = window.cividisTheme.ctaButton;
                                    window.cividisTheme.ctaButton = ctaButton;
                                    try {
                                        await window.cividisTheme.handleCTAClick();
                                    } finally {
                                        // Restore original button reference
                                        window.cividisTheme.ctaButton = originalButton;
                                    }
                                } else {
                                    // Open demo page if no toggle available
                                    try {
                                        if (window.location.hostname === 'localhost' || window.location.hostname.includes('colours-matter')) {
                                            window.open('comparison.html', '_blank');
                                        } else {
                                            window.open('https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/comparison.html', '_blank');
                                        }
                                    } catch (e) {
                                        console.log('CTA clicked but no demo available');
                                    }
                                }
                            });
                        }
                        header.appendChild(ctaButton);
                        console.log('EMERGENCY CTA BUTTON CREATED AND INSERTED');
                    }
                }
            }, 2000);
        }, 1000);
    });
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CividisTheme;
}