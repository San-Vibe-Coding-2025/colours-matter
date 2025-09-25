/**
 * Cividis Theme Engine (Fixed Version)
 * Improvements:
 * - Use AbortController for fetch timeout
 * - Replace 8-digit hex with rgba for compatibility
 * - Add CTA duplication guard
 * - Add fallback for :has() selectors
 */

class CividisTheme {
    // Initialize the theme engine (was missing, causing error)
    async init() {
        try {
            this.log('Initializing Cividis Theme Engine...');
            // Fetch and apply theme on load
            const themeData = await this.fetchThemeData();
            if (themeData && themeData.colors) {
                this.applyTheme(themeData.colors);
            }
            // Create CTA button
            this.createCTAButton();
            this.isInitialized = true;
            this.log('Cividis Theme Engine initialized successfully');
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }
    log(...args) {
        if (this.config && this.config.debug) {
            console.log('Cividis:', ...args);
        }
    }

    handleError(message, error) {
        console.error('Cividis Theme Error:', message, error);
    }

    constructor(config = {}) {
        this.config = {
            apiEndpoint: config.apiEndpoint || 'https://colours-matter-nhox10gmh-ana-s-apps-projects.vercel.app/api/theme/cividis',
            ctaConfig: {
                text: 'Cividis Theme',
                position: 'header',
                gradient: 'var(--theme-gradient-cool)',
                textColor: 'rgba(255,255,255,1)'
            },
            retryAttempts: typeof config.retryAttempts === 'number' ? config.retryAttempts : 3,
            retryDelay: typeof config.retryDelay === 'number' ? config.retryDelay : 1000,
            debug: config.debug || false,
            intelligentMapping: config.intelligentMapping !== false,
            ...config
        };

        this.isInitialized = false;
        this.currentTheme = null;
        this.ctaButton = null;
        this.detectedColors = null;

        this.init();
    }

    async fetchThemeData() {
        let attempt = 0;
        let lastError = null;
        const maxAttempts = this.config.retryAttempts;
        const delay = this.config.retryDelay;

        while (attempt < maxAttempts) {
            try {
                this.log(`Fetching theme data... (attempt ${attempt + 1})`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(this.config.apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

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

    applyTheme(cssVariables) {
        const root = document.documentElement;
        for (const [variable, value] of Object.entries(cssVariables)) {
            root.style.setProperty(variable, value);
            this.log(`Applied: ${variable} = ${value}`);
        }
        window.dispatchEvent(new CustomEvent('cividis-theme-applied', { detail: { variables: cssVariables } }));
        this.reapplyCTAGradient();
    }

    reapplyCTAGradient() {
        if (this.ctaButton) {
            this.ctaButton.style.setProperty('background', this.config.ctaConfig.gradient, 'important');
            this.ctaButton.style.setProperty('color', this.config.ctaConfig.textColor, 'important');
            this.log('CTA gradient re-applied');
        }
    }

    createCTAButton() {
        // Prevent duplicates
        if (document.getElementById('cividis-cta-button')) {
            this.log('CTA button already exists, skipping creation');
            this.ctaButton = document.getElementById('cividis-cta-button');
            return;
        }

        this.ctaButton = document.createElement('button');
        this.ctaButton.id = 'cividis-cta-button';
        this.ctaButton.textContent = this.config.ctaConfig.text;
        this.applyCTAStyles();

        this.ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCTAClick();
        });

        this.insertCTAButton();
    }

    applyCTAStyles() {
        const styles = {
            background: this.config.ctaConfig.gradient,
            color: this.config.ctaConfig.textColor,
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
            margin: '0 8px'
        };
        Object.assign(this.ctaButton.style, styles);
        this.ctaButton.style.setProperty('background', this.config.ctaConfig.gradient, 'important');
        this.ctaButton.style.setProperty('color', this.config.ctaConfig.textColor, 'important');
    }

    insertCTAButton() {
        const header = document.querySelector('header, .header, #header, nav, .navbar');
        if (header) {
            header.appendChild(this.ctaButton);
            this.log('CTA button inserted into header');
        } else {
            this.createFloatingCTA('top-right');
        }
    }

    createFloatingCTA(position) {
        const pos = { top: '20px', right: '20px' };
        Object.assign(this.ctaButton.style, { position: 'fixed', ...pos });
        document.body.appendChild(this.ctaButton);
        this.log('Floating CTA button appended');
    }

    // Example fallback for :has() (simplified)
    applyWarningContainerStyling(rule) {
        const styleElement = document.getElementById('cividis-warning-styles') || document.createElement('style');
        styleElement.id = 'cividis-warning-styles';
        styleElement.textContent = `.text-warning, .warning-text-container { background: ${rule.background} !important; color: ${rule.text_color} !important; }`;
        document.head.appendChild(styleElement);
        this.log('Warning container styling applied with fallback selectors');
    }
}

if (typeof window !== 'undefined' && !window.CividisTheme) {
    window.CividisTheme = CividisTheme;
    window.cividisTheme = new CividisTheme({ debug: true });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CividisTheme;
}
