const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathName = parsedUrl.pathname;
    
    // Default to index.html for root
    if (pathName === '/') {
        pathName = '/index.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathName);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // Get file extension
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'text/plain';
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(port, () => {
    console.log(`🌐 HTTP Server running on http://localhost:${port}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔗 Test URLs:`);
    console.log(`   • http://localhost:${port}/index.html`);
    console.log(`   • http://localhost:${port}/comparison.html`);
    console.log(`   • http://localhost:${port}/demo.html`);
});