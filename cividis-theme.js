/**
 * Cividis Theme Engine
 * A pluggable JavaScript theming tool for dynamic CSS variable management
 * 
 * Features:
 * - Fetches theme data from REST API
 * - Dynamically updates CSS variables on :root
 * - Adds CTA button to website header
 * - Error handling and fallback support
 * - Single script inclusion
 */

class CividisTheme {
    constructor(config = {}) {
        this.config = {
            apiEndpoint: config.apiEndpoint || 'https://api.example.com/theme',
            fallbackColors: {
                '--theme-primary': '#00204c',
                '--theme-secondary': '#ccbb68', 
                '--theme-accent': '#64676f',
                '--theme-success': '#0a376d',
                '--theme-warning': '#ffe945',
                '--theme-info': '#37476b',
                '--theme-background': '#ffffff',
                '--theme-text': '#1b1b1b',
                '--theme-text-muted': '#353a45',
                '--theme-border': '#e0e0e0'
            },
            ctaConfig: {
                text: 'Try Cividis Theme',
                position: 'header', // 'header', 'top-right', 'bottom-right'
                gradient: 'linear-gradient(45deg, #ccbb68, #ffe945)'
            },
            retryAttempts: 3,
            retryDelay: 1000,
            debug: config.debug || false,
            ...config
        };

        this.isInitialized = false;
        this.currentTheme = null;
        this.ctaButton = null;
        
        this.init();
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
            // Apply fallback theme first
            this.applyTheme(this.config.fallbackColors);
            
            // Create CTA button
            this.createCTAButton();
            
            // Fetch and apply remote theme
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
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                this.log(`Fetching theme data (attempt ${attempt}/${this.config.retryAttempts})...`);
                
                const response = await fetch(this.config.apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                this.validateThemeData(data);
                
                return data;
                
            } catch (error) {
                this.log(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.config.retryAttempts) {
                    throw error;
                }
                
                // Wait before retry
                await this.delay(this.config.retryDelay * attempt);
            }
        }
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
                this.log(`Warning: Missing required color '${color}', using fallback`);
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
            this.currentTheme = themeData;
            
            this.log('Remote theme applied successfully');
            
        } catch (error) {
            this.handleError('Failed to fetch remote theme, using fallback', error);
        }
    }

    /**
     * Transform theme colors to CSS variables
     */
    transformToCSSVariables(colors) {
        const cssVars = { ...this.config.fallbackColors };

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
    }

    /**
     * Create CTA button for theme activation
     */
    createCTAButton() {
        // Remove existing CTA if present
        if (this.ctaButton) {
            this.ctaButton.remove();
        }

        // Create button element
        this.ctaButton = document.createElement('button');
        this.ctaButton.id = 'cividis-cta-button';
        this.ctaButton.textContent = this.config.ctaConfig.text;
        this.ctaButton.setAttribute('aria-label', 'Activate Cividis Theme');
        
        // Apply styles
        this.applyCTAStyles();
        
        // Add click handler
        this.ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCTAClick();
        });

        // Insert into DOM
        this.insertCTAButton();
        
        this.log('CTA button created and inserted');
    }

    /**
     * Apply styles to CTA button
     */
    applyCTAStyles() {
        const styles = {
            background: this.config.ctaConfig.gradient,
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            zIndex: '9999',
            fontFamily: 'inherit',
            textDecoration: 'none',
            display: 'inline-block',
            margin: '0 8px'
        };

        Object.assign(this.ctaButton.style, styles);

        // Add hover effects
        this.ctaButton.addEventListener('mouseenter', () => {
            this.ctaButton.style.transform = 'translateY(-2px)';
            this.ctaButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });

        this.ctaButton.addEventListener('mouseleave', () => {
            this.ctaButton.style.transform = 'translateY(0)';
            this.ctaButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        });
    }

    /**
     * Insert CTA button into DOM
     */
    insertCTAButton() {
        const position = this.config.ctaConfig.position;
        let targetElement = null;

        // Try to find header element
        const headerSelectors = ['header', '.header', '#header', 'nav', '.navbar', '.nav'];
        
        for (const selector of headerSelectors) {
            targetElement = document.querySelector(selector);
            if (targetElement) break;
        }

        if (targetElement && position === 'header') {
            // Insert into header
            targetElement.appendChild(this.ctaButton);
        } else {
            // Create floating button
            this.createFloatingCTA(position);
        }
    }

    /**
     * Create floating CTA button
     */
    createFloatingCTA(position) {
        const positionStyles = {
            'top-right': { top: '20px', right: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' }
        };

        const pos = positionStyles[position] || positionStyles['top-right'];
        
        Object.assign(this.ctaButton.style, {
            position: 'fixed',
            ...pos
        });

        document.body.appendChild(this.ctaButton);
    }

    /**
     * Handle CTA button click
     */
    handleCTAClick() {
        this.log('CTA button clicked - opening comparison page');
        
        // Add loading state
        const originalText = this.ctaButton.textContent;
        this.ctaButton.textContent = 'Opening...';
        this.ctaButton.disabled = true;

        // Open comparison page
        setTimeout(() => {
            window.open('comparison.html', '_blank');
            
            // Reset button state
            this.ctaButton.textContent = originalText;
            this.ctaButton.disabled = false;
        }, 500);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('cividis-cta-clicked'));
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Error handling
     */
    handleError(message, error) {
        const fullMessage = `Cividis Theme: ${message}`;
        
        if (this.config.debug) {
            console.error(fullMessage, error);
        } else {
            console.warn(fullMessage);
        }

        // Dispatch error event
        window.dispatchEvent(new CustomEvent('cividis-theme-error', {
            detail: { message, error }
        }));
    }

    /**
     * Logging utility
     */
    log(...args) {
        if (this.config.debug) {
            console.log('Cividis Theme:', ...args);
        }
    }

    /**
     * Public API: Manually refresh theme
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
        apiEndpoint: 'https://api.cividis-theme.com/colors' // Replace with your API
    });
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CividisTheme;
}