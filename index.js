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

    // let counter = 0;
    // let interValID = setInterval(() => {
    //     counter++;
    //     if (counter >= 10) {
    //         clearInterval(interValID);
    //         res.end(); // terminates SSE session
    //         return;
    //     }
    //     res.write(`data: ${JSON.stringify({num: counter})}\n\n`); // res.write() instead of res.send()
    // }, 1000);

    // If client closes connection, stop sending events
    const watcher = chokidar.watch('../notes').on('change', (event, path) => {
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
  
app.listen(3101, () => {
  console.log(`Example app listening on port 3101`)
})



