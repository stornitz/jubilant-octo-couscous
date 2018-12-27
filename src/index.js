const http = require('http');

// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');

http.createServer((req, res) => {
  // TODO check if the call is from Trello
  if(req.method === 'POST') {

    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(data);

        // TODO do something with the data
        console.log(requestData);

        res.statusCode = 200;
        res.end("ok");
      } catch (e) {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    })

  } else {
    res.statusCode = 400;
    res.end('Unsupported method, please POST a JSON object');
  }
}).listen(config.server.port, config.server.host, (err) => {
  if(err) throw err;

  console.log(`Server started at ${config.server.host}:${config.server.port}`);
});