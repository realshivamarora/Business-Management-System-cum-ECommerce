const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3456;

const server = http.createServer((req, res) => {
    // Serve the HTML file
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        // Handle other requests (e.g., CSS, JavaScript files)
        // You can add more logic here if needed
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
