const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');

const dotenv = require('dotenv');
const envFile = path.join(__dirname, '.env.local');

dotenv.config({
  path: envFile
});

console.log(path.join(process.cwd(), ".env.teste"))

const next = require('next');
const config = require('./next.options');

const app = next({ dir: __dirname, conf: config });
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
