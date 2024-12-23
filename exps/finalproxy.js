const express = require('express');
const httpProxy = require('http-proxy');
const session = require('express-session');

const app = express();
const PORT = 3000;
const proxy = httpProxy.createProxyServer();

app.use(
    session({
        secret: 'This is a secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 150,
        },
    })
);

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow'); // Prevent search engines from indexing
    next();
});

// Middleware to handle requests with an alphanumeric ID of any size
app.get(/^\/([a-zA-Z0-9]+)$/, (req, res) => {
    const id = req.params[0]; // Captured alphanumeric ID
    req.session.idStored = id;
  res.redirect('/');
});

// Middleware to handle all other requests
app.get('*', (req, res) => {
    const path = req.path;
    if (req.session.idStored && (path.startsWith('/assets/') || path.endsWith('.js') || path.endsWith('.css'))) {
        const id = req.session.idStored;
        const newPath = `/${id}${path}`; // Prepend the ID to the asset path
        //console.log('Proxying asset request:', newPath);
        return proxy.web(req, res, {
            target: `https://d3h0l0li9v1dna.cloudfront.net/${id}`,
            changeOrigin: true,
             // Rewrite the path to include the ID
        });
    }

    // Handle the initial request to set the session ID
    if (!req.session.idStored && path !== '/') {
        //console.log('First call:', path);
        req.session.idStored = path.split('/')[1];
        //res.redirect('/');
        //return;
        return proxy.web(req, res, {
            target: `https://d3h0l0li9v1dna.cloudfront.net`,
            changeOrigin: true,
        });
    } else if (req.session.idStored) {
        const id = req.session.idStored;
        //console.log('Proxying with session ID:', id);
        return proxy.web(req, res, {
            target: `https://d3h0l0li9v1dna.cloudfront.net/${id}`,
            changeOrigin: true,
        });
    } else {
        console.log('No session ID found, and path is invalid.');
        res.status(400).send('Invalid request. Please provide a valid ID.');
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
