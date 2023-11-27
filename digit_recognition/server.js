const http = require('http');
const url = require('url');
const fs = require('fs');

const mimeTypes = require('mime-types');

const server = http.createServer((req, res) => 
{
    // handle the request and send back a static file
    // from a folder called digit_recognition
    let parsedURL = url.parse(req.url, true);

    let path = parsedURL.path.replace(/^\/+|\/+$/g, '');
    if (path == '')
    {
        path = 'index.html';
    }

    console.log(`requested path ${path} `);

    let file = __dirname + '\\' + path;
    // async read file function uses callback
    fs.readFile(file, function(err, content)
    {
        if (err)
        {
            console.log(`File not found ${file}`);
            res.writeHead(404);
            res.end();
        } else {
            // specify content type in response
            console.log(`Returning ${path}`);
            res.setHeader('X-Content-Type-Options', 'nosniff');

            let mime = mimeTypes.lookup(path);
            res.writeHead(200, {'Content-Type': mime});
            res.end(content);
        }
    });
});

const PORT = 5000;
server.listen(PORT, 'localhost', () =>
{
    console.log(`listening on port ${PORT}`);
});