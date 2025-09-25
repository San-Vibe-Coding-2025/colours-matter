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
                '--theme-secondary': '#7f7c75', 
                '--theme-accent': '#bbaf71',
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
                gradient: 'var(--theme-gradient-cool)',
                textColor: '#ffffffff'
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
            
            // Apply styling rules if they exist
            if (themeData.styling_rules) {
                this.applyStylingRules(themeData.styling_rules);
            }
            
            this.currentTheme = themeData;
            
            this.log('Remote theme applied successfully');
            
        } catch (error) {
            this.handleError('Failed to fetch remote theme, using fallback', error);
            // Even if API fails, make sure CTA is visible
            if (this.ctaButton) {
                this.log('Ensuring CTA visibility after API failure');
                this.ctaButton.style.setProperty('display', 'inline-block', 'important');
            }
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
        this.ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCTAClick();
        });

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
        this.ctaButton.addEventListener('mouseenter', () => {
            this.ctaButton.style.transform = 'translateY(-2px)';
            this.ctaButton.style.boxShadow = 'var(--theme-shadow-lg)';
        });

        this.ctaButton.addEventListener('mouseleave', () => {
            this.ctaButton.style.transform = 'translateY(0)';
            this.ctaButton.style.boxShadow = 'var(--theme-shadow)';
        });
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
        
        window.addEventListener('resize', this.resizeListener);
        this.log('Resize listener added for CTA button responsiveness');
    }

    /**
     * Insert CTA button into DOM
     */
    insertCTAButton() {
        this.log('Attempting to insert CTA button...');
        const position = this.config.ctaConfig.position;
        let targetElement = null;

        // Try to find header element
        const headerSelectors = ['header', '.header', '#header', 'nav', '.navbar', '.nav'];
        
        for (const selector of headerSelectors) {
            targetElement = document.querySelector(selector);
            if (targetElement) {
                this.log(`Found target element with selector: ${selector}`);
                break;
            }
        }

        if (targetElement && position === 'header') {
            // Insert into header
            targetElement.appendChild(this.ctaButton);
            this.log('CTA button inserted into header element');
        } else {
            // Create floating button
            this.log('No suitable header found, creating floating CTA');
            this.createFloatingCTA(position);
        }
        
        // Force visibility
        this.ctaButton.style.setProperty('display', 'inline-block', 'important');
        this.ctaButton.style.setProperty('visibility', 'visible', 'important');
        this.ctaButton.style.setProperty('opacity', '1', 'important');
        
        this.log('CTA button visibility forced');
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
        apiEndpoint: 'http://localhost:3001/theme/cividis' // Local API endpoint
    });
    
    // FORCE CTA BUTTON CREATION - BULLETPROOF METHOD
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded - FORCING CTA button creation');
        
        // Wait a bit for everything to load, then force CTA creation
        setTimeout(() => {
            if (window.cividisTheme) {
                console.log('Creating CTA button via timeout fallback');
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
                        ctaButton.textContent = 'Try Cividis Theme';
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
                        ctaButton.addEventListener('click', () => {
                            window.open('comparison.html', '_blank');
                        });
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