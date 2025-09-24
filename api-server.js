/* 
 * Example API Server for Viridis Theme Engine
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

// Cividis color palettes
const themes = {
    cividis: {
        name: "Cividis",
        colors: {
            primary: "#3C873D",
            secondary: "#2EBD91", 
            accent: "#16D8BA",
            success: "#4DF9FF",
            warning: "#FCE34F",
            info: "#F7CB17",
            background: "#ffffff",
            surface: "#f8f9fa",
            text: "#333333",
            border: "#e0e0e0"
        }
    },
    alternate: {
        name: "Alternate Cividis",
        colors: {
            primary: "#7A6B13",
            secondary: "#A48B0D", 
            accent: "#CFAB0B",
            success: "#90E3C8",
            warning: "#FEEA8B",
            info: "#FCEEB6",
            background: "#ffffff",
            surface: "#f8f9fa", 
            text: "#333333",
            border: "#e0e0e0"
        }
    },
    warm: {
        name: "Warm Cividis",
        colors: {
            primary: "#E2EECA",
            secondary: "#FFFFB5",
            accent: "#4DF9FF",
            success: "#16D8BA", 
            warning: "#FCE34F",
            info: "#F7CB17",
            background: "#ffffff",
            surface: "#f8f9fa",
            text: "#333333", 
            border: "#e0e0e0"
        }
    }
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
    console.log(`🎨 Viridis Theme API Server running on port ${PORT}`);
    console.log(`📡 Theme endpoint: http://localhost:${PORT}/theme`);
    console.log(`📋 Available themes: ${Object.keys(themes).join(', ')}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;