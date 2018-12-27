const http = require('http');

// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');
const TrelloAPI = require('./trello-api.js');

function startServer() {
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

    // TODO check if the call is from Trello
    } else if(req.method === 'HEAD') {
      res.statusCode = 200;
      res.end("ok");

    } else {
      res.statusCode = 400;
      res.end('Unsupported method, please POST a JSON object');
    }
  }).listen(config.server.port, err => {
    if(err) throw err;

    console.log(`Server started at 0.0.0.0:${config.server.port}`);
  });
}

function createWebhook() {
  const Trello = new TrelloAPI(config.trello.key, config.trello.token);

  Trello.createWebhook(config.board_to_watch, config.server.url).then(res => {
    console.log("Webhook created !")
  }).catch(err => {
    console.log(`Error while creating the webhook : ${err.data}`);
  })
}

startServer();
createWebhook()