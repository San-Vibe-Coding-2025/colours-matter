const http = require('http');

function check(method, path) {
  const opts = { method, hostname: 'localhost', port: 3001, path };
  const req = http.request(opts, res => {
    console.log(`\n${method} ${path} -> STATUS ${res.statusCode}`);
    console.log('HEADERS:', res.headers);
    res.resume();
  });
  req.on('error', e => console.error(`${method} ${path} ERROR:`, e.message));
  req.end();
}

check('OPTIONS', '/theme');
setTimeout(() => check('GET', '/theme'), 500);
