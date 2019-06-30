const http = require('http');
const path = require("path");
const { readdirSync, existsSync } = require("fs");
const { scheduleJob } = require("node-schedule");

// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');
const constants = require('../constants.json');

const TrelloAPI = require('./trello-api.js');
const Trello = new TrelloAPI(config.trello.key, config.trello.token);

const tools = {
  TrelloAPI: Trello
};
const dueDateJobs = {};

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

      let ignoreUsername = ('ignore_username' in config) ? config.ignore_username : null;

      req.on('end', () => {
        try {
          const requestData = JSON.parse(data);

          if('action' in requestData && 'card' in requestData.action.data) {
            if(ignoreUsername != requestData.action.memberCreator.username) {
              processEvent(requestData.action.data.card.id);
            }
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
  Trello.createWebhookIfNotExist(config.board_to_watch, config.server.url).then(alreadyExists => {
    if(alreadyExists) {
      console.log("Using existing webhook.");
    } else {
      console.log("Webhook registered.");
    }
  }, res => {
    console.log("Error while creating webhook HTTP", res.response.status);
    console.log(res.response.data.message);
    exit();
  });
}

function processEvent(idCard) {
  Trello.safe(Trello.getCardInfos(idCard)).then(res => {
    runWorkflows(res.data);  
  }).catch(err => {
    console.log("Ignored empty card data.", err);
  });
}

function runWorkflows(card) {
  if(config.due_date_job) {
    registerDueDateJob(card);
  }

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
  });
}

function registerDueDateJob(card) {
  // if there is no due date and a job is set : delete
  if(card.due == null && card.id in dueDateJobs) {
    let job = dueDateJobs[card.id].job;
    if(job != null) {
      job.cancel();
    }
    delete dueDateJobs[card.id];
  } else {
    // if a job is set, and the card due is different: update = delete + create
    // card.due always != null because otherwise would have trigger the upper if statement
    if(card.id in dueDateJobs && card.due != dueDateJobs[card.id].date) {
        let job = dueDateJobs[card.id].job;
        if(job != null) {
          job.cancel();
        }
    }

    // if there is a due date: create
    if(card.due != null) {
      let job = scheduleJob(new Date(card.due), processEvent.bind(null, card.id));
      //job.on('run', () => delete dueDateJobs[card.id]);

      dueDateJobs[card.id] = {
        date: card.due,
        job: job
      };
    }
  }
}

// Call the runWorkflows function for every card on the board
function processExistingCards() {
  Trello.safe(Trello.getCardsOnBoard(config.board_to_watch)).then(groupRes => {
    groupRes.data.forEach(res => {
      runWorkflows(res["200"]);
    });
  });
}

if(config.populate_lists) {
  constants.__lists = {};

  Trello.safe(Trello.get(`/boards/${config.board_to_watch}/lists`, {
    cards: 'none',
    filter: 'open',
    fields: 'id,name'
  }).then(res => {
    res.data.forEach(list => {
      constants.__lists[list.name] = list.id;
    })
  }));
}

if(config.populate_labels) {
  constants.__labels = {};
  constants.__labelsByColor = {};

  Trello.safe(Trello.get(`/boards/${config.board_to_watch}/labels`, {
    fields: 'id,name,color'
  }).then(res => {    
    res.data.forEach(label => {
      constants.__labels[label.name] = label.id;
      constants.__labelsByColor[label.color] = label.id;
    })
  }));
}

if(config.populate_custom_fields) {
  constants.__customFields = {};
  constants.__customFieldsItems = {};

  Trello.safe(Trello.get(`/boards/${config.board_to_watch}/customFields`).then(res => {
    res.data.forEach(field => {
      constants.__customFields[field.name] = field.id;

      if('options' in field) {
        constants.__customFieldsItems[field.id] = {};

        field.options.forEach(option => {
          constants.__customFieldsItems[field.id][option.value.text] = option.id;
        });
      }
    });
  }));
}

startServer();
createWebhook();
processExistingCards();