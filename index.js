var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -p [num] -d [string]')
    .demandOption(['p','d'])
    .default('p', 3101)
    .alias('p', 'port')
    .alias('d', 'directory')
    .argv;
const chokidar = require('chokidar');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client
    const watcher = chokidar.watch(argv.d).on('change', (event, path) => {
        console.log(event, path);
        res.write(`data: ${JSON.stringify({
            event: event,
            path: path
        })}\n\n`);
    });
    res.on('close', () => {
        console.log('client dropped me');
        watcher.close()  
        res.end();
    });
})
app.listen(argv.p, () => {
  console.log(`File Watcher for directory ${argv.d} listening on port ${argv.p}`)
})

