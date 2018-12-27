const http = require('http');
const path = require("path");
const { readdirSync, existsSync } = require("fs");

// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');
const constants = require('../constants.json');

const TrelloAPI = require('./trello-api.js');
const Trello = new TrelloAPI(config.trello.key, config.trello.token);

const tools = {
  TrelloAPI: Trello
};

function loadWorkflows() {
  const WORKFLOW_DIRECTORY = path.join(__dirname, "../workflows");
  const TRIGGERS_DIRECTORY = path.join(__dirname, "triggers");
  const ACTIONS_DIRECTORY = path.join(__dirname, "actions");

  let workflows = [];
  let actions = {};
  let triggers = {};

  readdirSync(WORKFLOW_DIRECTORY).forEach(file => {
    let workflowPath = path.join(WORKFLOW_DIRECTORY, file);
    let workflow = require(workflowPath);

    if('actions' in workflow) {
      workflow.actions.forEach(action => actions[action.name] = null);
    }

    if('triggers' in workflow) {
      workflow.triggers.forEach(trigger => triggers[trigger.name] = null);
    }

    workflows.push(workflow);
  });

  Object.keys(triggers).forEach(triggerFile => {
    let triggerFilePath = path.join(TRIGGERS_DIRECTORY, `${triggerFile}.js`);

    if(existsSync(triggerFilePath)) {
      triggers[triggerFile] = require(triggerFilePath);
    } else {
      throw `Cannot find trigger "${triggerFile}".`
    }
  });

  Object.keys(actions).forEach(actionFile => {
    let actionFilePath = path.join(ACTIONS_DIRECTORY, `${actionFile}.js`);
    
    if(existsSync(actionFilePath)) {
      actions[actionFile] = require(actionFilePath);
    } else {
      throw `Cannot find action "${actionFile}".`;
    }
  });

  workflows.forEach(workflow => {
    workflow.triggers.forEach((trigger, index) => {
      workflow.triggers[index] = (card) => triggers[trigger.name].call(null, card, trigger, tools, constants);
    });
    workflow.actions.forEach((action, index) => {
      workflow.actions[index] = (card) => actions[action.name].call(null, card, action, tools, constants);
    });
  });

  return workflows;
}

const workflows = loadWorkflows();
console.log(`${workflows.length} workflows loaded.`);

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

          if('action' in requestData && 'card' in requestData.action.data) {
            processEvent(requestData.action.data.card.id);
          }

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
  Trello.createWebhook(config.board_to_watch, config.server.url).then(res => {
    console.log("Webhook registered")
  })
}

async function processEvent(idCard) {
  let res = await Trello.getCardInfos(idCard);
  let card = res.data;

  workflows.forEach(workflow => {
    let triggerOk = true;
    let i = 0;
    
    while(triggerOk && i < workflow.triggers.length) {
      triggerOk = workflow.triggers[i].call(null, card);
      i++;
    }

    if(triggerOk) {
      console.log(`Executing actions for workflow "${workflow.name}" for card ${card.shortLink}.`)
      workflow.actions.forEach(action => action(card));
    }
  })
}

if(config.populate_lists) {
  Trello.request('get', `/boards/${config.board_to_watch}/lists`, {
    cards: 'none',
    filter: 'open',
    fields: 'id,name'
  }).then(res => {
    constants.__lists = {};

    res.data.forEach(list => {
      constants.__lists[list.name] = list.id;
    })
  })
}

if(config.populate_labels) {
  Trello.request('get', `/boards/${config.board_to_watch}/labels`, {
    fields: 'id,name,color'
  }).then(res => {
    constants.__labels = {};
    constants.__labelsByColor = {};
    
    res.data.forEach(label => {
      constants.__labels[label.name] = label.id;
      constants.__labelsByColor[label.color] = label.id;
    })
  })
}

startServer();
createWebhook();