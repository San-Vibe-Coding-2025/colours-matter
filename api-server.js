/* 
 * Example API Server for Cividis Theme Engine
 * This is a simple Node.js/Express server that provides theme colors
 * Replace this with your actual API implementation
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Toggle state tracking (in production, this would be stored in a database)
let toggleStates = {};

// Cividis color palettes
const themes = {
    cividis: {
        name: "Cividis",
        colors: {
            primary: "#00204c",
            secondary: "#7f7c75",
            accent: "#bbaf71",
            success: "#0a376d",
            warning: "#ffe945",
            info: "#37476b",
            background: "#ffffff",
            surface: "#f8f9fa",
            text: "#1b1b1b",
            border: "#e0e0e0"
        },
        styling_rules: {
            warning_container: {
                background: "var(--theme-info)", // --theme-info with 50% opacity
                text_color: "#ffffff"
            },
            accent_container: {
                background: "var(theme-info)", // --theme-info with 50% opacity
                text_color: "#ffffff"
            }
        }
    },
    alternate: {
        name: "Alternate Cividis",
        colors: {
            primary: "#7A6B13",
            secondary: "#A48B0D", 
            accent: "#CFAB0B",
            success: "#4762a7ff",
            warning: "#FEEA8B",
            info: "#FCEEB6",
            background: "#ffffff",
            surface: "#f8f9fa", 
            text: "#333333",
            border: "#e0e0e0"
        },
        styling_rules: {
            warning_container: {
                background: "rgba(207, 171, 11, 0.5)", // --theme-accent with 50% opacity
                text_color: "#ffffff"
            },
            secondary_container: {
                background: "rgba(252, 238, 182, 0.5)", // --theme-info with 50% opacity
                text_color: "#ffffff"
            }
        }
    },
};

// Get current theme
app.get('/theme', (req, res) => {
    try {
        // You can implement logic to determine which theme to return
        // For demo purposes, we'll cycle through themes based on time
        const themeNames = Object.keys(themes);
        const themeIndex = Math.floor(Date.now() / 30000) % themeNames.length; // Change every 30 seconds
        const themeName = themeNames[themeIndex];
        const theme = themes[themeName];
        
        console.log(`Serving theme: ${theme.name}`);
        
        res.json({
            success: true,
            theme: theme.name,
            colors: theme.colors,
            styling_rules: theme.styling_rules || {},
            meta: {
                timestamp: new Date().toISOString(),
                version: "1.0.0"
            }
        });
    } catch (error) {
        console.error('Error serving theme:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
});

// Get specific theme by name
app.get('/theme/:themeName', (req, res) => {
    try {
        const { themeName } = req.params;
        const theme = themes[themeName.toLowerCase()];
        
        if (!theme) {
            return res.status(404).json({
                success: false,
                error: "Theme not found",
                availableThemes: Object.keys(themes)
            });
        }
        
        console.log(`Serving specific theme: ${theme.name}`);
        
        res.json({
            success: true,
            theme: theme.name,
            colors: theme.colors,
            styling_rules: theme.styling_rules || {},
            meta: {
                timestamp: new Date().toISOString(),
                version: "1.0.0"
            }
        });
    } catch (error) {
        console.error('Error serving specific theme:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
});

// Get list of available themes
app.get('/themes', (req, res) => {
    try {
        const themeList = Object.entries(themes).map(([key, theme]) => ({
            id: key,
            name: theme.name,
            preview: {
                primary: theme.colors.primary,
                secondary: theme.colors.secondary,
                accent: theme.colors.accent
            }
        }));
        
        res.json({
            success: true,
            themes: themeList,
            total: themeList.length
        });
    } catch (error) {
        console.error('Error listing themes:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
});

// Toggle theme endpoint - toggles between Cividis and traditional colors
app.post('/theme/toggle', (req, res) => {
    try {
        const { clientId = 'default' } = req.body;
        const currentState = toggleStates[clientId] || false;
        const newState = !currentState;
        
        toggleStates[clientId] = newState;
        
        if (newState) {
            // Return Cividis colors
            const theme = themes.cividis;
            console.log(`Toggle ON: Serving Cividis theme for client ${clientId}`);
            
            res.json({
                success: true,
                toggled: true,
                state: 'cividis',
                theme: theme.name,
                colors: theme.colors,
                styling_rules: theme.styling_rules || {},
                button_text: 'Turn Off Cividis',
                meta: {
                    timestamp: new Date().toISOString(),
                    version: "1.0.0",
                    clientId: clientId
                }
            });
        } else {
            // Return traditional colors
            console.log(`Toggle OFF: Serving traditional colors for client ${clientId}`);
            
            res.json({
                success: true,
                toggled: false,
                state: 'traditional',
                colors: {
                    primary: '#dc2626',
                    secondary: '#9333ea', 
                    accent: '#059669',
                    success: '#16a34a',
                    warning: '#ea580c',
                    info: '#0ea5e9',
                    background: '#ffffff',
                    surface: '#f8f9fa',
                    text: '#1b1b1b',
                    border: '#e0e0e0'
                },
                button_text: 'Try Cividis Theme',
                meta: {
                    timestamp: new Date().toISOString(),
                    version: "1.0.0", 
                    clientId: clientId
                }
            });
        }
    } catch (error) {
        console.error('Error handling theme toggle:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Endpoint not found",
        availableEndpoints: [
            "GET /theme",
            "GET /theme/:themeName", 
            "GET /themes",
            "GET /health"
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: "Internal server error",
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎨 Cividis Theme API Server running on port ${PORT}`);
    console.log(`📡 Theme endpoint: http://localhost:${PORT}/theme`);
    console.log(`📋 Available themes: ${Object.keys(themes).join(', ')}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;