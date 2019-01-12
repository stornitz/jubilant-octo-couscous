const polka = require('polka');
const path = require('path');
const { readdirSync } = require('fs');

const dir = path.join(__dirname, 'static');
const serve = require('serve-static')(dir);

const { PORT=3000 } = process.env;

const WORKFLOW_DIRECTORY = path.join(__dirname, "../../workflows");
const TRIGGERS_DIRECTORY = path.join(__dirname, "../triggers");
const ACTIONS_DIRECTORY = path.join(__dirname, "../actions");

function loadWorkflows() {
  let workflows = {};

  readdirSync(WORKFLOW_DIRECTORY).forEach(file => {
    let workflowPath = path.join(WORKFLOW_DIRECTORY, file);
    let workflow = require(workflowPath);  
    let workflowName = file.split('.json')[0];
    workflows[workflowName] = workflow;
  });

  return workflows;
}

function loadTriggers() {
  let triggers = {};

  readdirSync(TRIGGERS_DIRECTORY).forEach(file => {
    let triggerPath = path.join(TRIGGERS_DIRECTORY, file);
    let trigger = require(triggerPath);
    let triggerName = file.split('.js')[0];

    // TODO change
    triggers[triggerName] = null;
  });

  return triggers;
}

function loadActions() {
  let actions = {};

  readdirSync(ACTIONS_DIRECTORY).forEach(file => {
    let actionPath = path.join(ACTIONS_DIRECTORY, file);
    let action = require(actionPath);
    let actionName = file.split('.js')[0];

    // TODO change
    actions[actionName] = null;
  });
  return actions;
}

const workflows = loadWorkflows();
const triggers = loadTriggers();
const actions = loadActions();

polka()
	.use(serve)
	.get('/initial-data', (req, res) => {
		res.end(JSON.stringify({ workflows, triggers, actions }));
	})
	.listen(PORT, err => {
		if (err) throw err;
		console.log(`> Running on localhost:${PORT}`);
	});